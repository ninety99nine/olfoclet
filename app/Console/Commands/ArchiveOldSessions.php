<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * File 01 Problem 10 — move ussd_sessions older than the retention window into
 * ussd_sessions_archive in batches (copy-then-delete), keeping the hot table
 * small without long locks. Scheduled daily; the live request path is untouched.
 */
class ArchiveOldSessions extends Command
{
    protected $signature = 'sessions:archive
        {--days=90 : Archive sessions older than this many days}
        {--batch=5000 : Rows moved per batch}';

    protected $description = 'Move old ussd_sessions rows into ussd_sessions_archive in batches';

    public function handle(): int
    {
        $days = max(1, (int) $this->option('days'));
        $batch = max(1, (int) $this->option('batch'));
        $cutoff = now()->subDays($days);

        if (! DB::getSchemaBuilder()->hasTable('ussd_sessions_archive')) {
            $this->error('ussd_sessions_archive table does not exist — run migrations first.');

            return self::FAILURE;
        }

        $total = 0;

        do {
            $ids = DB::table('ussd_sessions')
                ->where('created_at', '<', $cutoff)
                ->orderBy('id')
                ->limit($batch)
                ->pluck('id');

            if ($ids->isEmpty()) {
                break;
            }

            DB::transaction(function () use ($ids) {
                DB::statement(
                    'INSERT INTO ussd_sessions_archive SELECT * FROM ussd_sessions WHERE id IN ('.$ids->implode(',').')'
                );
                DB::table('ussd_sessions')->whereIn('id', $ids)->delete();
            });

            $total += $ids->count();
            $this->info("Archived {$ids->count()} sessions (running total: {$total}).");
        } while (true);

        $this->info("Done. Archived {$total} session(s) older than {$days} days.");

        return self::SUCCESS;
    }
}
