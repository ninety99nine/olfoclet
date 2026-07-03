# File 3 — USSD JSON COMPATIBILITY MIGRATION (one-time converter)
### Companion to `PERFORMANCE_OPTIMIZATION_REPORT_AND_PLAN_OPUS_4_8.md`
### Reads on top of `01_SAFE_NON_BREAKING_FIXES.md` and `02_BREAKING_JSON_STRUCTURE_FIXES.md`
### Created: 2026-06-07 · Revised: 2026-06-07 (settings-extraction) · Codebase: commit `71cfe7a` · Status: NOT STARTED

---

## What this file is

File 2 changes the builder JSON so the builder holds **only service-definition data**; everything else
(simulator/test config, timeout settings, appearance/UI annotations) moves to the new `versions.settings`
column. Every version already on production is in the legacy format and breaks under File 2 until converted.
**This file is that converter** — `php artisan ussd:upgrade-builders` — run once per environment to:

1. **Extract** simulator/timeout/appearance/UI data out of each `builder` into `versions.settings`.
2. **Slim** each `builder` (delete `simulator`/`color_scheme`/`hexColor`/`comment`, normalize pagination,
   compact ValueStructures) and stamp `schema_version: 2`.
3. **Validate** invariants, then write **both** `versions.builder` and `versions.settings`, and re-cache.

> **File 1 requires no JSON conversion** (it never changed the JSON). This converter mitigates **File 2** only.

### Commit discipline (different from Files 1 & 2)
Committed **once**, after all of its code is complete and verified on a copy of production data — it is one
cohesive unit (service + command + tests). Branch `perf/file3-builder-converter`, after File 2 is merged
(it relies on the File 2 contract: `versions.settings` column + cast, `schema_version`, short-circuited
`repairBuilder`, `versionSetting()` defaults, null-safe pagination/ValueStructure reads).

---

## What the converter produces (maps 1:1 to File 2 problems)

For each version it reads the legacy `builder` and outputs **two** values: the new slim `builder` and the new
`settings`.

| File 2 problem | Extract builder → settings | Then remove from builder |
|----------------|----------------------------|--------------------------|
| P3 appearance | `color_scheme` → `settings.appearance.color_scheme`; per-element `hexColor`/`comment` → `settings.builder_ui[<id>]` | `color_scheme`, `hexColor`, `comment` |
| P4 simulator | `simulator.subscriber` → `settings.simulator.subscriber`; `simulator.debugger` → `settings.simulator.debugger` | (covered by P6) |
| P5 timeouts | `simulator.settings.{timeout_limit_in_seconds,allow_timeouts,timeout_message}` → `settings.session.*` | (covered by P6) |
| P6 simulator key | — | delete `simulator` entirely |
| P7 pagination | — | per-display pagination → `{use_global_pagination:true}` when global |
| P8 ValueStructures | — | compact empty non-code ValueStructures |
| P1 schema_version | — | stamp `builder.schema_version = 2` |

### Non-negotiable invariants (validate before writing)
1. Screen & display counts unchanged.
2. Every `code_editor_mode === true` ValueStructure keeps its exact `code_editor_text`.
3. Every `use_global_pagination === false` display keeps its full pagination.
4. **Timeout values preserved**: `settings.session.timeout_limit_in_seconds` etc. equal the legacy
   `builder.simulator.settings.*` values (so real-session `timeout_at` is unchanged).
5. `settings.simulator.subscriber/debugger` equal the legacy values.
6. Builder no longer contains `simulator`, `color_scheme`, `hexColor`, or `comment` (recursively).
7. `application_events`, `global_variables`, `global_pagination`, `markers`, `log_settings`, `screens`
   topology untouched.
8. Idempotent (skip versions already at `schema_version: 2`); result is valid JSON.

---

## 1) `app/Services/Ussd/BuilderUpgrader.php`

```php
<?php

namespace App\Services\Ussd;

/**
 * Pure transformer: splits a legacy USSD builder into (a) a lean canonical
 * schema_version:2 builder containing only service-definition data, and
 * (b) a version settings array holding the relocated simulator/timeout/
 * appearance/UI config.
 *
 * Stateless and side-effect free (no DB, no cache) so it is unit-testable and
 * reusable by CI/CD. See docs/performance/02_BREAKING_JSON_STRUCTURE_FIXES.md.
 */
class BuilderUpgrader
{
    const TARGET_SCHEMA_VERSION = 2;
    const SETTINGS_SCHEMA_VERSION = 1;

    /** Per-element builder-UI keys relocated into settings.builder_ui[<id>]. */
    const UI_ELEMENT_KEYS = ['hexColor', 'comment'];

    /**
     * @return array{builder: array, settings: array, changed: bool}
     */
    public function upgrade(array $builder, ?array $existingSettings = null): array
    {
        // Idempotency — already canonical
        if (($builder['schema_version'] ?? 0) >= self::TARGET_SCHEMA_VERSION) {
            return ['builder' => $builder, 'settings' => $existingSettings ?? [], 'changed' => false];
        }

        $settings = $existingSettings ?? $this->settingsTemplate();

        // ---- P5: timeouts (preserve values — engine uses them for real sessions) ----
        $sim = $builder['simulator'] ?? [];
        $settings['session']['timeout_limit_in_seconds'] =
            $sim['settings']['timeout_limit_in_seconds'] ?? $settings['session']['timeout_limit_in_seconds'];
        $settings['session']['allow_timeouts'] =
            $sim['settings']['allow_timeouts'] ?? $settings['session']['allow_timeouts'];
        $settings['session']['timeout_message'] =
            $sim['settings']['timeout_message'] ?? $settings['session']['timeout_message'];

        // ---- P4: simulator/test config ----
        if (isset($sim['subscriber'])) { $settings['simulator']['subscriber'] = $sim['subscriber']; }
        if (isset($sim['debugger']))   { $settings['simulator']['debugger']   = $sim['debugger']; }

        // ---- P3: appearance (top-level color_scheme) ----
        if (array_key_exists('color_scheme', $builder)) {
            $settings['appearance']['color_scheme'] = $builder['color_scheme'];
        }

        // ---- P3: per-element hexColor/comment -> settings.builder_ui[<id>] ----
        $builderUi = [];
        $this->collectElementUi($builder, $builderUi);
        if (!empty($builderUi)) {
            $settings['builder_ui'] = $builderUi;
        }

        // ---- Now slim the builder ----
        unset($builder['simulator']);                 // P6
        unset($builder['color_scheme']);              // P3
        $builder = $this->stripElementUiKeys($builder); // P3 (hexColor/comment recursively)

        if (isset($builder['screens']) && is_array($builder['screens'])) {
            foreach ($builder['screens'] as $sKey => $screen) {
                if (isset($screen['displays']) && is_array($screen['displays'])) {
                    foreach ($screen['displays'] as $dKey => $display) {
                        $builder['screens'][$sKey]['displays'][$dKey] =
                            $this->normalizePagination($display);              // P7
                    }
                }
            }
        }

        $builder = $this->compactValueStructures($builder);  // P8
        $builder['schema_version'] = self::TARGET_SCHEMA_VERSION; // P1

        return ['builder' => $builder, 'settings' => $settings, 'changed' => true];
    }

    private function settingsTemplate(): array
    {
        return [
            'schema_version' => self::SETTINGS_SCHEMA_VERSION,
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
            'builder_ui' => [],
        ];
    }

    /** Walk the tree; for any element carrying an 'id' plus hexColor/comment, record them by id. */
    private function collectElementUi($node, array &$acc): void
    {
        if (!is_array($node)) return;

        $hasId = isset($node['id']) && (is_string($node['id']) || is_int($node['id']));
        $ui = [];
        foreach (self::UI_ELEMENT_KEYS as $k) {
            if (array_key_exists($k, $node)) { $ui[$k] = $node[$k]; }
        }
        if ($hasId && !empty($ui)) {
            $acc[(string) $node['id']] = array_merge($acc[(string) $node['id']] ?? [], $ui);
        }

        foreach ($node as $v) {
            if (is_array($v)) { $this->collectElementUi($v, $acc); }
        }
    }

    /** P3 — remove hexColor/comment everywhere; never descend the 'simulator' key. */
    private function stripElementUiKeys(array $node): array
    {
        foreach (self::UI_ELEMENT_KEYS as $k) { unset($node[$k]); }
        foreach ($node as $key => $value) {
            if ($key === 'simulator') continue;
            if (is_array($value)) { $node[$key] = $this->stripElementUiKeys($value); }
        }
        return $node;
    }

    /** P7 — reduce pagination to the flag when global pagination is used. */
    private function normalizePagination(array $display): array
    {
        $pg = $display['content']['pagination'] ?? null;
        if (is_array($pg) && (($pg['use_global_pagination'] ?? null) === true)) {
            $display['content']['pagination'] = ['use_global_pagination' => true];
        }
        return $display;
    }

    /** P8 — compact empty non-code ValueStructures; preserve code_editor_mode=true verbatim. */
    private function compactValueStructures($node)
    {
        if (!is_array($node)) return $node;

        if (array_key_exists('code_editor_text', $node) && array_key_exists('code_editor_mode', $node)) {
            $mode = $node['code_editor_mode'] ?? false;
            $code = $node['code_editor_text'] ?? '';
            if ($mode !== true && ($code === '' || $code === null)) {
                unset($node['code_editor_text'], $node['code_editor_mode']);
            }
        }
        foreach ($node as $key => $value) {
            if (is_array($value)) { $node[$key] = $this->compactValueStructures($value); }
        }
        return $node;
    }

    /** Validate invariants between legacy input and produced output. Returns violation strings. */
    public function validate(array $legacyBuilder, array $newBuilder, array $newSettings): array
    {
        $e = [];
        $sim = $legacyBuilder['simulator'] ?? [];

        if ($this->countScreens($legacyBuilder) !== $this->countScreens($newBuilder)) $e[] = 'Screen count changed';
        if ($this->countDisplays($legacyBuilder) !== $this->countDisplays($newBuilder)) $e[] = 'Display count changed';

        // code-mode ValueStructures preserved
        $a = $this->collectCodeTexts($legacyBuilder); $b = $this->collectCodeTexts($newBuilder);
        sort($a); sort($b);
        if ($a !== $b) $e[] = 'A code_editor_mode=true ValueStructure changed/lost';

        // custom pagination preserved
        if ($this->countCustomPagination($legacyBuilder) !== $this->countCustomPagination($newBuilder))
            $e[] = 'A use_global_pagination=false display lost its custom pagination';

        // timeout values preserved into settings (only assert when legacy had them)
        if (isset($sim['settings']['timeout_limit_in_seconds'])
            && (int) $newSettings['session']['timeout_limit_in_seconds'] !== (int) $sim['settings']['timeout_limit_in_seconds'])
            $e[] = 'timeout_limit_in_seconds not preserved into settings';
        if (isset($sim['settings']['timeout_message'])
            && (string) $newSettings['session']['timeout_message'] !== (string) $sim['settings']['timeout_message'])
            $e[] = 'timeout_message not preserved into settings';

        // simulator subscriber/debugger preserved
        if (isset($sim['subscriber']) && ($newSettings['simulator']['subscriber'] ?? null) != $sim['subscriber'])
            $e[] = 'simulator.subscriber not preserved into settings';
        if (isset($sim['debugger']) && ($newSettings['simulator']['debugger'] ?? null) != $sim['debugger'])
            $e[] = 'simulator.debugger not preserved into settings';

        // builder fully cleaned
        if ($this->containsKeyDeep($newBuilder, 'simulator'))    $e[] = 'builder still contains simulator';
        if (array_key_exists('color_scheme', $newBuilder))       $e[] = 'builder still contains color_scheme';
        if ($this->containsKeyDeep($newBuilder, 'hexColor'))     $e[] = 'builder still contains hexColor';
        if ($this->containsKeyDeep($newBuilder, 'comment'))      $e[] = 'builder still contains comment';

        if (json_encode($newBuilder) === false || json_encode($newSettings) === false)
            $e[] = 'Result not JSON-encodable: ' . json_last_error_msg();

        return $e;
    }

    private function countScreens(array $b): int { return is_array($b['screens'] ?? null) ? count($b['screens']) : 0; }
    private function countDisplays(array $b): int {
        $n = 0; foreach (($b['screens'] ?? []) as $s) { $n += is_array($s['displays'] ?? null) ? count($s['displays']) : 0; } return $n;
    }
    private function collectCodeTexts($node, array &$acc = []): array {
        if (is_array($node)) {
            if (($node['code_editor_mode'] ?? null) === true) $acc[] = (string) ($node['code_editor_text'] ?? '');
            foreach ($node as $v) if (is_array($v)) $this->collectCodeTexts($v, $acc);
        }
        return $acc;
    }
    private function countCustomPagination(array $b): int {
        $n = 0;
        foreach (($b['screens'] ?? []) as $s) foreach (($s['displays'] ?? []) as $d) {
            $pg = $d['content']['pagination'] ?? null;
            if (is_array($pg) && (($pg['use_global_pagination'] ?? null) === false)) $n++;
        }
        return $n;
    }
    private function containsKeyDeep($node, string $key): bool {
        if (!is_array($node)) return false;
        if (array_key_exists($key, $node)) return true;
        foreach ($node as $v) if (is_array($v) && $this->containsKeyDeep($v, $key)) return true;
        return false;
    }
}
```

> **Note on `comment`:** the converter strips `comment` recursively from the builder, but only relocates it
> into `settings.builder_ui` for elements that carry an `id`. Annotations on id-less nested elements are
> dropped (canvas defaults) — acceptable per the owner. The `containsKeyDeep($newBuilder,'comment')` check
> guarantees none remain in the builder regardless.

---

## 2) `app/Console/Commands/UpgradeUssdBuilders.php`

```php
<?php

namespace App\Console\Commands;

use App\Models\Version;
use App\Services\Ussd\BuilderUpgrader;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpgradeUssdBuilders extends Command
{
    protected $signature = 'ussd:upgrade-builders
        {--dry-run    : Report what would change without writing}
        {--version=   : Upgrade only this version id}
        {--chunk=100  : Versions processed per batch}
        {--backup     : Write each original builder+settings to storage/app/builder-backups/ before writing}
        {--force      : Re-process even versions already at schema_version:2}';

    protected $description = 'Convert stored USSD builders to schema_version:2 and extract config into versions.settings';

    public function handle(BuilderUpgrader $upgrader): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $backup = (bool) $this->option('backup');
        $force  = (bool) $this->option('force');
        $chunk  = max(1, (int) $this->option('chunk'));

        $q = DB::table('versions')->select('id', 'builder', 'settings');
        if ($this->option('version')) $q->where('id', $this->option('version'));

        $total = (clone $q)->count();
        $up = 0; $skip = 0; $fail = 0; $saved = 0;

        $this->info(($dryRun ? '[DRY RUN] ' : '') . "Processing {$total} version(s)…");
        $bar = $this->output->createProgressBar($total);

        $q->orderBy('id')->chunk($chunk, function ($rows) use (
            $upgrader, $dryRun, $backup, $force, &$up, &$skip, &$fail, &$saved, $bar
        ) {
            foreach ($rows as $row) {
                $bar->advance();

                $legacy = json_decode($row->builder, true);
                if (!is_array($legacy)) {
                    $this->newLine(); $this->error("Version {$row->id}: builder not decodable — skipped"); $fail++; continue;
                }

                if (!$force && (($legacy['schema_version'] ?? 0) >= BuilderUpgrader::TARGET_SCHEMA_VERSION)) { $skip++; continue; }

                $existingSettings = $row->settings ? json_decode($row->settings, true) : null;
                $result = $upgrader->upgrade($legacy, $existingSettings);

                $errors = $upgrader->validate($legacy, $result['builder'], $result['settings']);
                if (!empty($errors)) {
                    $this->newLine(); $this->error("Version {$row->id}: validation failed — " . implode('; ', $errors)); $fail++; continue;
                }

                $saved += max(0, strlen($row->builder) - strlen(json_encode($result['builder'])));

                if ($dryRun) { $up++; continue; }

                if ($backup) {
                    Storage::put("builder-backups/version-{$row->id}.json",
                        json_encode(['builder' => $row->builder, 'settings' => $row->settings]));
                }

                // Persist via Eloquent so the observer re-caches (updated -> findAndCache).
                // saving() runs repairBuilder which short-circuits (schema_version>=2). Idempotent.
                $version = Version::find($row->id);
                $version->builder  = $result['builder'];
                $version->settings = $result['settings'];
                $version->save();

                $up++;
            }
        });

        $bar->finish(); $this->newLine(2);
        $this->table(['Total','Upgraded','Skipped (v2)','Failed','Builder bytes saved'],
            [[$total, $up, $skip, $fail, number_format($saved)]]);

        if ($fail > 0) { $this->error("{$fail} version(s) failed validation and were NOT modified."); return self::FAILURE; }
        $this->info($dryRun ? 'Dry run complete — no changes written.' : 'All versions upgraded (builder slimmed + settings extracted) and re-cached.');
        return self::SUCCESS;
    }
}
```

### Why persist via Eloquent
`Version::save()` fires `VersionObserver::updated()` → `findAndCache()` (which, per File 2 P2, now SELECTs
`settings` too), refreshing the cache in the same pass. `saving()` runs `repairBuilder()`, which
short-circuits because the new builder is `schema_version: 2` — no double-processing, fully idempotent. For
very large datasets, switch to a raw `DB::table('versions')->update([...])` + explicit `findAndCache($id)`.

---

## 3) Tests (`tests/Unit/BuilderUpgraderTest.php`) — author with the converter

- Stamps `schema_version: 2`; idempotent (`upgrade(upgrade)` == `upgrade`).
- `simulator` / `color_scheme` / `hexColor` / `comment` removed from builder (assert `containsKeyDeep` false).
- Timeout values land in `settings.session.*` and **equal** the legacy values (real-session safety).
- `simulator.subscriber` / `debugger` land in `settings.simulator.*` unchanged.
- `color_scheme` lands in `settings.appearance.color_scheme`; per-element `hexColor`/`comment` land in
  `settings.builder_ui[<id>]` for id'd elements.
- Global-pagination display reduced to `{use_global_pagination:true}`; custom (`false`) display preserved.
- Empty ValueStructure compacted; `code_editor_mode:true` preserved verbatim.
- `validate()` flags each deliberately broken invariant.
- **Golden test:** real `"First-Aid App - version 1.00-2.json"` fixture → assert screen/display counts
  unchanged, ~998 ValueStructures compacted, builder has no relocated keys, settings populated, and the
  engine renders the upgraded builder + settings identically (small integration test driving `UssdService`).

---

## Run procedure (per environment)

```bash
php artisan ussd:upgrade-builders --dry-run                 # 1. dry-run, read the report
php artisan ussd:upgrade-builders --version=<id> --backup   # 2. spot-check one version
php artisan ussd:upgrade-builders --backup                  # 3. full run with backups
php artisan cache:clear                                     # 4. belt-and-braces (observer already re-caches)
```

> Deploy order: **File 1 merged → File 2 code merged → this converter run → verify → serve.** File 2's engine
> assumes `schema_version: 2` + `versions.settings`; serving before conversion completes relies only on the
> File 2 P9 graceful-degradation guard — do not lean on it for the bulk.

---

## Verification

```sql
SELECT id,
       JSON_EXTRACT(builder, '$.schema_version')               AS builder_schema,
       JSON_CONTAINS_PATH(builder, 'one', '$.simulator')       AS builder_has_simulator,   -- expect 0
       JSON_EXTRACT(settings, '$.session.timeout_limit_in_seconds') AS timeout_secs,       -- expect a value
       LENGTH(builder) AS builder_bytes
FROM versions
ORDER BY id;
-- Expect: builder_schema = 2 for all rows; builder_has_simulator = 0; timeout_secs populated; smaller builder.
```

- Simulator: walk several real apps end-to-end (instructions, options, pagination, code-editor values,
  language switch, timeout, debugger logs) — identical to pre-upgrade.
- Real-session check: a new session's `timeout_at` matches `now + settings.session.timeout_limit_in_seconds`.
- Independent edit: change the test number / a colour / a timeout via the File 2 settings endpoint and
  confirm `versions.builder` is byte-unchanged while `versions.settings` updates.
- Logs: no "served un-upgraded" warnings (File 2 P9); no "undefined index" for pagination / code_editor_* /
  simulator / timeout.

---

## Rollback

1. **Per-version:** `--backup` wrote `{builder, settings}` originals to
   `storage/app/builder-backups/version-{id}.json`. Restore by writing them back and re-caching (a small
   inverse command or tinker loop).
2. **Whole database:** restore from the Phase 0 backup (`backup_pre_perf_*.sql`).
3. The File 2 defensive reads (`versionSetting()` defaults, null-safe pagination/ValueStructure) keep legacy
   builders working, so the safest recovery is: keep File 2 code, restore data, re-run the converter.

---

## Single commit (after ALL of the above is built and verified on a copy of production data)

```bash
git add app/Services/Ussd/BuilderUpgrader.php \
        app/Console/Commands/UpgradeUssdBuilders.php \
        tests/Unit/BuilderUpgraderTest.php \
        tests/Fixtures/first-aid-app-builder.json
git commit -m "feat(ussd): one-time converter — extract settings + slim builders to schema_version:2

Adds BuilderUpgrader (pure split into lean builder + version settings) and the
ussd:upgrade-builders command. Per version it relocates simulator/test config,
timeout settings (values preserved for real sessions), color_scheme and
per-element hexColor/comment into versions.settings; deletes simulator/
color_scheme/hexColor/comment from the builder; normalizes pagination;
compacts empty ValueStructures; stamps schema_version:2. Validates every
invariant before writing both columns, backs up originals, re-caches via the
observer, and is idempotent. Includes unit tests + golden First-Aid fixture.

Mitigates all breaking changes in File 2; File 1 needs no JSON conversion.

Ref: builder-json-purity principle; docs/performance/02_*; report sections 5-6."
```

---

## End of File 3

With File 1 (safe engine/infra optimizations), File 2 (builder reduced to pure service-definition + new
`versions.settings` store) and File 3 (this one-time converter) complete, every existing application is
converted in a single pass: the builder holds only what builds the real service, and all simulator/UI/test
configuration is editable as independent version settings without touching the builder. CI/CD wiring of
`ussd:upgrade-builders` into the deploy pipeline is intentionally out of scope here.
