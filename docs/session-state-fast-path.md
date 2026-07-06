# Session-state fast-path (skip the per-keystroke replay)

Date: 2026-07-06 · Author: Claude Opus 4.8 (1M context)

## Problem
USSD is stateless, so today the engine **replays the entire journey on every keystroke**
(`startBuildingUssd` resets `dynamic_data_storage` and re-walks from the first screen).
Even with the on-start + screen HTTP caches (network calls are free on replay), each
behind screen's events are still **re-executed** — mustache/`eval`, `json_decode` of
large responses, attribute storage — ~0.4–0.6s per behind screen. Deep menus balloon
(`*250#`: 0.9s → 2.6s over a few levels), which also feeds the timeout risk under load.

## Principle (the whole design in one line)
> **Only the level you're currently on is computed. Every level behind it is read from
> its cached box.**

- **Forward** → compute the newly-focused level live (events + API), store its box.
- **Behind levels** → never run; restore their boxes (skip all re-processing).
- **Back (`0`)** → the level you land on becomes current → computed live; the boxes for
  the abandoned levels above it are **purged**; everything below is read from boxes.
- **Equal speed both directions**; the only floor is the one live level's own API.

This is **byte-identical** to today: a behind level's box equals what re-running it would
produce, because re-running is deterministic given the same response + the same (cached)
HTTP. We skip redundant work, we don't change any answer.

## Data model — a stack of per-level boxes
Each level stores **only its own** variable delta (not the accumulated state — no
duplication), keyed by the navigation-path prefix that reached it (same keying as the
already-shipped `screen_http` cache). The full state at level *n* = merge of boxes `1..n`
(later levels win on overwrite). Go-back pops the boxes above the landing level (reuses
`pruneScreenHttpToCurrentPath`'s off-path drop). Persisted in `ussd_sessions.session_state`
under a new `fast` key, alongside `http` / `screen_http`.

A box captures the journey-accumulated `$this` state the current step reads:
`dynamic_data_storage` delta, `level`, current `screen`/`display` **ids**,
`chained_screens`/`chained_displays` + their `metadata`, `screen_total_responses`,
`display_total_responses`, `pagination_index`, `current_user_response`, `api_response`.
Re-derivable state (builder/version/app/account/http-client/request scalars/index maps)
is **not** stored — rebuilt on restore.

## Flow (as built)
1. `manageGoBackRequests()` runs first (prunes reply_records/text — unchanged).
2. **Eligibility gate** (`tryFastPathRestore`; all must hold, else full replay):
   - feature flag `ussd.fast_path` is ON,
   - this is a continuation (`existing_session` present, ≥1 user response),
   - a box exists for the **parent path** = the current path minus the latest reply
     (identical key for a forward step or a go-back landing on a checkpointed level).
3. **Re-derive the deterministic per-request setup** exactly as a full replay would, in
   the same order — `resetDynamicDataStorage` → `storeUssdSessionValues` →
   `storeGlobalVariables` → `handleApplicationOnStartEvents`. This is the crucial part:
   `dynamic_data_storage` holds **helper closures** (e.g. `$_menus`, built in on-start)
   that cannot be serialised into a box, so they must be *recreated*, not restored.
   On-start's REST calls are served from the on-start HTTP cache, so this stays **O(1)
   regardless of menu depth**. If either stage wants to short-circuit to a screen → fall
   back to the full walk.
4. **Restore the box on top** (`restoreLevelBox`): rebuild `screens` + id indexes, then
   `array_merge(fresh_dynamic_data, box.dds)` so the fresh closures survive and the
   journey-accumulated data wins on any key overlap; re-resolve `screen`/`display` from
   stored ids; set `level`, `chained_*`, counters, `pagination_index`, `api_response`.
   The one thing we **skip** is the behind-level screen walk — the depth-dependent cost.
5. **Live work**: `handleCurrentDisplay` resumes at the focused level (its re-entry is
   guarded by `resumingFromBox`, and it reuses the box's already-rendered `built`),
   processes the reply / runs the landed screen live; its API fires and is captured.
6. **Capture**: snapshot the new focused level's box — `dds` filtered to JSON-safe
   entries only (`jsonSafeDynamicData` drops closures; they are re-derived, not stored);
   purge off-path boxes (`pruneScreenHttpToCurrentPath`); write to `session_state.fast`.
7. **Any failure / ineligibility → fall through to the existing full walk** (correct).

### Why re-run on-start instead of restoring it
`dynamic_data_storage` mixes two kinds of state: (a) **re-derivable** per-request helpers
and globals — including closures — which a full replay rebuilds every keystroke anyway,
and (b) **journey-accumulated** data (API responses, stored inputs) that grows as the
user navigates. Only (b) can and should be serialised. Re-running the (a) setup on every
fast-path request is byte-identical to what replay does (same code, same cached HTTP) and
is depth-independent; skipping the behind-level *screen walk* is where the depth win comes
from. A closure silently JSON-encodes to `{}` (no error) and reloads as `[]`, so the
capture filter compares the JSON before/after the array round-trip and drops anything that
mutates — closures included.

## Safety
- **Feature flag, default OFF.** Deployed OFF ⇒ engine is byte-for-byte the current one;
  zero risk to `*217#` / `*250#`. Enabled per-environment once proven.
- **Fallback everywhere.** Missing box for the parent path, a globals/on-start stage that
  short-circuits to a screen, or go-back onto an un-checkpointed level ⇒ full replay. The
  fast-path is an accelerator that can always defer to the proven path.
- **Determinism guarantee.** Behind-level API inputs are identical on re-run because
  on-start/screen HTTP is served from the captured cache; helper closures are re-derived
  by re-running the same setup code, not restored. Object↔array coercion from the
  `session_state` JSON cast is harmless (values are read by dotted path) and is proven
  behaviour-neutral by the parity + golden suites; the capture filter drops any value that
  would *lose information* through the round-trip (closures/resources).

## Tests / gate (done)
- **`FastPathParityTest`** — runs each live service's flow twice (flag OFF, then ON) with
  distinct sessions and asserts the transcripts are **identical**, AND that the ON run
  actually resumed from a box (`fastPathRestoreCount > 0`) while the OFF run never did.
  Covers First-Aid forward, First-Aid deep + go-backs (`1 0 2 1 0 0 3 0`), and Perfect
  Order. This is the real proof: fast-path output == replay output, and it genuinely fired.
- **Golden-master byte-identical with the flag forced ON** — `USSD_FAST_PATH=true phpunit
  --group golden` passes all 13 (both `*217#` and `*250#`, `deepPath` includes go-backs),
  matching snapshots that were captured with the flag OFF.
- **Full USSD suite green with the flag OFF** (51/51) — confirms the path is inert by default.

## Measured result (in-process, no-opcache test env — relative structure is what matters)
A level-3 keystroke, First-Aid:
- **Floor** (level-1 render = on-start + Home) ≈ **1183 ms**
- **Replay** (floor + re-walk Home + Services + Get-Educated) ≈ **1530 ms**
- **Fast-path** (floor + focused level only) ≈ **1215 ms** — back at the floor.

The fast-path removes the per-level behind-screen cost (~175 ms/level here): depth no
longer grows the request. The residual floor is the on-start + framework cost, identical
for both paths, and is what the separate infra opts (OPcache JIT, Octane, eval reduction)
target. Absolute numbers are inflated by the test env; the **relative** picture — fast-path
≈ floor ≪ replay — holds and is the point.

## Follow-ups (not done)
- Boxes are currently **full per-level snapshots** (of the serialisable subset), not the
  per-level deltas described under "Data model". Merge-on-restore already gives correct
  results; switching to deltas is a storage optimisation, deferred.
- Enable on the box (`USSD_FAST_PATH=true`) and verify real `*217#` / `*250#` flows against
  the live CMS before considering it for production.
- Diff shown before it nears `main`.
