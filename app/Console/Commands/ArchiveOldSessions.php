<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Keep the hot `ussd_sessions` table small and fast by moving finished sessions
 * into `ussd_sessions_archive`, and keep disk bounded by purging very old
 * archived rows. Runs nightly (see Kernel). The live USSD request path only ever
 * touches the last ~24h of sessions (a session completes in <2 min), so archiving
 * everything older is invisible to the runtime. History/analytics readers see the
 * full retention window via the `ussd_sessions_all` UNION view.
 *
 * Three phases, all batched (copy-then-delete in small transactions) so the table
 * is never long-locked and live traffic is never blocked:
 *   1. MOVE   — live rows older than --hours (default 24) -> archive.
 *   2. CAP    — for any app holding more than --per-app-cap live rows, move its
 *               oldest surplus rows -> archive (guards a single very high-volume
 *               app from bloating the hot table between nightly runs).
 *   3. PURGE  — archived rows older than --retention-months (default 3) -> deleted.
 */
class ArchiveOldSessions extends Command
{
    protected $signature = 'sessions:archive
        {--hours=24 : Move live sessions older than this many hours into the archive}
        {--per-app-cap=1000000 : Max live rows kept per app (oldest surplus is archived)}
        {--retention-months=3 : Delete archived sessions older than this many months}
        {--batch=5000 : Rows processed per batch}';

    protected $description = 'Archive finished ussd_sessions (24h+), cap live rows per app (1M), purge archive (>3mo)';

    public function handle(): int
    {
        $hours = max(1, (int) $this->option('hours'));
        $perAppCap = max(1, (int) $this->option('per-app-cap'));
        $retentionMonths = max(1, (int) $this->option('retention-months'));
        $batch = max(1, (int) $this->option('batch'));

        if (! DB::getSchemaBuilder()->hasTable('ussd_sessions_archive')) {
            $this->error('ussd_sessions_archive table does not exist — run migrations first.');

            return self::FAILURE;
        }

        $moveCutoff = now()->subHours($hours);
        $purgeCutoff = now()->subMonths($retentionMonths);

        // ---- Phase 1: MOVE live rows older than the retention window ---------
        $moved = $this->archiveWhere(
            fn () => DB::table('ussd_sessions')->where('created_at', '<', $moveCutoff)->orderBy('id')->limit($batch)->pluck('id')
        );
        $this->info("Phase 1 (move >{$hours}h): archived {$moved} session(s).");

        // ---- Phase 2: CAP live rows per app --------------------------------
        // Any app still over the cap after phase 1 (a very busy app inside the
        // 24h window): archive its OLDEST surplus so the hot table stays bounded.
        $cappedTotal = 0;
        $overCap = DB::table('ussd_sessions')
            ->select('app_id', DB::raw('COUNT(*) as c'))
            ->groupBy('app_id')
            ->having('c', '>', $perAppCap)
            ->get();

        foreach ($overCap as $row) {
            $surplus = (int) $row->c - $perAppCap;
            while ($surplus > 0) {
                $take = min($batch, $surplus);
                $ids = DB::table('ussd_sessions')
                    ->where('app_id', $row->app_id)
                    ->orderBy('id') // oldest first
                    ->limit($take)
                    ->pluck('id');

                if ($ids->isEmpty()) {
                    break;
                }

                $this->moveBatch($ids);
                $cappedTotal += $ids->count();
                $surplus -= $ids->count();
            }
        }
        if ($cappedTotal > 0) {
            $this->info("Phase 2 (per-app cap {$perAppCap}): archived {$cappedTotal} surplus session(s).");
        }

        // ---- Phase 3: PURGE archived rows older than retention -------------
        $purged = 0;
        do {
            $ids = DB::table('ussd_sessions_archive')
                ->where('created_at', '<', $purgeCutoff)
                ->orderBy('id')
                ->limit($batch)
                ->pluck('id');

            if ($ids->isEmpty()) {
                break;
            }

            DB::table('ussd_sessions_archive')->whereIn('id', $ids)->delete();
            $purged += $ids->count();
        } while (true);
        $this->info("Phase 3 (purge >{$retentionMonths}mo): deleted {$purged} archived session(s).");

        $this->info("Done. Moved={$moved}, capped={$cappedTotal}, purged={$purged}.");

        return self::SUCCESS;
    }

    /**
     * Repeatedly pull a batch of live-session ids (via $nextBatch) and move them
     * to the archive until none remain. Returns the total moved.
     */
    private function archiveWhere(callable $nextBatch): int
    {
        $total = 0;
        do {
            $ids = $nextBatch();
            if ($ids->isEmpty()) {
                break;
            }
            $this->moveBatch($ids);
            $total += $ids->count();
        } while (true);

        return $total;
    }

    /** Copy the given live sessions into the archive then delete them, atomically. */
    private function moveBatch(\Illuminate\Support\Collection $ids): void
    {
        DB::transaction(function () use ($ids) {
            DB::statement(
                'INSERT INTO ussd_sessions_archive SELECT * FROM ussd_sessions WHERE id IN ('.$ids->implode(',').')'
            );
            DB::table('ussd_sessions')->whereIn('id', $ids)->delete();
        });
    }
}
