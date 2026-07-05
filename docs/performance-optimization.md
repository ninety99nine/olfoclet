# Telcoflo V1 — USSD Performance Optimization Plan

> **Companion to the benchmark** `docs/performance-report.md`. That report measures
> *where we are*; this document is the prioritized, code-grounded plan for *going
> faster* — reducing CPU and RAM per request so even small servers perform well,
> **without breaking behaviour**.

| | |
|---|---|
| **Created** | 2026-07-05 |
| **Author** | Claude Opus 4.8 (1M context) |
| **Status** | Plan (no code changed yet — implementation is a phased follow-up) |
| **Benchmark** | `docs/performance-report.md` (clean c6i characterization) |
| **Behaviour gate** | `tests/Support/GoldenMaster.php` + `GoldenMasterFlowTest` + `DeepFlowGoldenTest` (byte-identical) |
| **Load harness** | `loadtest/characterize.sh`, `loadtest/k6/ussd-flow.js`, `loadtest/parse_char.py` |

---

## 1. Executive summary

The benchmark proves one fact that orders this entire document:

> **The USSD engine is purely CPU-bound.** At the knee, box CPU pins at 100% with
> **iowait ≈ 0, steal = 0**, and it is never memory- or network-bound. Ceiling is
> **~55 req/s per vCPU** (~27 dials/s), and an uncontended dial is ~10–16ms.

**Corollary:** the *only* way to raise the ceiling is to **do less CPU work per
request**. Tuning disk, memory, network, or the database *cannot* raise it — those
never bottleneck. Every recommendation below is judged by one question: *does it cut
CPU cycles per dial?*

Three principles govern the work:
- **Benchmark-driven** — every change is A/B'd against `docs/performance-report.md`
  (req/s ceiling, p95/p99-vs-load curve, app-container CPU%). A win = ceiling up
  and/or CPU-per-request down.
- **Safe-by-default** — the byte-identical golden-master suite is a hard gate on every
  change. Nothing ships with a red or silently-regenerated snapshot.
- **Measure everything** — safe, high-ROI wins first; risky/big changes last, each
  isolated in its own phase so a regression is easy to attribute and revert.

**The flagship (big AND safe):** an **in-process/APCu cache of the parsed builder**
(§C3) — today the 100KB–2MB builder JSON is `json_decode`'d into a PHP array on *every*
request; a warm FPM worker should decode it once and reuse it.

**The biggest raw win (but risky, sequenced last):** a **persistent runtime — Laravel
Octane** (§A5) — eliminates the ~10–20ms per-request framework bootstrap that, on a
CPU-bound engine, is pure wasted CPU on every one of the 2 requests per dial.

**Safest quick wins (XS effort, near-zero risk):** OPcache JIT (§A1), composer
classmap-authoritative (§A3), and the micro-opts B4/B5/B6.

**Two honesty callouts** (so nobody over-claims):
1. **`eval()` reduction (§B1/§B2) is the biggest *algorithmic* CPU win but the highest
   behaviour-preservation risk** — it changes the hottest, most output-sensitive code.
2. **Async SMS/email (§C1) does NOT speed up the `*217#` benchmark** — that flow fires
   only REST / Custom-Code / Set-Property / Revisit events. It's a robustness win for
   *other* flows, not a benchmark mover.

---

## 2. Where the CPU actually goes (per request)

From deep code study of `app/Services/Ussd/UssdService.php` (~14k lines) and the
runtime config. Ordered by cost:

1. **`eval()`-based expression evaluation** — `processPHPCode()` (`~13315`, `eval` at
   `~13431`) runs **20–100×/request**. Each call fetches the *entire*
   `dynamic_data_storage` via `getDynamicData()` (`~2898`, no memoization), regex-scans
   the code (`preg_match_all`), materializes variables, then `eval()`s. **eval bodies
   cannot be OPcache'd or JIT'd** — this is the single largest CPU sink.
2. **Framework bootstrap** — no persistent runtime → ~10–20ms of Laravel boot on every
   request (2 per dial), all pure CPU.
3. **Builder decode** — the 100KB–2MB builder JSON is `json_decode`'d from the (Redis)
   cache into a PHP array **every request** (`Version` cast `app/Models/Version.php:19`;
   `setVersion()` `~778-832`), then dereferenced dozens of times.
4. **Mustache-tag handling** — `handleEmbeddedDynamicContentConversion()` (`~13518`)
   routes **every** `{{tag}}` through `processPHPCode("return $var;")` + a per-tag
   `preg_replace` (`~13540`, `~13566`), even for a trivial `{{ company.name }}` that
   `getDynamicData($name)` already resolves directly (`~2922`).
5. **Growing-array churn** — `inputs_and_outputs` is rebuilt via `array_merge` full-copy
   then `json_encode`d every continuation (`~1367-1377`); `reply_records` and
   `inputs_and_outputs` grow **unbounded** (only `session_execution_times` is capped, 50).
6. **Micro-inefficiencies** — O(n²) string concat in chained metadata (`~4107,4121`),
   `collect()` for single-pass filters (`~3118,4049`), and `manageGoBackRequests()`
   O(n³) worst case on deep go-back navigation (`~1785`).

Prior optimization passes (marked `P16`/`P18`/`P20` in the code) already added: a
94.8% short-circuit fast-path in `convertValueStructureIntoDynamicData()` (`~13068`),
referenced-only variable materialization in `processPHPCode()`, and on-start HTTP
response replay cached in `session_state`. The items below are what remains.

---

## 3. Recommendations by tier

Template per item — **Cost removed · Impact · Risk · Effort · Validation.**
Rough % impacts are directional estimates to be confirmed by A/B, not guarantees.

### Tier A — Infra / runtime (config-level; no engine behaviour change)

#### A1. Enable OPcache JIT (tracing, 64M buffer)
- **Cost removed:** JIT is effectively **off** (`docker/php/opcache.ini` sets no `jit`/
  `jit_buffer_size`). A CPU-bound interpreted workload leaves JIT gains on the table.
- **Impact:** ~10–25% CPU/request on the ~600KB `UssdService` + framework code.
  *Note:* `eval()` bodies can't be JIT'd, so the win lands on the engine/framework, not
  the dynamic expressions.
- **Risk:** Low (pure perf); small chance of a JIT codegen bug → covered by golden-master + canary.
- **Effort:** XS — two ini lines: `opcache.jit=tracing`, `opcache.jit_buffer_size=64M`.
- **Validation:** req/s ceiling ↑; app CPU% at fixed VU ↓; p95 curve shifts right.

#### A2. OPcache preload (engine + framework)
- **Cost removed:** No `opcache.preload` → classes are linked lazily each request atop
  a no-persistent-runtime bootstrap.
- **Impact:** ~5–15% bootstrap/CPU reduction, largest on the giant `UssdService`.
- **Risk:** Low–moderate — the preload script must not eager-instantiate stateful
  services; rebuilt per deploy (safe: immutable image + `validate_timestamps=0`).
- **Effort:** S — a preload script + one ini line.
- **Validation:** the ~10–16ms uncontended dial should drop; ceiling ↑.

#### A3. Composer classmap-authoritative (+ APCu autoloader)
- **Cost removed:** `optimize-autoloader` is on but `classmap-authoritative` and
  `apcu-autoloader` are off → residual filesystem `stat`/lookup on class loads.
- **Impact:** ~1–5%; free and safe.
- **Risk:** Very low (fails loudly at build if a class is missing).
- **Effort:** XS — `composer install --classmap-authoritative` in the Dockerfile.
- **Validation:** marginal CPU/request ↓. A safe quick win.

#### A4. Unpin PHP → 8.3 / 8.4
- **Cost removed:** `nette/utils v4.0.0` (`>=8.0 <8.3`) blocks the newer engine + better
  JIT codegen. It enters via `league/commonmark → league/config → nette/schema`, and
  `nette/schema` already allows `^4.0` — so **bumping `nette/utils` alone frees the pin**.
- **Impact:** ~5–15% on hot interpreted code from the PHP version alone, and makes A1/A2
  gains larger.
- **Risk:** Moderate — runtime/base-image bump; wide blast radius; deprecation surface.
  Mitigate: bump `nette/utils` only, full suite + golden-master, canary.
- **Effort:** M — bump dep, base image `php:8.3-fpm`→`8.4-fpm`, re-verify extensions
  (redis/intl/gd/bcmath/zip/pdo_mysql), rebuild.
- **Validation:** full re-characterization; ceiling ↑ across all sizes.

#### A5. Persistent runtime — Laravel Octane (Swoole/RoadRunner)
- **Cost removed:** No persistent runtime → **~10–20ms framework bootstrap per request**,
  pure wasted CPU on every one of the 2 requests/dial.
- **Impact:** **Potentially the largest raw win** — on small boxes, bootstrap is a big
  fraction of the 10–16ms dial.
- **Risk:** **HIGH.** Octane keeps the app in memory across requests; the ~14k-line
  `UssdService` holds request state (`dynamic_data_storage`, `existing_session`,
  `version`, `loggingEnabled`, …). **Any state leaked between requests silently corrupts
  sessions.** A behaviour-preservation minefield.
- **Effort:** L — add Octane; audit every stateful property/singleton for reset; worker
  lifecycle; static leaks.
- **Validation:** ceiling ↑ **and** golden-master byte-identical across a long multi-dial
  **soak** (state-bleed only appears across requests). Any bleed = no-go. Sequenced last.

### Tier B — Engine / algorithmic (touches the hot path; behaviour risk)

> **Lesson from V2 (`telcoflo-new`), and my performance verdict.** V2 (a leaner
> ~3.1k-line rewrite) already removed `eval` from the common path — but as a
> **security-first** design, and it is a *mixed* result for performance:
>
> - ✅ **Native structured evaluation — adopt this.** V2 stores conditions as
>   `{path, operator, value}` and evaluates them **natively**:
>   `evaluateWhen()` → `resolveVariables()` + `compareValues()`
>   (`telcoflo-new .../UssdService.php:2455`). No eval, no parser, no network. It is
>   **faster AND safer** — exactly the win-win B1/B2 pursue.
> - ❌ **External HTTP sandbox — do NOT adopt for V1's hot path.** Arbitrary custom
>   code is shipped to a sandbox **microservice over HTTP**:
>   `executeCode()` → `Http::timeout(2)->post($sandboxUrl)` (`:3072`). Isolated and
>   safe, but a **network round-trip per code block** (+ context serialization, 2s
>   timeout) that blocks a worker on I/O. On a CPU/latency-bound USSD path this
>   **trades performance away for security** — it would make V1 *slower*, not faster.
>
> **My verdict — the performance-optimal model is a three-tier evaluator:**
> 1. **Pure lookups** (`{{ company.name }}`, `$ussd.user_response`) → direct path
>    resolution, **no eval** (B1). Covers the majority of tags. Fastest + safest.
> 2. **Simple expressions** (comparisons / boolean / arithmetic / concat) → **native
>    evaluation** (V2's `compareValues` style) via a runtime classifier, or
>    `symfony/expression-language` with **compiled-and-cached** expressions (compile
>    once per unique expression, reuse via APCu — the caching is what makes it beat
>    eval; an uncached parse is *slower* than eval) (B2). Safe + fast on repeat.
> 3. **Genuinely arbitrary code** (`code_editor_mode`) → keep **in-process**, ideally
>    a compiled closure guarded by an **AST allowlist** (`nikic/php-parser`, which V2
>    already ships) — most of the security with **none of the network cost**. Only
>    fall back to an out-of-process sandbox if hard isolation is a hard requirement,
>    and then **cache/precompute its result off the hot path** (V1 already does this
>    for on-start HTTP via P20 `session_state` replay — the same idea applies).
>
> **Bottom line:** adopt V2's *native evaluation*; **reject its network sandbox on the
> critical path.** Tiers 1–2 are B1/B2 below; the tier-3 security↔performance fork is
> a deliberate decision (trusted builder-authors → in-process is fine; untrusted →
> AST allowlist in-process before ever reaching for a network sandbox).

#### B1. Bypass `eval()` for pure dotted-path `{{tags}}`  *(evaluator tier 1)*
- **Cost removed:** `handleEmbeddedDynamicContentConversion()` sends every `{{tag}}`
  through `processPHPCode("return $var;")` → `getDynamicData()` + `preg_match_all` +
  `eval()` + `preg_replace` (`~13540`), even for a trivial `{{ company.name }}`. Replace
  the pure dotted-path case with a direct `getDynamicData($name)` (resolves dot paths at
  `~2922`), removing an eval per tag.
- **Impact:** **Large on tag-heavy screens** — the biggest *algorithmic* lever.
- **Risk:** **Moderate–high** — must exactly preserve output for edge cases (type
  coercion via `convertToString`, missing vars, the log lines). Only short-circuit when
  the tag is a pure property chain with no operators/calls; everything else falls
  through to eval unchanged.
- **Effort:** M.
- **Validation:** golden-master byte-identical (mandatory) + ceiling ↑, CPU/request ↓.

#### B2. Native evaluation of simple expressions + per-request compiled/result cache  *(evaluator tier 2)*
- **Cost removed:** identical code strings re-`eval()` every occurrence within a request
  (`processPHPCode` at `~13084/13099/13104`).
- **Impact:** Moderate (depends on expression repetition per flow).
- **Risk:** Moderate — the cache key must include the referenced dynamic-var fingerprint;
  a wrong key = wrong output.
- **Effort:** M.
- **Validation:** golden-master + CPU/request ↓.

#### B3. Memoize `getDynamicData()` full-array fetch
- **Cost removed:** the no-arg `getDynamicData()` returns the entire `dynamic_data_storage`
  (`~2901`) on every `processPHPCode` (`~13354`); on 1–10MB storage that's a big pass per
  call. Memoize the whole-array reference; invalidate on mutation.
- **Impact:** Moderate (fewer big-array passes, better cache locality).
- **Risk:** Low–moderate — must invalidate on every write to `dynamic_data_storage`.
- **Effort:** S–M.
- **Validation:** golden-master + CPU/request ↓.

#### B4. `array_merge` full-copy → append (`inputs_and_outputs`)
- **Cost removed:** `~1367` deep-copies the whole growing array each continuation, then
  `json_encode`s it (`~1377`). Replace with `$arr[] = …` on a local reference.
- **Impact:** Small per-request, grows with session depth; also cuts RAM churn.
- **Risk:** **Very low** (pure equivalent).
- **Effort:** XS.
- **Validation:** golden-master + CPU/request ↓ on deep sessions.

#### B5. Fix O(n²) string concatenation in chained metadata (`~4107,4121`)
- **Cost removed:** repeated `$str .= …` builds large strings quadratically.
- **Impact:** Small–moderate on large metadata.
- **Risk:** Very low. **Effort:** XS.
- **Validation:** golden-master + CPU/request ↓.

#### B6. Replace `collect()` used for single-pass filters (`~3118,4049`)
- **Cost removed:** Collection allocation for what a native `array_filter`/`foreach` does.
- **Impact:** Small (allocation/GC pressure). **Risk:** Very low. **Effort:** XS.
- **Validation:** golden-master + marginal CPU ↓.

#### B7. Fix `manageGoBackRequests()` O(n³) worst case (`~1785`)
- **Cost removed:** cubic cost on deep go-back sessions → CPU spikes on pathological navigation.
- **Impact:** Small on the shallow `*217#` benchmark; **large on tail latency** for deep
  sessions (the p99 the report calls "the enemy").
- **Risk:** Moderate (subtle navigation logic). **Effort:** M.
- **Validation:** golden-master (esp. invalid-input/replay sequences) + tail latency; won't move the `*217#` median.

### Tier C — I/O / write-path (does NOT raise the CPU ceiling; trims work + protects tail)

#### C3. In-process / APCu builder cache — **FLAGSHIP (big AND safe)**
- **Cost removed:** the 100KB–2MB builder is `json_decode`'d from the cache store into a
  PHP array on **every** request (`Version` cast `:19` + `Cache::remember` `~811/827`).
  Add an **in-process static (or APCu) layer** so a warm FPM worker (`pm=static`) reuses
  the decoded array instead of re-decoding per request.
- **Impact:** **Large and safe** — removes a big fixed CPU cost from *every* request,
  including `*217#`.
- **Risk:** **Low** — immutable per version id; invalidate on version change;
  `pm.max_requests=1000` recycles workers.
- **Effort:** S.
- **Validation:** the uncontended 10–16ms dial should drop measurably; ceiling ↑ across
  all sizes. *(Listed in Tier C by mechanism, but treated as the flagship — see §5.)*

#### C2. Cap unbounded session payloads
- **Cost removed:** `reply_records` and `inputs_and_outputs` grow **unbounded** (only
  `session_execution_times` is capped at 50); every continuation `json_encode`s the
  growing mediumtext columns (`~1377`) and writes 2–3 rows/request.
- **Impact:** Cuts CPU (encode) + RAM + write size, growing with session depth; protects
  the deep-session tail.
- **Risk:** **Moderate** — capping changes persisted data. The golden-master snapshots the
  final session row, so this is directly guarded (a cap will change the snapshot → needs a
  reviewed `UPDATE_GOLDEN`).
- **Effort:** S–M.
- **Validation:** golden-master final-row snapshot (reviewed) + CPU/write-size ↓.

#### C1. Async SMS/email via queue
- **Cost removed:** SMS/email events make synchronous outbound HTTP calls inline in the
  request (`sendSmsViaOrangeUsingREST` `~8131`), blocking the USSD response. `QUEUE=redis`
  in prod, but the engine calls Guzzle directly rather than dispatching a job.
- **Impact:** **ZERO on `*217#`** (verified — no SMS/email on that flow). A real win for
  flows that *do* send.
- **Risk:** Low–moderate (delivery-timing behaviour changes; flows asserting on SMS
  side-effects must still match).
- **Effort:** S.
- **Validation:** validate on an SMS-firing flow's latency + that no golden snapshot
  regresses. **Do not sell as a `*217#` speedup.**

---

## 4. Phased implementation roadmap

Each phase ends with the same gate: **re-run `characterize.sh` on the same instance
size(s) → compare req/s ceiling + p95/p99 curve + app CPU% to `docs/performance-report.md`
→ run `phpunit --group golden` (byte-identical) → go/no-go.**

| Phase | Contents | Why here | Go/no-go gate |
|---|---|---|---|
| **0 — Baseline lock** | Re-run the matrix on current build; snapshot golden-master | Establishes the A/B control | Reproduce ceiling within ±5% of the report; golden green |
| **1 — Safe infra** | A1 JIT, A2 preload, A3 composer flags, **C3 builder cache** | Highest safe payoff; no engine behaviour change | Ceiling ↑ (target +10–25% aggregate); golden byte-identical; low-VU dial ↓ |
| **2 — Safe micro-opts** | B4 array_merge, B5 O(n²) concat, B6 collect, C2 payload cap | Pure-equivalent or snapshot-guarded | Golden byte-identical (C2 → reviewed `UPDATE_GOLDEN`); CPU/request ↓ |
| **3 — PHP unpin** | A4 (`nette/utils` bump → 8.3 → 8.4) | High value, moderate risk; isolate it | Full suite + golden green; re-characterize all sizes; ceiling ↑ |
| **4 — eval reduction** | B1 simple-lookup bypass, B2 expr cache, B3 getDynamicData memo | Dominant CPU lever but behaviour-sensitive — one sub-change at a time | Byte-identical golden **hard-mandatory**; ceiling ↑; any diff = revert |
| **5 — tail + async** | B7 go-back, C1 async SMS/email | Target the tail / other flows | Golden green; tail latency ↓; `*217#` ceiling unchanged is acceptable |
| **6 — Octane** | A5 persistent runtime | Biggest raw win, highest risk — last | Golden byte-identical across a **soak** AND ceiling ↑; any state bleed = no-go |

---

## 5. Highest-leverage change + safest quick wins

- **Flagship (big AND safe) → lead with this:** **C3 in-process/APCu builder cache.**
  Removes the 100KB–2MB decode from every request; low risk (immutable per version);
  fits the warm-worker `pm=static` model.
- **Biggest raw win (risky → last):** **A5 Octane.** Eliminates per-request bootstrap.
- **Safest quick wins (Phase 1/2, XS effort, near-zero risk):** A1 JIT ini, A3 composer
  `--classmap-authoritative`, B4 append, B5 array-join, B6 drop `collect()`.
- **Honesty callouts:** B1/B2 eval-reduction = biggest *algorithmic* win but highest
  behaviour risk; C1 async SMS/email does **not** move the `*217#` benchmark.

---

## 5b. Empirical results & a note on fair testing (2026-07-05)

First implementation pass, A/B'd on the `*217#` start flow (45s saturating hold, 8 vCPU):
- **JIT (A1): +1%** (noise) — eval bodies can't be JIT'd; kept as harmless/foundational.
- **B1 eval-bypass (cached-closure form): FLAT** (404→406 req/s), though **behaviour
  was byte-identical (11/11 golden green, both live services).** Reverted per the
  "only accept positive" rule.

**Why B1 was flat — and why the test was NOT fair to eval optimisation:** the
`*217#` *start* screen renders a near-static menu (very few mustache tags), so the
dialled flow is **eval-light**. The 160 tags live across 19 screens the benchmark
never visits. Profiling the start request confirmed the cost is **~87% engine
(handleSessionRequest: REST + session I/O + state-machine), ~13% bootstrap, and
near-zero eval** — so an eval optimisation *cannot* move this benchmark.

**FUTURE WORK — give eval optimisations a fair A/B:** build a load-test scenario
that walks a **multi-screen, tag-heavy eval sequence** (e.g. `*250#` account/order
screens with `{{ customer.name }}`, `{{ order.number }}`, conditional displays) to a
final outcome, seeding the canned CMS responses it needs. Only against that
eval-heavy flow can B1/B2 (and the three-tier evaluator in §B) be fairly measured.
The cached-closure B1 is proven safe (golden-gated) and ready to re-test there.

## 6. Validation methodology

- **A/B protocol:** identical `characterize.sh` VU matrix, same instance size, same
  `ussd-flow.js` commit, **mock CMS** (isolate the engine — report §2.1),
  `pm.max_children = 8×vCPU`. Compare three curves: (a) sustained **req/s ceiling**,
  (b) **p95/p99 vs VU**, (c) **app-container CPU%** (read capacity directly, not polluted
  by co-located k6 — report §2.2). Win = ceiling ↑ and/or CPU% at fixed VU ↓ with the p95
  curve shifting right.
- **Behaviour gate:** `vendor/bin/phpunit --group golden` must be **byte-identical**
  (`GoldenMaster.php`); `GoldenMasterFlowTest` + `DeepFlowGoldenTest` cover every screen +
  the normalized final session row over the real builder. No change ships with a red or
  silently-regenerated snapshot.
- **Statistical hygiene:** ≥3 runs/level, report the median, discard the warm-up level;
  confirm iowait≈0 / steal=0 still hold (still CPU-bound); watch for memory regressions
  (APCu/Octane).
- **Canary:** deploy behind a version/percentage canary before fleet-wide; immutable image
  + `validate_timestamps=0` means rollback = redeploy the prior image.

---

## 7. Appendix — code reference index

Hot path — `app/Services/Ussd/UssdService.php`:
- `processPHPCode()` (`~13315`, `eval` `~13431`) · `getDynamicData()` (`~2898/2922`)
- `convertValueStructureIntoDynamicData()` (`~13044`, fast-path `~13068`)
- `handleEmbeddedDynamicContentConversion()` (`~13518`, per-tag eval `~13540`, `preg_replace` `~13566`)
- `inputs_and_outputs` `array_merge`/encode (`~1367-1377`) · chained-metadata concat (`~4107,4121`)
- `collect()` single-pass (`~3118,4049`) · `manageGoBackRequests()` (`~1785`)
- session writes (`~1129-1212` insert, `~1217-1395` update, globals `~1486-1523`)
- builder cache (`setVersion` `~778-832`) · SMS (`sendSmsViaOrangeUsingREST` `~8131`)

Config/build:
- `docker/php/opcache.ini` (JIT + preload) · `Dockerfile` (composer flags, base-image PHP, preload wiring)
- `composer.json` / `composer.lock` (`nette/utils` v4.0.0 → unpin) · `app/Models/Version.php:19` (builder `array` cast)
- `.env.docker` (CACHE/SESSION/QUEUE=redis; APP_DEBUG=false) · `docker/php/www.conf` (`pm=static`, `max_children`, `max_requests=1000`)

Validation assets:
- Benchmark: `docs/performance-report.md`
- Harness: `loadtest/characterize.sh`, `loadtest/k6/ussd-flow.js`, `loadtest/parse_char.py`
- Golden-master: `tests/Support/GoldenMaster.php`, `tests/Feature/Ussd/GoldenMasterFlowTest.php`, `DeepFlowGoldenTest.php`
