# File 2 — BREAKING / JSON-STRUCTURE PERFORMANCE FIXES
### Companion to `PERFORMANCE_OPTIMIZATION_REPORT_AND_PLAN_OPUS_4_8.md`
### Reads on top of `01_SAFE_NON_BREAKING_FIXES.md`
### Created: 2026-06-07 · Revised: 2026-06-07 (settings-extraction) · Codebase: commit `71cfe7a` · Status: NOT STARTED

---

## Guiding principle for this file

> **The `builder` JSON must contain ONLY the final JSON needed to build and run the actual service for
> real subscribers dialing on physical devices. Everything that is simulator-only, test-only, or
> builder-UI-only is removed from the builder and relocated to a new version-level settings store, editable
> independently of the builder.**

This is an explicit owner directive. The motivation: changing a basic test detail (e.g. the simulator's test
phone number) must **not** require re-saving / re-validating / re-repairing the large builder JSON. Test, UI,
and timeout configuration belong to the *version*, not to the *service definition*.

All changes in this file therefore either **relocate data out of the builder** or **slim the builder**, and
**every running application's stored JSON will be affected** — they are converted once by the File 3 command
`php artisan ussd:upgrade-builders`. **File 2 and File 3 ship and run together** in the same deployment.

### What moves out of the builder → `versions.settings`

| Builder location today | New home in `versions.settings` | Kind | Engine reads it for real sessions? |
|------------------------|----------------------------------|------|-----------------------------------|
| `simulator.subscriber.phone_number` | `simulator.subscriber.phone_number` | test-only | No (only a log line at UssdService:2015 — switch to `$this->msisdn`) |
| `simulator.debugger.return_logs` / `return_summarized_logs` | `simulator.debugger.*` | test-only | No (always behind `test_mode`: 1618, 13462, 13478) |
| `simulator.settings.timeout_limit_in_seconds` | `session.timeout_limit_in_seconds` | runtime | **Yes** — sets `timeout_at` on every session (`createNewSession` 1071; also 1153, 1516) |
| `simulator.settings.allow_timeouts` | `session.allow_timeouts` | runtime | **Yes** — sets `allow_timeout` column on real sessions (1068) |
| `simulator.settings.timeout_message` | `session.timeout_message` | runtime | shown on timeout (`handleTimeout` 1502) |
| `color_scheme` (top-level) | `appearance.color_scheme` | UI-only | No |
| per-element `hexColor` (87×) | `builder_ui[<elementId>].hexColor` | UI-only | No (only a comment at 4175) |
| per-element `comment` (52×) | `builder_ui[<elementId>].comment` | UI-only | No (only written by `repairBuilder` 663) |

> **Important nuance on timeouts:** the report and the field naming call these "simulator" settings, but the
> engine writes their *values* onto **real** session rows. So they are not deleted — their **values are
> preserved** in `versions.settings.session` and the engine is repointed to read them there. Behavior for
> real dialing sessions is unchanged; only their storage location and editability change.

### Not moved in this pass (flagged)
- **`log_settings`** stays in the builder. It is genuinely runtime (`log_settings.mobile.save_logs` drives
  real-session logging; File 1 Problem 17 reads it for `loggingEnabled`). Its `log_settings.simulator.*`
  sub-key is test-only and *could* be relocated later — flagged as a follow-up, not done here to avoid
  splitting a live runtime object.
- **`global_pagination`**, **`global_variables`**, **`application_events`**, **`markers`**, **`screens`** —
  all service-definition; they stay.

### Relationship to File 1 (already merged before this file)
- `screenIndex` / `displayIndex` already exist at runtime (File 1 P12) → builder keeps `screens` as an array.
- `loggingEnabled` (File 1 P17) reads `log_settings`, which stays in the builder — unaffected.
- File 1's ValueStructure fast-path (P16) composes with this file's ValueStructure compaction (P8).

---

## ⚠ Corrections to the report (verified against live source 2026-06-07)

The report's JSON audit (§5.3) says only `simulator.subscriber.phone_number` is read. **That is wrong** —
the engine reads `simulator.settings.timeout_limit_in_seconds` (862), `allow_timeouts` (984, 1068),
`timeout_message` (1502), and `simulator.debugger.*` (1618, 13462, 13478). The plan below accounts for this:
those values are **relocated and the engine repointed**, not blindly deleted. Also, `repairBuilder` re-adds
`comment` (VersionTrait 663–667) and `getBuilderTemplate` seeds `color_scheme` (137) — both are neutralized
so the converter's stripping is not undone on the next save.

---

## Commit protocol

1. **One problem = one commit**, least severe → most severe (numbering = commit order).
2. Stage only that problem's files; use the exact commit message; run **Verify**; on failure use **Rollback**.
3. Branch `perf/file2-json-structure` off `main`, after File 1 is merged.
4. **Frontend build:** Problems that change `resources/js/Stores/VersionBuilder.js` or the simulator panel must
   rebuild assets (`npm run prod`) and commit the regenerated `public/js/*`, `public/css/app.css`,
   `public/mix-manifest.json` in that same commit (the build output is the deliverable).
5. Each problem names its **File 3 dependency** (what the converter must do). File 3 must cover them all.

### Severity legend
🟡 low–medium · 🟠 medium–high (engine read-path / real-session writes) · 🔴 high (engine assumes new format)

### Verified anchors (re-locate by name before editing)

| Symbol / key | Line | File |
|--------------|------|------|
| `getTimeoutLimitInSeconds()` | 859 | `app/Services/Ussd/UssdService.php` |
| timeout/allow_timeouts/timeout_message reads | 862, 984, 1068, 1502 | same |
| debugger reads | 1618, 1620, 13462, 13478 | same |
| subscriber.phone_number (log only) | 2015 | same |
| `createNewSession()` (writes timeout_at/allow_timeout) | 1063 | same |
| display pagination read | 4852, 4855, 4858 | same |
| `convertValueStructureIntoDynamicData()` | 12788 | same |
| `getBuilderTemplate()` (seeds color_scheme) | 51 / 137 | `app/Traits/VersionTrait.php` |
| `repairBuilder()` (adds comment) | 255 / 663 | same |
| `findAndCache()` (SELECTs id,number,description,builder — **must add `settings`**) | 18 / 28 | same |
| `VersionObserver::saving()` | 24 | `app/Observers/VersionObserver.php` |
| versions table migration (add `settings` column) | — | `database/migrations/2023_01_01_00000_create_versions_table.php` |
| builder `simulator` defaults / `hexColor` / pagination / ValueStructures | 16, 832, 914, 1014, 585–935 | `resources/js/Stores/VersionBuilder.js` |

---

## Commit order summary

| # | Problem | Sev | File 3 conversion |
|---|---------|-----|-------------------|
| 1 | No builder format version → repair runs every save | 🟡 | Stamp `schema_version: 2` |
| 2 | No version-level settings store / no independent save | 🟡 | (enables all relocations below) |
| 3 | UI appearance in builder (`color_scheme`, per-element `hexColor`/`comment`) | 🟡 | Move to `settings.appearance` / `settings.builder_ui` |
| 4 | Simulator/test config in builder (`subscriber`, `debugger`) | 🟠 | Move to `settings.simulator` |
| 5 | Timeout settings in builder (real-session values) | 🟠 | Move to `settings.session`, repoint engine |
| 6 | `simulator` key still present in builder | 🟡 | Delete `simulator` from builder |
| 7 | Duplicated per-display pagination | 🟠 | Drop per-display pagination when global |
| 8 | 94.8% empty `ValueStructure` objects | 🟠 | Compact empty ValueStructures |
| 9 | Engine tolerates legacy format | 🔴 | All of the above + verified v2 output |

---
---

## Problem 1 — No builder format version; `repairBuilder` runs on every save 🟡
**Commit:** `perf(builder): add schema_version and short-circuit repairBuilder`
**File 3 dependency:** stamp `schema_version: 2` on every upgraded builder.

### Root cause (verified)
`VersionObserver::saving()` calls the ~800-line `repairBuilder()` on every save (line 27); `repairBuilder()`
(255) has no early exit; no `schema_version` exists. It also re-bloats JSON (re-adds `comment`), so it must
become version-aware before any stripping/relocation sticks.

### Fix
1. `getBuilderTemplate()`: add `'schema_version' => 2,` (near line 54).
2. Top of `repairBuilder()` (after `$builder` resolved): `if (($builder['schema_version'] ?? 0) >= 2) return $builder;`
3. End of `repairBuilder()` (before its return): `$builder['schema_version'] = 2;`

> All future normalization must move to File 3 (or a schema bump to 3), since repair no longer runs on v2.

### Verify
Save an existing version → `schema_version: 2` present; second save skips repair (temporary log/timer). A
legacy builder still runs repair once, then is stamped.

### Rollback
Remove the early-return and the two assignments.

### Git
```bash
git add app/Traits/VersionTrait.php
git commit -m "perf(builder): add schema_version and short-circuit repairBuilder

Seed schema_version:2 in getBuilderTemplate and stamp it at the end of
repairBuilder; skip the ~800-line repair when a builder is already v2.
Establishes the canonical-format contract for File 2 and the converter.

Ref: report Phase 6.3."
```

---

## Problem 2 — No version-level settings store; test config can't be saved independently 🟡
**Commit:** `feat(version): add versions.settings store with independent save endpoint`
**File 3 dependency:** the converter writes extracted data into `versions.settings`; nothing to convert yet
here, but this is the home everything below moves into.

### Why
There is no place to put settings outside the builder, and no way to save a test detail without saving the
whole builder. This adds the store and the lightweight save path. (Supersedes the earlier narrower idea of a
`simulator_settings` column — a single unified `settings` column holds simulator, session, appearance, and
builder-UI metadata.)

### Fix
1. **Migration** `2026_06_07_000004_add_settings_to_versions.php`: nullable `json('settings')->after('builder')`.
2. **Model** `Version`: add `'settings' => 'array'` to `$casts`; add `'settings'` to `$fillable`.
3. **Default shape** — define a `getSettingsTemplate()` on the Version (or VersionTrait):
```php
public function getSettingsTemplate(): array {
    return [
        'schema_version' => 1,
        'simulator' => [
            'subscriber' => ['phone_number' => ''],
            'debugger'   => ['return_logs' => false, 'return_summarized_logs' => false],
        ],
        'session' => [
            'timeout_limit_in_seconds' => 120,
            'allow_timeouts'           => false,
            'timeout_message'          => '',
        ],
        'appearance' => ['color_scheme' => null],
        'builder_ui' => new \stdClass(), // keyed by element id: { hexColor, comment }
    ];
}
```
4. **Cache:** `findAndCache()` currently `SELECT`s only `id, number, description, builder` (VersionTrait line
   28). **Add `settings`** to that select so the engine sees settings on the cached version. Updating settings
   must call `findAndCache()` to refresh the cache (cheap: one row read; no repair, no builder re-serialize).
5. **Independent save endpoint** — a controller + route, e.g. `PUT /versions/{version}/settings`, that
   validates and updates only `settings`, then re-caches. It must **never** touch `builder`. Wire the
   simulator panel + appearance panel in the frontend to call this endpoint so changing a test number /
   colour is an independent, lightweight save.
6. **Engine accessor** — add a helper on `UssdService` to read settings with safe fallback (used by Problems
   4–5):
```php
private function versionSetting(string $path, $default = null) {
    $settings = $this->version->settings ?? [];
    return data_get($settings, $path, $default);
}
```

### Verify
- Migration adds the column; `Version::find($id)->settings` round-trips an array.
- The settings endpoint updates `settings` and re-caches **without** modifying `builder` (diff the builder
  bytes before/after — unchanged).
- `findAndCache()` now includes `settings` on the cached object.

### Rollback
`migrate:rollback` (drops the column), remove the model cast, route, controller, accessor.

### Git
```bash
git add database/migrations/2026_06_07_000004_add_settings_to_versions.php \
        app/Models/Version.php app/Traits/VersionTrait.php \
        app/Http/Controllers/<VersionSettingsController>.php routes/web.php \
        resources/js/ public/js/ public/css/app.css public/mix-manifest.json
git commit -m "feat(version): add versions.settings store with independent save endpoint

Adds a nullable versions.settings JSON column (simulator/session/appearance/
builder_ui), a settings template, a PUT /versions/{version}/settings endpoint
that updates settings WITHOUT touching the builder, and a versionSetting()
engine accessor. findAndCache now selects settings and re-caches on settings
save. Foundation for relocating non-service config out of the builder.

Ref: builder-json-purity principle; report sections 5-6."
```

---

## Problem 3 — Appearance/UI config lives in the builder 🟡
**Commit:** `perf(builder): relocate color_scheme and per-element UI annotations to settings`
**File 3 dependency:** move top-level `color_scheme` → `settings.appearance.color_scheme`; move per-element
`hexColor`/`comment` → `settings.builder_ui[<elementId>]`; remove them from the builder.

### Root cause (verified)
`color_scheme` seeded by `getBuilderTemplate` (137); `hexColor` seeded by frontend (832, 914); `comment`
re-added by `repairBuilder` (663). Engine never reads any of them (verified).

### What breaks / why
Safe for the engine; the **builder canvas** reads these to colour/annotate elements. The frontend must read
appearance from `settings` (and per-element annotations from `settings.builder_ui` by element id) instead of
from the builder, defaulting when absent.

### Fix
1. **Frontend:** read `color_scheme` from `settings.appearance.color_scheme`; read per-element `hexColor`/
   `comment` from `settings.builder_ui[element.id]` with defaults (`'#CECECE'`, `''`). Stop writing these into
   `builder`. The appearance editor saves via the Problem 2 settings endpoint. Rebuild assets.
2. **`repairBuilder()`:** remove the `comment`-adding block (663–667).
3. **`getBuilderTemplate()`:** remove the `color_scheme` seed (137).

> **Per-element fidelity note:** `settings.builder_ui` is keyed by element id. Screens and displays have ids;
> for nested elements without a stable id (some events/options), the converter cannot key them and the canvas
> defaults their colour/comment. This is acceptable per the owner ("the color scheme settings and the likes
> can be removed"). If full per-option fidelity is later required, add stable ids first.

### Verify
- Builder canvas renders colours/comments from `settings` (or defaults); saving appearance updates
  `settings` only, not `builder`.
- Engine simulator output unchanged (never used these).

### Rollback
Restore frontend reads-from-builder, the repair `comment` block, and the template `color_scheme` seed.

### Git
```bash
git add app/Traits/VersionTrait.php resources/js/ public/js/ public/css/app.css public/mix-manifest.json
git commit -m "perf(builder): relocate color_scheme and per-element UI annotations to settings

Move builder-UI-only appearance out of the builder: color_scheme ->
settings.appearance, per-element hexColor/comment -> settings.builder_ui
(keyed by element id). Frontend reads appearance from settings with defaults;
repairBuilder no longer adds comment; template no longer seeds color_scheme.
File 3 migrates these out of stored builders.

Ref: builder-json-purity principle; report section 5.3 (corrected)."
```

---

## Problem 4 — Simulator/test config lives in the builder 🟠
**Commit:** `perf(builder): relocate simulator subscriber/debugger config to settings`
**File 3 dependency:** move `simulator.subscriber` and `simulator.debugger` → `settings.simulator.*`.

### Root cause (verified)
- `simulator.subscriber.phone_number` read only for a log line (2015).
- `simulator.debugger.return_logs`/`return_summarized_logs` read only behind `test_mode` (1618, 13462, 13478).

### What breaks / why
Test-only data; moving it changes where the engine (in test mode) and the simulator UI read it.

### Fix
1. **Engine:** replace the three debugger reads (1618, 13462, 13478) with
   `$this->versionSetting('simulator.debugger.return_logs', false)` /
   `...('simulator.debugger.return_summarized_logs', false)`.
2. **Engine (line 2015):** the "Mobile:" log must use the **real** dialled number `$this->msisdn`, not the
   simulator's test number. (In test mode the simulator already dials with its configured number as `msisdn`,
   so this is correct for both real and test.) Remove the `builder['simulator']['subscriber']` read here.
3. **Frontend:** the simulator panel reads/writes the test number + debugger flags via the Problem 2 settings
   endpoint. Rebuild assets.

### Verify
- Test mode: debugger logs return per `settings.simulator.debugger`; toggling them via the settings endpoint
  works without saving the builder.
- Real session log shows the real `msisdn`.
- Simulator dial with a changed test number works after an independent settings save.

### Rollback
Repoint the reads back to `builder['simulator']...` and restore the line-2015 read.

### Git
```bash
git add app/Services/Ussd/UssdService.php resources/js/ public/js/ public/css/app.css public/mix-manifest.json
git commit -m "perf(builder): relocate simulator subscriber/debugger config to settings

Engine reads debugger flags from settings.simulator.debugger; the 'Mobile:'
log uses the real \$this->msisdn instead of the simulator test number. The
simulator panel reads/writes the test number + debugger flags via the
settings endpoint. File 3 migrates simulator.subscriber/debugger out.

Ref: builder-json-purity principle."
```

---

## Problem 5 — Timeout settings live in the builder (used by real sessions) 🟠
**Commit:** `perf(builder): relocate session timeout settings to version settings`
**File 3 dependency:** move `simulator.settings.timeout_limit_in_seconds`, `allow_timeouts`,
`timeout_message` → `settings.session.*`.

### Root cause (verified) — highest-care relocation
These live under `simulator` but their **values are written to real session rows**:
- `getTimeoutLimitInSeconds()` (862) → `timeout_at` in `createNewSession` (1071), `updateExisting…` (1153),
  `handleTimeout` (1516).
- `allow_timeouts` → `allow_timeout` column (1068).
- `timeout_message` (1502).

### What breaks / why
If deleted without relocation, `timeout_at`/`allow_timeout` computation breaks for **real** sessions. So the
values are preserved in `settings.session` and the engine is repointed; runtime behavior is identical.

### Fix
1. **Engine:** repoint every read:
   - `getTimeoutLimitInSeconds()` → `return (int) $this->versionSetting('session.timeout_limit_in_seconds', 120);`
   - `allow_timeouts` (984, 1068) → `$this->versionSetting('session.allow_timeouts', false)`
   - `timeout_message` (1502) → `$this->versionSetting('session.timeout_message', '')`
2. Defaults guarantee safety if `settings` is null on an un-converted version (paired with Problem 9's guard).
3. **Frontend:** the timeout fields move to the version-settings panel, saved via the settings endpoint.

### Verify
- New real session: `timeout_at` computed from `settings.session.timeout_limit_in_seconds` (compare a
  before/after row — identical given the same value).
- `allow_timeout` column matches `settings.session.allow_timeouts`.
- Test-mode timeout shows `settings.session.timeout_message`.
- Editing timeout via settings endpoint does not touch the builder.

### Rollback
Repoint the reads back to `builder['simulator']['settings']...`.

### Git
```bash
git add app/Services/Ussd/UssdService.php resources/js/ public/js/ public/css/app.css public/mix-manifest.json
git commit -m "perf(builder): relocate session timeout settings to version settings

Move timeout_limit_in_seconds, allow_timeouts, timeout_message out of
builder.simulator.settings into versions.settings.session and repoint the
engine via versionSetting() with safe defaults. Real-session timeout_at /
allow_timeout computation is unchanged. File 3 migrates the values.

Ref: builder-json-purity principle; report section 5.3 (corrected)."
```

---

## Problem 6 — Remove the now-empty `simulator` key from the builder 🟡
**Commit:** `perf(builder): drop the simulator key from the builder`
**File 3 dependency:** `unset($builder['simulator'])` after its contents have been relocated (Problems 3–5).

### Why
After Problems 3–5, nothing in the builder's `simulator` block is read by the engine. Remove it so the
builder is pure service-definition.

### Fix
1. Confirm via grep that **no** `builder['simulator']` read remains in `UssdService.php`:
   `grep -n "builder\['simulator'\]" app/Services/Ussd/UssdService.php` → must be empty.
2. **Frontend:** stop seeding/serializing a `simulator` key into `builder` (it lives in `settings` now).
3. **`getBuilderTemplate()`:** ensure no `simulator` key is seeded.
4. File 3 deletes the `simulator` key from stored builders.

### Verify
- Grep returns nothing.
- Simulator + real flows work; saved builder JSON has no `simulator` key.

### Rollback
This commit only removes a key already unused; rollback = restore the frontend seed (engine no longer reads
it regardless). Prefer not to roll back once Problems 3–5 are in.

### Git
```bash
git add resources/js/ app/Traits/VersionTrait.php public/js/ public/css/app.css public/mix-manifest.json
git commit -m "perf(builder): drop the simulator key from the builder

After relocating appearance/test/timeout config to versions.settings, remove
the now-unread simulator key from the builder template and frontend
serialization. File 3 deletes it from stored builders. Builder is now pure
service-definition (plus pagination + ValueStructure slimming to follow).

Ref: builder-json-purity principle."
```

---

## Problem 7 — Duplicated per-display pagination config 🟠
**Commit:** `perf(builder): drop redundant per-display pagination`
**File 3 dependency:** where `use_global_pagination = true`, reduce the per-display pagination object to
`{use_global_pagination: true}`; keep `use_global_pagination = false` displays intact.

### Root cause (verified) — genuinely breaks the engine if stripped first
Engine reads the per-display pagination object **before** the global check:
```php
$displayPagination  = $this->display['content']['pagination'];        // 4852 unconditional
$useGlobalPagination = $displayPagination['use_global_pagination'];    // 4858
```
Removing the object first → "undefined index". Engine must be made null-safe **before** the JSON is stripped.

### Fix
1. **Engine (~4852–4860):**
```php
$displayPagination   = $this->display['content']['pagination'] ?? null;
$globalPagination    = $this->version->builder['global_pagination'];
$useGlobalPagination = $displayPagination['use_global_pagination'] ?? true;
$pagination = $useGlobalPagination ? $globalPagination : $displayPagination;
```
   Guard any later direct `$displayPagination[...]` dereferences too.
2. **Frontend `getBlankDisplay()`:** when `use_global_pagination = true`, persist only
   `{ use_global_pagination: true }`. Rebuild assets.
3. File 3 strips the redundant objects.

### Verify
- Global-pagination display paginates via global settings; custom (`false`) display keeps its config; no
  "undefined index: pagination" in logs.

### Rollback
Keep the null-safe engine (harmless with full objects); revert the frontend to always-serialize.

### Git
```bash
git add app/Services/Ussd/UssdService.php resources/js/ public/js/ public/css/app.css public/mix-manifest.json
git commit -m "perf(builder): drop redundant per-display pagination

Engine reads display pagination null-safely (defaults to global) so displays
using global pagination need not store a per-display object. Frontend
serializes the full object only when use_global_pagination is false. File 3
strips the redundant objects; custom-pagination displays preserved.

Ref: report section 5.2."
```

---

## Problem 8 — 94.8% of `ValueStructure` objects are empty 🟠
**Commit:** `perf(builder): normalize empty ValueStructures`
**File 3 dependency:** for ValueStructures with `code_editor_mode !== true` and empty `code_editor_text`,
remove `code_editor_text` + `code_editor_mode`; preserve `code_editor_mode === true` content verbatim.

### Root cause (verified)
998 of 1,053 ValueStructures are empty. `convertValueStructureIntoDynamicData()` (12788) reads
`code_editor_text`/`code_editor_mode` unconditionally (12807).

### What breaks / why (widest field in the builder)
Engine and frontend must tolerate the compact form (keys absent ⇒ `''`, `false`). Composes with File 1 P16.

### Fix
1. **Engine (12788):** read defensively — `$text = $data['text'] ?? ''; $code = $data['code_editor_text'] ?? '';
   $code_editor_mode = $data['code_editor_mode'] ?? false;`. Grep for other direct reads of those keys and add `?? `.
2. **Frontend:** hydrate to full shape on load (for editing); compact on save (omit the two keys when empty/false). Rebuild assets.
3. File 3 compacts stored builders.

### Verify
- Empty/plain/mustache/`true`/`false`/code-mode ValueStructures all render identically on legacy and upgraded
  builders; round-trip an upgraded builder through the UI; no "undefined index: code_editor_*" in logs.

### Rollback
Keep the defensive engine reads (harmless); revert the frontend to always-full save.

### Git
```bash
git add app/Services/Ussd/UssdService.php resources/js/ public/js/ public/css/app.css public/mix-manifest.json
git commit -m "perf(builder): normalize empty ValueStructures

Represent empty non-code ValueStructures compactly (omit code_editor_text/
code_editor_mode; absence == '',false). Engine reads defensively; frontend
hydrates for editing and compacts on save. Removes ~40KB of dead structure
(998/1053). code_editor_mode=true content preserved. File 3 compacts stored
builders.

Ref: report section 5.1."
```

---

## Problem 9 — Engine still tolerates the legacy format 🔴
**Commit:** `perf(builder): consume lean canonical builder + settings directly`
**File 3 dependency:** EVERYTHING above — File 3 must have upgraded all versions (settings populated,
`simulator` removed, pagination normalized, ValueStructures compacted, `schema_version: 2`).

### Why most severe
Makes `schema_version: 2` + `settings` the assumed contract on the hot path. Any version not upgraded by
File 3 must degrade gracefully, not break.

### Fix (gated, reversible)
At version load (after `findAndCache`/`setVersion`):
```php
$schema = $this->version->builder['schema_version'] ?? 0;
if ($schema < 2 || $this->version->settings === null) {
    // Un-upgraded build reached runtime: normalize on the fly + backfill settings from legacy builder, log loudly
    $this->version->builder = $this->version->repairBuilder($this->version->builder);
    \Log::warning('USSD version served un-upgraded (schema<2 or null settings)', ['version_id' => $this->version->id]);
}
```
This is the safety net: a missed File 3 conversion degrades to the slow path + a warning instead of breaking.
The `versionSetting()` defaults (Problems 4–5) and null-safe reads (Problems 7–8) already keep both formats
working; this guard formalizes the intent and surfaces gaps.

### Verify
- After File 3 on staging: every version `schema_version: 2`, non-null `settings`, no "served un-upgraded"
  warnings, full multi-app simulator + real-flow regression passes.
- Deliberately leave one version un-upgraded → still renders via fallback + emits warning.

### Rollback
Remove the load-time guard (defaults/null-safe reads remain; both formats keep working).

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(builder): consume lean canonical builder + settings directly

Assume schema_version:2 + versions.settings on the hot path, with a load-time
guard that normalizes-on-the-fly and warns if an un-upgraded version reaches
runtime, so a missed File 3 conversion degrades gracefully. Deploy only after
File 3 has upgraded all versions.

Ref: report sections 5 and 6.4."
```

---

## End of File 2 — Deployment dependency

Every problem changes the canonical builder JSON and/or moves data to `versions.settings`. **None of this is
safe in production until File 3's `php artisan ussd:upgrade-builders` has converted all stored versions** (and
re-cached them). Required ordering per environment:

```
merge File 1  →  merge File 2 code  →  run File 3 converter  →  verify (schema_version:2 + settings populated)  →  serve traffic
```

Proceed to **File 3** (`03_JSON_COMPATIBILITY_MIGRATION.md`) for the converter that performs, per version:
relocate appearance/simulator/timeout config into `versions.settings` (P3–P5) · delete the `simulator` key
(P6) · normalize pagination (P7) · compact ValueStructures (P8) · stamp `schema_version: 2` (P1).
