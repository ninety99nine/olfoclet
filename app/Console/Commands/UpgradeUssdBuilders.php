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
        {--version-id=   : Upgrade only this version id (avoids Symfony reserved --version)}
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
        if ($this->option('version-id')) { $q->where('id', $this->option('version-id')); }

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
                if (! is_array($legacy)) {
                    $this->newLine(); $this->error("Version {$row->id}: builder not decodable — skipped"); $fail++; continue;
                }

                // Skip only builders that are already schema_version:2 AND actually
                // slimmed (isCanonical). A builder stamped v2 by repairBuilder but
                // still carrying simulator/color_scheme/hexColor/comment is NOT
                // canonical and must still be converted.
                if (! $force && $upgrader->isCanonical($legacy)) { $skip++; continue; }

                $existingSettings = $row->settings ? json_decode($row->settings, true) : null;
                $result = $upgrader->upgrade($legacy, $existingSettings, $force);

                if (! $result['changed']) { $skip++; continue; }

                $errors = $upgrader->validate($legacy, $result['builder'], $result['settings']);
                if (! empty($errors)) {
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
        $this->table(['Total', 'Upgraded', 'Skipped (canonical)', 'Failed', 'Builder bytes saved'],
            [[$total, $up, $skip, $fail, number_format($saved)]]);

        if ($fail > 0) { $this->error("{$fail} version(s) failed validation and were NOT modified."); return self::FAILURE; }
        $this->info($dryRun ? 'Dry run complete — no changes written.' : 'All versions upgraded (builder slimmed + settings extracted) and re-cached.');
        return self::SUCCESS;
    }
}
