<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Guards the three phases of `sessions:archive`: move (>24h), per-app cap (1M),
 * and archive purge (>3 months). Uses raw inserts with controlled timestamps.
 */
class ArchiveOldSessionsTest extends TestCase
{
    use RefreshDatabase;

    /** Insert a live session with a given created_at (and optional app_id). */
    private function seedLive(string $createdAt, int $appId = 1): int
    {
        return DB::table('ussd_sessions')->insertGetId([
            'session_id' => 's'.uniqid(),
            'type' => 'shared',
            'request_type' => '3',
            'ussd_account_id' => 1,
            'ussd_account_connection_id' => 1,
            'app_id' => $appId,
            'version_id' => 1,
            'project_id' => 1,
            'total_session_duration' => 0,
            'created_at' => $createdAt,
            'updated_at' => $createdAt,
        ]);
    }

    public function test_moves_sessions_older_than_24h_and_keeps_recent(): void
    {
        $old = $this->seedLive(now()->subHours(25)->toDateTimeString());
        $recent = $this->seedLive(now()->subHours(2)->toDateTimeString());

        $this->artisan('sessions:archive')->assertSuccessful();

        $this->assertDatabaseMissing('ussd_sessions', ['id' => $old]);
        $this->assertDatabaseHas('ussd_sessions_archive', ['id' => $old]);
        $this->assertDatabaseHas('ussd_sessions', ['id' => $recent]);
        // The UNION view still shows both — history preserved.
        $this->assertEquals(2, DB::table('ussd_sessions_all')->count());
    }

    public function test_purges_archive_older_than_retention(): void
    {
        // Seed a very old live row so archival moves it, plus a directly-archived
        // row older than 3 months that must be purged.
        $this->seedLive(now()->subMonths(4)->toDateTimeString());

        $this->artisan('sessions:archive')->assertSuccessful();

        // The 4-month-old session was moved then purged (>3 months) — gone from both.
        $this->assertEquals(0, DB::table('ussd_sessions')->count());
        $this->assertEquals(0, DB::table('ussd_sessions_archive')->count());
    }

    public function test_caps_live_rows_per_app(): void
    {
        // 5 recent sessions for app 7; cap at 2 -> 3 oldest surplus archived.
        $ids = [];
        for ($i = 0; $i < 5; $i++) {
            $ids[] = $this->seedLive(now()->subMinutes(60 - $i)->toDateTimeString(), 7);
        }

        $this->artisan('sessions:archive', ['--per-app-cap' => 2])->assertSuccessful();

        $this->assertEquals(2, DB::table('ussd_sessions')->where('app_id', 7)->count());
        $this->assertEquals(3, DB::table('ussd_sessions_archive')->where('app_id', 7)->count());
        // The 2 kept live are the NEWEST (largest ids).
        $liveIds = DB::table('ussd_sessions')->where('app_id', 7)->pluck('id')->all();
        $this->assertEqualsCanonicalizing(array_slice($ids, -2), $liveIds);
    }
}
