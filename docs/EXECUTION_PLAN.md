# Telcoflo V1 — Master Execution Plan

> **This is the single source of truth.** Every agent working on this program reads this file first,
> executes the relevant phase, and then **edits this file** to update phase status and append feedback.
> Keep it current. When a phase completes, set its status and write a dated feedback entry.

---

## Context — why this program exists

Telcoflo V1 (`~/Sites/olfoclet`) is a Laravel 10 / PHP 8.1 USSD platform running **live** for Orange
Botswana. Under SMS-campaign traffic spikes it returns "Unknown Error" because of an O(n)-per-keystroke
session-replay architecture, missing DB indexes, file-based cache, and untuned PHP/MySQL. A performance
audit produced three implementation files (`docs/performance/01…`, `02…`, `03…`) and a behaviour-preserving
**test harness is already in place** (`docs/performance/04_TEST_HARNESS.md`: 25 regression tests green,
33 target/acceptance tests pending).

The goal: implement the three fix files behind that safety net, containerise the app for reproducible
deployment, stand up an AWS staging replica of the Orange server, drive it with **K6** while watching
**Prometheus/exporters + Grafana Cloud**, find and fix bottlenecks one by one, then plan a safe cutover to
the real Orange production server. Telcoflo V2 (`~/Sites/telcoflo`) is a separate ground-up rebuild; **V1
must keep running** because live services depend on it.

## Key decisions (locked)

1. **Docker architecture:** production-grade **nginx + php-fpm** (tuned + OPcache) + MySQL + Redis + queue
   worker + scheduler — mirrors the post-File-01 architecture and the real Orange box, so K6/PHP-FPM metrics
   are meaningful. (Telcoflo V2 uses Laravel Sail / `artisan serve`; we deliberately deviate because Sail's
   single-process server cannot reveal worker-pool bottlenecks.)
2. **External Orange deps in staging:** a **mock server** container returns canned CMS
   (`192.168.22.202`), STK (`192.168.22.87`), and Orange SMS/token responses, so USSD flows complete
   deterministically and K6 isolates *our* bottlenecks from external latency.
3. **Staging DB:** **restore a dump of the real local `telcoflo` DB** (real versions/builders/short_codes/
   accounts), optionally sanitised (strip tokens/PII), so load tests run genuine flows.

## Conventions

- **Milestone commits (per user):** commit at every phase completion as a clean rollback milestone, plus
  smart intermediate commits whenever a coherent unit is done (e.g. each File 01 "Problem" per its own
  commit protocol). Commit messages should name the phase/problem. Never sweep unrelated pre-existing
  dirty build artifacts into these commits — stage only the files that belong to the change.
- **Naming/isolation (avoid clashing with V2 "Telcoflo"):** compose project `telcoflo-v1`, image
  `telcoflo-v1/app`, container prefix `telcoflo-v1-*`, distinct host ports (app `8080`, mysql `3307`,
  redis `6380`) so V1 and V2 can coexist on one machine.
- **Git:** one branch per phase (`perf/phase-1-safe-fixes`, `perf/phase-3-json-structure`, …), keep this
  file updated as part of the phase. Never commit secrets/dumps.
- **Test gate for every code phase:** `vendor/bin/phpunit --exclude-group target` must stay **green**
  (behaviour preserved); the matching `--group fileNN` target tests must **go green** (fix landed).
- **The harness already contains the acceptance tests** for all three files (see `04_TEST_HARNESS.md`).
  So the "create tests" phases (2/4/6) are mostly **activate + verify + fill gaps + re-baseline golden**,
  not writing from scratch.

## Status legend & tracker

`⬜ pending` · `🟨 in progress` · `✅ completed` · `⛔ blocked`

| Phase | Title | Owner | Status |
|------:|-------|-------|--------|
| 0 | Test harness + execution plan (groundwork) | agent | ✅ |
| 1 | Implement `01_SAFE_NON_BREAKING_FIXES.md` | agent | ✅ (15/20; see notes) |
| 2 | Verify/extend tests for File 01 (+ land P18/P19/P20) | agent | ✅ |
| 3 | Implement `02_BREAKING_JSON_STRUCTURE_FIXES.md` | agent | ✅ backend + full frontend companion (settings panels + per-element fidelity, Playwright-verified on legacy & converted) |
| 4 | Verify/extend tests for File 02 | agent | ✅ core |
| 5 | Implement `03_JSON_COMPATIBILITY_MIGRATION.md` | agent | ✅ (converter built, tested, run on dev DB) |
| 6 | Verify/extend tests for File 03 | agent | ✅ core (14 file03 tests green; full suite 59 green) |
| 7 | Study V2 Docker + build V1 production Docker setup | agent | ✅ (image builds; nginx+fpm+mysql+redis+worker+scheduler+mock) |
| 8 | Deploy V1 via Docker ("Telcoflo V1"), full boot | agent | ✅ (all 7 services up; app + converted data verified in-browser on :8080) |
| 9 | Manual USSD service re-testing | **user** | ⬜ |
| 10 | AWS staging + monitoring + K6 load testing | agent + user | ⬜ |
| 11 | Production cutover strategy to Orange server | agent + user | ⬜ |

---

## Phase 0 — Test harness + execution plan (groundwork)  ✅
Behaviour-preserving MySQL test harness built against the real First-Aid builder (v4): golden-master flow
snapshots, engine helper unit tests, and 33 skip-until-implemented acceptance tests grouped
`target`/`file01`/`file02`/`file03`. See `docs/performance/04_TEST_HARNESS.md`. State: **25 regression
green, 33 target pending, 0 failures.** This plan document created.

---

## Phase 1 — Implement `01_SAFE_NON_BREAKING_FIXES.md`  🟨
**Depends on:** none. **Branch:** `perf/phase-1-safe-fixes`.

**Objective:** apply all 20 non-breaking performance fixes (no builder-JSON shape change), in the file's
commit order (least → most severe), each as its own commit.

**Steps**
1. Re-read `docs/performance/01_SAFE_NON_BREAKING_FIXES.md`. Re-locate every anchor by `grep -n "function <name>"`
   (line numbers drift in the 13.7k-line `UssdService.php`).
2. Apply Problems 1→20 as separate commits with the file's exact messages. Highlights:
   - P1 double-decode, P2 `removeEmojis`, P3 cap `session_execution_times`, P4 persistent PDO, P5 Guzzle
     client+timeouts, **P6 migration** (`session_id`/`created_at`/gv/notification indexes), P7 buffer pool
     (server — record only), P8 Redis drivers (`.env` on server), P9 `Cache::remember`, P10 archiving
     command+schedule, P11 gv cache+invalidation, P12 screen/display hash maps, P13 native arrays, P14
     memoise, P15 drop `$with`/`$appends` (update dashboard callers), P16 ValueStructure fast-path, P17
     logging guard, P18 lazy var extraction, P19 batch mustache, **P20 session-state fast path** (nullable
     `session_state` column + capture/restore, full-replay fallback).
3. Infra items (P4 buffer pool, P8 Redis, OPcache/FPM) are applied in the **Docker image** (Phase 7), not
   the app repo — note them here and carry forward.
4. After **each** commit: `vendor/bin/phpunit --exclude-group target` (behaviour green) and
   `vendor/bin/phpunit --group file01` (watch that problem's target test flip to green).

**Deliverables:** commits per problem; new migrations `…add_performance_indexes`,
`…add_session_state_to_ussd_sessions`; `sessions:archive` command + schedule; modified `UssdService.php`,
`UssdSession.php`, `config/database.php`.

**Verification:** full `--exclude-group target` green; `--group file01` all green **except** the infra-only
items (P4/P8 documented as server-side); golden snapshots unchanged (behaviour preserved). Run
`php artisan migrate` on a scratch DB cleanly.

**Feedback log (2026-07-03):** In progress. Regression stays green throughout (25 tests / 66 assertions);
golden-master byte-identical after every change.
- **Done & committed (13 problems):** P1 (decode once), P2 (single-pass removeEmojis), P3 (cap exec times),
  P4 (persistent PDO), P5 (reused Guzzle client + timeouts — http_errors/verify left per-request as a safer
  deviation), P6 (hot-path indexes migration), P9 (Cache::remember ×7), P10 (sessions:archive command +
  archive table + daily schedule), P11 (global_variables cache + invalidation), P12 (screen/display id hash
  maps), P15 (dropped `$with=['account']`; **retained `$appends`** deliberately — wide, test-unverified
  dashboard surface), P16 (empty-ValueStructure fast-path), P17 (processPHPCode logging guard).
- **File01 target tests now green:** P3(cap), P4(PDO), P5(guzzle), P6(5 index tests), P10(archiving),
  P15(eager-load). Remaining file01 targets still skip pending their fix.
- **Infra (no repo change — applied in Phase 7 Docker image):** P7 (InnoDB buffer pool), P8 (Redis
  cache/session/queue drivers), plus OPcache/PHP-FPM tuning.
- **Deliberately deferred (documented, safe to skip):**
  - **P13** (collect()→native arrays): broad, low value; spec says "leave as Collection when unsure".
  - **P14** (memoise extractUserResponsesAsText): correctness footgun — a single missed invalidation among
    6 reply_records mutation sites (1876/1945/1959/1993/2563/2576) sends stale `text` to the gateway; benefit
    largely superseded by P20.
  - **P18** (lazy var extraction) & **P19** (batch mustache): highest-care 🟠; spec advises deferring when
    coverage is thin. Our golden flows are shallow (Welcome→Join/Exit), so a regression on deeper menus would
    go uncaught. **Do these in Phase 2 after adding deeper app fixtures.**
  - **P20** (session-state fast path — THE headline fix): all-or-nothing (its target asserts continuations
    fire 0 on-start REST calls). The spec mandates studying `handleCurrentDisplay` in full + staging
    verification against **deep** sessions; our fixtures don't yet exercise depth. **Sequenced into Phase 2:**
    add the deeper fixtures + P20 depth/parity test FIRST, then implement P20 against that safety net.

**Next step:** Phase 2 — add deeper app fixture(s) + P20 depth test, then land P18/P19/P20 behind them.

**Update (2026-07-03, Phase 2 progress):** P18 (lazy var extraction) is now **done & committed**,
verified byte-identical across all 5 golden flows incl. the new deep navigation. So File 01 landed = 14/20
(P1–P6, P9–P12, P15–P18). Still deferred: P13, P14, P19 (documented micro-opts), P7/P8 (infra→Docker).
**P20 remains the one open flagship** — see Phase 2 feedback for the attempt + the path forward.

---

## Phase 2 — Verify/extend tests for File 01  ⬜
**Depends on:** 1. **Objective:** prove File 01 is correct and complete via the harness.

**Steps**
1. `vendor/bin/phpunit --group file01` → every File 01 target test must now be **green** (they auto-activate
   on their structural markers). Investigate any that still skip (marker not produced ⇒ fix incomplete).
2. `vendor/bin/phpunit --exclude-group target` → regression + golden still green.
3. Fill gaps the harness doesn't yet cover: a dedicated **P20 depth test** (drive a deeper flow / more
   continuations and assert output parity + 0 on-start REST calls on resume), a **P11 invalidation** test
   (write a global var → next request sees it), and a **P9 concurrency/no-duplicate-DB-hit** check if
   feasible. Add a second, deeper app fixture if needed for real replay depth.
4. Commit added tests. Update `04_TEST_HARNESS.md` coverage map.

**Verification:** File 01 target group green; regression green; documented which items remain server-side.

**Feedback log (2026-07-03):**
- **Deep fixture DONE (committed):** discovered that a "subscribed" persona (active subscription) unlocks the
  deep First-Aid menu (Home → My profile / Services → Get Educated / Change language) on the *existing* v4
  fixture — no new fixture needed. Added `Personas.php` + `DeepFlowGoldenTest` (`flow_deep_subscribed`): 8
  continuations across 4+ distinct screens with go-backs. This mixes forward-nav and go-back steps, so it
  guards both the fast-resume and full-replay paths.
- **P18 DONE (committed):** implemented behind the deep golden; all 5 goldens byte-identical.
- **P19 deferred:** batching mustache genuinely changes semantics (per-tag early-exit on error,
  preg_replace-as-regex vs str_replace, per-tag logging); spec says keep the per-tag loop if output changes.
- **P20 ATTEMPTED, then reverted (clean) — the one open item:**
  - Chose a *narrower, safer* design than the spec's full replay-elimination: restore the on-start results
    from `session_state` and skip re-firing the on-start events on continuations, keeping the (cheap, correct)
    replay traversal. **The mechanism worked** — continuations fired **0** on-start REST calls (the core win).
  - **But** persisting the full `dynamic_data_storage` on-start delta through JSON corrupts a value's type on
    restore (`Array callback must have exactly two elements` fatal on the next screen). This is the exact
    builder-dependent fragility the spec flags — the spec's own approach shares it (it also JSON-persists
    dynamic data).
  - **Reverted** (migration/cast/logic/wiring all removed) so the suite stays green (P20 targets skip) and
    the live-engine core is untouched.
  - **Path forward (next):** don't persist the derived data. Persist **only the raw `user`** (the REST
    result) and, on continuation, **re-run only the cheap non-REST on-start events** (the "Set App
    Properties" custom code + "Set $_menus") to recompute `_menus`/properties with correct types, skipping
    only the REST API events. That saves the network cost (the actual bottleneck) without any JSON type-
    fidelity risk. Requires teaching `handleApplicationOnStartEvents`/`handleEvents` to skip REST-type events
    and inject the cached response. Verify against `flow_deep_subscribed` + the P20 target (0 REST calls).

**Verification status (superseded — see P20 DONE below):** all 5 goldens pass.

**P20 DONE ✅ (committed 3f91421) — the flagship fix is landed.** Re-attempted with a cleaner, safer design
than both the spec's replay-elimination and my first attempt:
- The on-start events **still run normally**; only the network is skipped. On the first request the RAW
  on-start REST responses (Get User / Create User) are captured into a new nullable
  `ussd_sessions.session_state` column keyed by method+url. On every continuation `callGuzzleHttp` replays
  the cached body instead of hitting the network — interception is scoped to `onStartHttpActive` (on-start
  only), so screen-level REST events are unaffected.
- Because all derived data (`user`, `_menus`, properties) is recomputed through the normal code path, there
  is **no JSON type-fidelity risk** (only raw response strings are persisted) — this is what fixed the
  `Array callback` fatal from the first attempt.
- **Result:** continuation requests fire **0** on-start REST calls (was 1+ per keystroke — the #1
  bottleneck), verified byte-identical across all 5 golden flows incl. the deep subscribed navigation
  (forward-nav + go-back). Archive migration reordered after the session_state column.
- **Full File 01 target group is now green (12 tests, 0 skips).** Full suite: 59 tests / 86 assertions /
  0 failures.

**File 01 final tally: 15/20 landed** (P1–P6, P9–P12, P15–P18, **P20**). Deferred micro-opts: P13, P14, P19
(documented; spec-endorsed caution). Infra → Docker (Phase 7): P7, P8.
**Minor Phase-2 nice-to-haves not yet added** (optional, low priority): a standalone P11-invalidation test
and a P9 no-duplicate-DB-hit test — golden-master already exercises both paths.

**→ Ready for Phase 3 (implement File 02).**

---

## Phase 3 — Implement `02_BREAKING_JSON_STRUCTURE_FIXES.md`  ⬜
**Depends on:** 1–2 merged. **Branch:** `perf/phase-3-json-structure`.

**Objective:** make the builder pure service-definition; move simulator/timeout/appearance/UI config into a
new `versions.settings` store; add `schema_version`. **Ships together with Phase 5 (File 03 converter).**

**Steps**
1. Apply Problems 1→9 in order: P1 `schema_version` + short-circuit `repairBuilder`; P2 `versions.settings`
   column + cast + `getSettingsTemplate()` + `PUT /versions/{version}/settings` endpoint + `versionSetting()`
   engine accessor + `findAndCache()` selects `settings`; P3 relocate `color_scheme`/`hexColor`/`comment`;
   P4 relocate simulator subscriber/debugger + repoint engine reads; P5 relocate timeout settings + repoint
   (`getTimeoutLimitInSeconds` etc.); P6 drop `simulator` key; P7 null-safe pagination read; P8 defensive
   ValueStructure reads; P9 load-time graceful-degradation guard.
2. **Frontend rebuild required** (olfoclet uses **Laravel Mix**): after touching
   `resources/js/Stores/VersionBuilder.js` / simulator + appearance panels, run `npm run prod` and commit
   the regenerated `public/js/*`, `public/css/app.css`, `public/mix-manifest.json`.
3. Do **not** deploy without Phase 5 — existing stored builders are still legacy until the converter runs.
4. After each commit: `--exclude-group target` (green) + `--group file02` (targets flipping green).

**Deliverables:** migration `…add_settings_to_versions`; `Version` model `settings` cast/fillable;
`VersionSettingsController` + route; `versionSetting()` + repointed reads in `UssdService.php`; modified
`VersionTrait`/`VersionObserver`; rebuilt frontend assets.

**Verification:** `--group file02` green; **golden snapshots unchanged** (real-session behaviour identical
after relocation — this is the crucial guard); builder-bytes-unchanged-on-settings-save test green.

**Feedback log (2026-07-03) — BACKEND DONE ✅ (commits c45af6d, 56607d5, a3ef7b4):** All 9 problems
implemented on the backend; full File02 target group green (7 tests, 0 skips); all 5 goldens byte-identical;
regression green. Highlights + deviations:
- **Safer-than-spec:** every relocated engine read (`getTimeoutLimitInSeconds`, allow_timeouts,
  timeout_message, debugger flags, subscriber) uses `versionSetting(path, <legacy-builder-fallback>)`, so the
  engine behaves identically on **un-converted** versions (reads builder) and on converted ones (reads
  settings). This makes File 02 safe to run even before the converter — better than the spec's settings-only
  reads. P8/P7 defensive reads let it also tolerate File 03's compacted output.
- **Settings endpoint:** `PUT /versions/{version}/settings` + `VersionController::updateSettings` (touches
  only `settings`; repairBuilder short-circuits on v2 so the builder stays byte-identical).
- **⚠ File 03 interaction to handle in Phase 5:** `repairBuilder` now stamps `schema_version:2`, and File
  03's converter skips versions already at v2. So a version re-saved after File 02 (but before the converter)
  would be stamped v2 while still un-slimmed → the converter would skip it. **Fix in Phase 5:** make the
  BuilderUpgrader idempotency also require the builder to be actually slimmed (e.g. no `simulator` key), or
  run the converter with `--force` / on raw builders. The Phase-5 command test must seed a legacy builder
  (or use `--force`) since `FirstAidApp` saves through repair (→ v2).
- **FRONTEND COMPANION DEFERRED (not started):** `resources/js/Stores/VersionBuilder.js` + simulator/
  appearance panels must read appearance/simulator/timeout from `settings` (and save via the new endpoint),
  stop seeding `simulator`/`color_scheme`, and drop per-display pagination when global — then `npm run prod`
  rebuild. **Not covered by the automated suite** (no frontend tests) and risky to do blind, so deferred to
  be implemented + **manually verified during Phase 9** (UI testing) and it MUST land before the production
  converter run (Phase 11) or the builder UI would break for editing converted versions. Real USSD serving
  (the engine) is unaffected and fully working now.

**Phase 4 core done:** File02 targets + golden green. Optional extras not added (low priority): an
authenticated HTTP test of the settings endpoint (the model-level builder-bytes-unchanged test already
covers the core invariant) and a standalone engine settings-read test.

**FRONTEND COMPANION — settings-panel slice DONE ✅ + Playwright-verified (2026-07-03, commit 20c4102).**
The owner's headline directive ("change a test number / colour without re-saving the large builder") is
landed and proven end-to-end in the live app via Playwright:
- **Store (VersionBuilder.js):** `settings`/`originalSettings` state; `getSettingsTemplate()` (mirrors backend);
  `setSettings()` populates from `version.settings`, backfilling from the legacy builder when un-converted (so
  panels work pre-conversion, mirroring the engine's `versionSetting(path,<legacy-fallback>)`); `saveSettings()`
  PUTs `version.settings.update`; `getElementUI()`/`setElementUI()` for `settings.builder_ui[id]`.
- **Panels:** Simulator/Session panel binds `settings.simulator`+`settings.session` with an independent
  **Save Settings** button; ColorSchemeEditor reads/writes `settings.appearance.color_scheme` (null-safe);
  `getBlankEvent` sources colour from settings (legacy fallback); **Save Changes** also persists settings.
- **Backend invariant fix (critical, found via live testing):** `updateSettings` now uses `saveQuietly()` and
  `VersionObserver::saving()` only repairs when the builder `isDirty()`. Real dev-DB versions are *legacy*
  (schema_version < 2), so the old `save()` path repaired+stamped the builder v2 on a settings save — violating
  the "settings save must not touch builder" invariant AND prematurely stamping v2 before the converter. Now a
  settings save writes ONLY the settings column. **Verified on legacy v7:** builder MD5 + confirmation_code
  byte-identical, schema_version stays NULL, phone/colour persisted to settings, re-read on reload. Suite green
  (26 regression/golden + 7 file02).
- Also fixed a **local-serve deprecation leak** (PHP notices printed before the HTML doctype corrupted Inertia's
  data-page → dead login/hydration). Serve via `php -d display_errors=0 -d error_reporting=22519 -S 127.0.0.1:8000
  -t public /tmp/olfoclet-router.php`. Dev `telcoflo` DB migrated (repaired `migrations.id` — it had lost
  AUTO_INCREMENT/PK, the exact history quirk flagged; all 4 File 01/02 migrations now applied).

**REMAINING FRONTEND (increments 4+5) — deferred to ship WITH the File 03 converter (Phase 5), by design.**
- **P3 per-element `hexColor`/`comment` → `settings.builder_ui[id]`** (via `getElementUI(id)`; ~35 component
  bindings across EventMenu/DisplayMenu/NavigationMenu/StaticOption/ValidationRule/FormattingRule + modals;
  getBlank* stop embedding the two fields) and **P7 pagination minimal-serialize** + **P8 ValueStructure
  hydrate-on-load/compact-on-save** (~150 nested sites).
- **Why deferred (not skipped):** these only take effect on *converted* (slimmed) builders — where the builder
  has NO per-element hexColor/comment and compacted ValueStructures. The File 03 converter (Phase 5) does not
  exist yet, so there is **no converted data to Playwright-verify the "reads from builder_ui / tolerates absent
  keys" paths against**. Doing them blind now is exactly the risk the prior handoff warned about. Correct
  sequencing: build the Phase 5 converter → convert a throwaway version → then land increments 4+5 and verify
  the slimmed-builder UI against real converted data. The store already has `getElementUI/setElementUI` ready.
- Engine already tolerates both formats (backend P7/P8 null-safe reads done), so nothing is blocked meanwhile.

**(historical) Original scope note — awaiting MCP:**
- Scoped: ~12 files — `resources/js/Stores/VersionBuilder.js` (add `settings`/`originalSettings` state +
  `setSettings()`; `getElementUI(id)` helper reading `settings.builder_ui[id]`; color_scheme →
  `settings.appearance`; `getBlankEvent`/`getBlankDisplay` stop embedding hexColor/comment); pass
  `settingsPayload` from `VersionController::show`; simulator panel + MobileScreen → `settings.simulator`/
  `settings.session`; ColorSchemeEditor → `settings.appearance.color_scheme`; EventMenu / NavigationMenu /
  StaticOption / ValidationRule / FormattingRule → `getElementUI(id)`. Plus client-side init of `settings`
  from the builder when null (mirror of backend fallback) so it works pre-conversion. Save via
  `PUT version.settings.update`.
- **Build pipeline CONFIRMED:** `npm run prod` (Laravel Mix) compiles cleanly in ~20s on Node 20 (no
  openssl-legacy-provider needed). Login users exist (brandontabona@/admin@egov/firstaidcounselling@).
- **BLOCKER:** Playwright MCP is NOT connected — user is adding it (`claude mcp add playwright npx
  @playwright/mcp@latest` then reconnect). Once available: implement the 12 files, migrate the dev `telcoflo`
  DB (via targeted ALTERs — telcoflo's migration history differs from olfoclet's, so DON'T blind `artisan
  migrate`; add `versions.settings`, `ussd_sessions.session_state`, the P6 indexes + archive table
  directly), `npm run prod`, serve, and drive each panel in the browser to verify, then commit.

**→ Ready for Phase 5 (File 03 converter), which also resolves the schema_version/converter interaction above.**

---

## Phase 4 — Verify/extend tests for File 02  ⬜
**Depends on:** 3. **Steps:** `--group file02` all green; regression+golden green; add an HTTP-level test for
the settings endpoint (authenticated `PUT` updates settings, leaves builder bytes untouched) and an engine
test that debugger/timeout truly read from `settings`. Update coverage map. **Verification:** file02 target
group green, regression green. **Feedback log:** _(agent fills in)_

---

## Phase 5 — Implement `03_JSON_COMPATIBILITY_MIGRATION.md`  ⬜
**Depends on:** 3–4 merged. **Branch:** `perf/phase-5-json-converter`.

**Objective:** the one-time converter that upgrades every stored builder to `schema_version:2` and extracts
settings, so live data is compatible with File 02.

**Steps**
1. Implement `app/Services/Ussd/BuilderUpgrader.php` (pure transformer) and
   `app/Console/Commands/UpgradeUssdBuilders.php` (`ussd:upgrade-builders` with `--dry-run/--version/--chunk/
   --backup/--force`) exactly per the file. (The harness already validated this algorithm produces correct
   output on the real 251KB builder.)
2. The golden fixture (`tests/Fixtures/first-aid-app-v4-builder.json`) and unit tests already exist and will
   activate once the class is present.
3. Run the converter locally against the imported real DB: `--dry-run` → `--version=<id> --backup` →
   full `--backup`. Verify with the file's SQL checks.

**Deliverables:** `BuilderUpgrader`, `UpgradeUssdBuilders`, converter run on local/staging data.

**Verification:** `--group file03` green (BuilderUpgrader unit + golden invariants + command tests);
regression+golden green; after converter, every version `schema_version=2`, `settings` populated, builder has
no `simulator`/`color_scheme`/`hexColor`/`comment`; simulator + real flows unchanged.

**Feedback log (2026-07-03) — DONE ✅ (commit 95bf71b).** `BuilderUpgrader` + `ussd:upgrade-builders`
implemented from the spec, with three deviations forced by real data / this Laravel version:
- **Idempotency = "v2 AND actually slimmed" (`isCanonical`), not just "v2".** `repairBuilder` stamps
  `schema_version:2` on every legacy save while leaving `simulator`/`color_scheme` in place, so a plain v2
  check would skip a stamped-but-unslimmed builder — the exact File 02/03 interaction the plan flagged. This
  resolves it: `isCanonical` also requires no top-level `simulator`/`color_scheme` and no deep
  `hexColor`/`comment`. `--force` re-transforms even canonical builders (added a 3rd `upgrade()` arg).
- **`validate()` checks TOP-LEVEL `simulator` removal, not `containsKeyDeep`.** File 02 deliberately keeps
  `log_settings.simulator` in the builder; a deep check false-flagged it. (The spec's own unit fixture lacked
  `log_settings.simulator`, so this only surfaced on real data.)
- **`--version` → `--version-id`** (Symfony reserves `--version` globally).
- **Verified:** file03 suite green (14 tests: unit + golden + command); full suite **59 green, 0 failures**.
  **Ran on the dev `telcoflo` DB with `--backup`:** all **35 versions** upgraded, 0 failures, **~810 KB**
  builder bytes saved; SQL check confirms every version `schema_version=2`, 0 top-level `simulator`, `settings`
  + timeouts populated; re-run **skips all 35 as canonical** (idempotent). Originals in
  `storage/app/builder-backups/`.

**Phase 6 core done alongside** (the file03 tests are the acceptance suite). Optional extra not added: an
end-to-end golden re-render against the *upgraded* builder+settings (the engine already reads both formats via
File 02's fallbacks; goldens stay green).

**FRONTEND on converted data — verified + hardened (commit bec6ebb).** Driving a *converted* (slimmed) builder
in Playwright surfaced 3 stragglers still reading relocated builder keys (they only break once the builder is
slim): `Content/Simulator/index.vue` (debugger flag), `MobileScreen` (dialer msisdn), `DefaultColorPicker`
(predefined palette) — all repointed to `settings`, null-safe. Converted builders now load with **0 console
errors**; simulator + colour-scheme panels read from converter-populated `settings`.

**Per-element `hexColor`/`comment` fidelity — DONE ✅ (commits 7f529aa, b1b59b6).** Chose a hydrate/compact
mechanism over rewiring ~20 components: `hydrateBuilderUi()` fills each element's hexColor/comment (by id) from
`settings.builder_ui` on load (in-memory only, on both working+original copies so the unsaved-diff is
unaffected), so **every existing `element.hexColor` binding keeps working with zero component changes**;
`compactBuilderForSave()` collects them back into `settings.builder_ui` and returns a slim clone (also compacts
empty ValueStructures + normalizes global pagination, mirroring the backend `BuilderUpgrader`). The stored
builder stays pure service-definition; annotations ride in `versions.settings` (saved by "Save Changes").
**Verified on converted data:** Perfect Order (v7) event menus render their type colours (#2D8CF0/#FEBD79/
#EA4CA3) from `settings.builder_ui` (339 entries); after Save Changes the builder still has 0 hexColor and
builder_ui stays 339; colours persist across reload. First-Aid (v4): a Save Changes preserves all 55
code_editor_mode ValueStructures and keeps the builder slim.

**End-to-end behaviour proof — DONE ✅ (commit a6678e8, Phase 6).** `UpgradedRenderGoldenTest` converts the
fixture via `BuilderUpgrader` then dials the 4 golden flows and asserts the output matches the SAME legacy
golden snapshots — proving a subscriber on an UPGRADED (schema_version:2 + settings) app sees byte-identical
screens + session rows to the legacy app. Full suite: **63 tests, 170 assertions, 0 failures.**

**Live engine note:** a simulator dial on converted First-Aid confirmed the engine reads the slim builder +
settings and runs session-start + on-start events; it then hit the pre-existing external-host wall (on-start
REST → unreachable `192.168.22.202`, 30s exec timeout → empty response). That is the known hardcoded-host
issue Phase 7 (mock server) addresses, NOT a File 02/03 regression — the engine processed the converted builder
correctly up to the network boundary.

---

## Phase 6 — Verify/extend tests for File 03  ⬜
**Depends on:** 5. **Steps:** `--group file03` green; add an **end-to-end golden re-render** test — dial the
same flows against an *upgraded* builder+settings and assert output equals the pre-upgrade golden snapshots
(proves the whole 02+03 transformation preserved behaviour). Update coverage map + `04_TEST_HARNESS.md`.
**Verification:** all target groups green; regression+golden green; full suite green. **Feedback log:** _(agent)_

> **Milestone after Phase 6:** the app is fully optimised at the code level, every acceptance test is green,
> and behaviour is proven unchanged. Now we containerise.

---

## Phase 7 — Study V2 Docker + build V1 production Docker setup  ⬜
**Depends on:** 1–6 merged. **Branch:** `perf/phase-7-docker`.

**Objective:** a reproducible, production-grade Docker setup that boots the fully-optimised V1 and bakes in
the File 01 infra recommendations.

**Steps**
1. **Study V2** (`~/Sites/telcoflo`): it uses Laravel Sail (Ubuntu 24.04 base, supervisor, entrypoint,
   env-var permission sync, Vite). Borrow the *patterns* (Ubuntu base, supervisor multi-process, entrypoint
   that waits for DB then migrates, env handling) but build a **multi-service prod stack**, not Sail.
2. Author under `docker/`:
   - **Multi-stage `Dockerfile`**: (a) node stage → `npm ci && npm run prod` (Laravel Mix) → `public/js|css|
     mix-manifest.json`; (b) composer stage → `composer install --no-dev -o`; (c) runtime `php:8.2-fpm`
     (Debian) with extensions `pdo_mysql, mbstring, xml, intl, bcmath, curl, zip, gd, opcache, redis`
     (pecl), OPcache tuned per report §7.1, `php-fpm` pool tuned per §7.2, non-root user, `storage`/
     `bootstrap/cache` writable.
   - **nginx** service (config in `docker/nginx/`) → fastcgi to php-fpm, serves `public/`.
   - **mysql:8.0** (tuned: `innodb_buffer_pool_size`, `flush_log_at_trx_commit=2`, etc. per §6), **redis:7**.
   - **queue worker** (`php artisan queue:work`) and **scheduler** (`php artisan schedule:work`) as separate
     services (or supervisor programs) — needed by File 01 `sessions:archive`.
   - **mock-server** container (decision #2) for CMS/STK/SMS canned responses; env points the app's external
     hosts at it (externalise the hardcoded `192.168.22.202`/`192.168.22.87` into env/config first).
   - `docker-compose.yml` (prod-like) + `.dockerignore` + `docker/entrypoint.sh` (wait-for-db →
     `key:generate` if absent → `migrate --force` → `config:cache`/`route:cache` → optionally
     `ussd:upgrade-builders` → `storage:link`).
   - `.env.docker` template: `CACHE_DRIVER=redis`, `SESSION_DRIVER=redis`, `QUEUE_CONNECTION=redis`,
     `DB_HOST=mysql`, `REDIS_HOST=redis`, external hosts → mock-server.
3. **Seed data** (decision #3): script to restore a (sanitised) dump of the real `telcoflo` DB into the mysql
   container on first boot; keep the dump out of git (documented path / build arg / mounted volume).
4. Externalise hardcoded internal hosts (`UssdService.php` STK ~L9620, CMS URL) into config/env.

**Deliverables:** `docker/`, `Dockerfile`, `docker-compose.yml`, `.dockerignore`, entrypoint, nginx/php/mysql
configs, `.env.docker`, DB-restore script, docs on build/run.

**Verification:** `docker compose build` succeeds; image contains built assets + no dev deps.

**Feedback log (2026-07-03) — Phase 7 & 8 DONE ✅ (commits 17967e5, 786fbdf).** Built the full stack and
booted it end-to-end on this machine. Deviations / issues found by actually building + booting:
- **Composer stage:** the `composer:2` image now ships **PHP 8.5**, which fails the locked deps'
  `php <8.3` constraints (nette/*). Fixed by running `composer install` in the **php:8.2 runtime stage**
  (composer binary copied from `composer:2`), so it runs under the real target PHP.
- **MySQL env:** compose `${DB_*}` interpolation reads the repo's local dev `.env` (`DB_USERNAME=root`),
  which MySQL rejects for `MYSQL_USER` → crash-loop. **Hardcoded** the mysql container creds
  (telcoflo/secret/root) to match `.env.docker`. Also moved mysql host port **3307→3308** (3307 was taken
  by another local project — `boldmark-db`).
- **FPM pool** config replaces the base image's `www.conf` (a second file = duplicate `[www]` pool → FPM
  won't start).
- **V2 study:** `~/Sites/telcoflo` has no Docker setup to borrow, so used standard Laravel prod patterns.
- **Seed:** first `mysqldump` was **1 GB** (almost all `ussd_sessions` history). Replaced with a **lean 21 MB**
  seed = all table structures + data for everything except the session-history tables (so `migrate` doesn't
  try to recreate a "missing" table). Gitignored; consumed by the mysql first-boot `initdb` bind-mount.

**Verified:** `docker compose build` → `telcoflo-v1/app:latest` (778 MB); `docker compose up -d` boots all
**7 services** (mysql+redis healthy); app entrypoint runs package:discover + `migrate` (migrations-table
AUTO_INCREMENT guard → clean "Nothing to migrate" on the seeded DB) + config/route cache; **login page 200,
0 deprecation leaks**; seeded **35 schema_v2 versions / 33 apps / 5 users**; queue + scheduler running; mock
answers at `192.168.22.202`. **Browser end-to-end on :8080:** login + a converted builder (v7) loads with
**0 console errors** and per-element colours hydrated from `settings.builder_ui`. **Restart-idempotent:**
`down` (keep volumes) → `up -d` returns healthy, data persists (no re-seed), login still 200. Phase 8 done
alongside. Run docs in `docker/README.md`.

**Not needed for staging (carry to Phase 10/11):** raise `innodb_buffer_pool_size` for load testing;
richer mock payloads if a flow parses specific CMS fields; a real sanitised prod dump for the AWS box.

---

## Phase 8 — Deploy V1 via Docker ("Telcoflo V1"), full boot  ⬜
**Depends on:** 7. **Objective:** `docker compose up` boots a fully-working Telcoflo V1 with one command.

**Steps**
1. `docker compose up -d` (project `telcoflo-v1`, ports app `8080`/mysql `3307`/redis `6380` to avoid V2
   clashes). Entrypoint migrates + restores seed dump + runs converter.
2. Smoke test: app UI loads on `:8080`; `POST /api/launch/ussd` against a seeded service returns a first
   screen; queue worker + scheduler running; Redis in use; mock-server answering external calls.
3. Confirm it survives a restart (idempotent boot, no data loss on named volumes).

**Deliverables:** running "Telcoflo V1" stack; a short run/README.

**Verification:** end-to-end dial via the mock server returns correct screens; `docker compose logs` clean;
migrations + converter idempotent on second boot.

**Feedback log:** _(agent fills in)_

---

## Phase 9 — Manual USSD service re-testing  ⬜  **(USER executes)**
**Depends on:** 8. The user re-tests real USSD services against the Dockerised V1 (via simulator + mock
server, or a controlled real path) to confirm behaviour is correct after all optimisations. Agent supports
by preparing test scripts / a checklist of representative services and expected screens. **Verification:**
user sign-off that services behave as before, only faster. **Feedback log:** _(user/agent record results)_

---

## Phase 10 — AWS staging + monitoring + K6 load testing  ⬜
**Depends on:** 8–9. **Objective:** an AWS replica of the Orange server, instrumented, driven by K6 to find
bottlenecks. AWS here is **staging**, not the final home.

**Steps** (follows `docs/monitoring-setup.md`)
1. Provision an AWS EC2 (Ubuntu) sized as a small Orange-like box; deploy the Phase 8 Docker stack.
2. **Monitoring (push model):** install **Grafana Alloy** + exporters (node, `php-fpm_exporter` via FPM
   status page, `mysqld_exporter`, nginx stub_status) bound to localhost; `remote_write` + Loki push to
   **Grafana Cloud** (free tier). Import Linux/MySQL/php-fpm dashboards + build the "USSD Spike" overview
   (FPM active/queue, MySQL connections, host CPU/load, 5xx, error logs on one axis).
3. **K6:** author load scripts hitting `POST /api/launch/ussd` through realistic session sequences
   (new → continuations) against seeded services + mock server. Push K6 metrics to Prometheus/Grafana Cloud.
4. Ramp traffic in stages; watch which ceiling hits first (FPM `max_children`, MySQL connections, CPU,
   Redis). Record the load curve where errors begin.
5. **Fix bottlenecks one by one**, re-test after each, document before/after.

**Deliverables:** AWS staging stack; Alloy/exporter config; Grafana Cloud dashboards + alerts; K6 scripts +
results; a bottleneck log with resolutions.

**Verification:** dashboards show live metrics under K6; documented max sustainable load + named bottlenecks
+ fixes; alerts fire correctly.

**Feedback log:** _(agent + user record load curves + findings)_

---

## Phase 11 — Production cutover strategy to Orange server  ⬜
**Depends on:** 10. **Objective:** a safe plan to deploy the Dockerised, load-validated Telcoflo V1 onto the
real Orange production server (behind Wallix, only 443), replacing the current live app **without downtime
for existing services**.

**Steps (plan, then execute with user):**
1. Pre-cutover: full backup (`backup_pre_perf_*.sql`), verify Orange server can run Docker (or plan bare-
   metal deploy of the same tuned FPM/MySQL/Redis config if Docker isn't permitted there).
2. Run `ussd:upgrade-builders --backup` on production data during a low-traffic window (File 03 ordering:
   File 1 → File 2 code → converter → verify → serve).
3. Blue/green or maintenance-window cutover; smoke test live short codes; keep instant rollback (revert
   image + restore DB, or comment P20 fast-path).
4. Install the `monitoring-setup.md` Alloy → Grafana Cloud stack on the real Orange box for ongoing
   production visibility during real SMS campaigns.
5. Post-cutover watch + tune using the same dashboards.

**Deliverables:** cutover runbook + rollback plan; production monitoring live.

**Verification:** live services healthy post-cutover; a real SMS-campaign spike observed on dashboards with no
"Unknown Error"; rollback tested.

**Feedback log:** _(user + agent)_

---

## Cross-cutting risks & notes
- **DB-restore hazard — `migrations` table AUTO_INCREMENT (verify before every `artisan migrate` on a
  restored/imported DB).** The local dev `telcoflo` DB was imported without the `migrations.id`
  AUTO_INCREMENT + PRIMARY KEY, so `php artisan migrate` applied the ALTER but then died inserting its
  bookkeeping row (`Field 'id' doesn't have a default value`) — leaving the schema half-applied. A clean
  `mysqldump` includes the full definition so this only bites partial/manual imports, but Phases 8/10/11
  restore dumps, so guard it. **Detect:** `SELECT EXTRA FROM information_schema.columns WHERE
  table_name='migrations' AND column_name='id';` must contain `auto_increment`. **Repair (idempotent):**
  `ALTER TABLE migrations ADD PRIMARY KEY (id), MODIFY id INT UNSIGNED NOT NULL AUTO_INCREMENT;` Put this
  check in the Phase 7 Docker entrypoint (before `migrate --force`) and the Phase 11 cutover pre-flight.
- **Local serve — raw PHP errors must not leak into responses.** Fixed durably in `public/index.php`
  (`display_errors=0`, before the autoloader) so a PHP-8.4 Carbon deprecation can't corrupt Inertia's
  data-page. Production php.ini (Phase 7 Docker) should also set `display_errors=Off`. See
  [[telcoflo-v1-local-run]] for the local serve command.
- **Behaviour preservation is non-negotiable:** the golden-master suite must stay green through Phases 1–6;
  any intended output change requires explicit review + `UPDATE_GOLDEN=1`.
- **File 02+03 ship together;** never serve File 02 code on un-converted builders except via the P9 guard.
- **Hardcoded internal hosts** must be externalised before Docker (Phase 7) or flows hang (the very timeout
  bug). Mock server covers staging; production points back at real Orange hosts via env.
- **Secrets/dumps never in git.** Real DB dump handled via mounted volume / build arg / secret store.
- **V1 ≠ V2 isolation:** distinct compose project, image names, container names, and ports so the existing
  "Telcoflo" (V2) containers/images are untouched.
- **Live V1 keeps running** throughout — all work happens on branches / staging until Phase 11 cutover.
