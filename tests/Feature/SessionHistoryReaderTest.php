<?php

namespace Tests\Feature;

use App\Models\SessionHistory;
use App\Models\UssdSession;
use App\Repositories\UssdSessionRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Locks the reader contract for the archival split:
 *   - the USSD runtime (UssdSession, base table) sees ONLY live sessions — the
 *     hot path is never redirected to the union view;
 *   - the history readers (Sessions list repo + session-detail model) see BOTH
 *     live AND archived sessions via the ussd_sessions_all view.
 */
class SessionHistoryReaderTest extends TestCase
{
    use RefreshDatabase;

    private function seedRow(string $table, array $overrides = []): int
    {
        return DB::table($table)->insertGetId(array_merge([
            'session_id' => 's'.uniqid(),
            'type' => 'shared',
            'request_type' => '3',
            'fatal_error' => 0,
            'ussd_account_id' => 1,
            'ussd_account_connection_id' => 1,
            'app_id' => 1,
            'version_id' => 1,
            'project_id' => 1,
            'total_session_duration' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ], $overrides));
    }

    public function test_engine_model_sees_only_live_base_table(): void
    {
        $this->seedRow('ussd_sessions');
        $this->seedRow('ussd_sessions_archive');

        // The hot runtime model must NOT see archived rows (stays on the base table).
        $this->assertSame(1, UssdSession::count());
    }

    public function test_history_model_sees_live_and_archived(): void
    {
        $live = $this->seedRow('ussd_sessions');
        $arch = $this->seedRow('ussd_sessions_archive');

        $this->assertSame(2, SessionHistory::count());
        $this->assertNotNull(SessionHistory::find($live));
        $this->assertNotNull(SessionHistory::find($arch), 'archived session must be findable for the detail view');
    }

    public function test_sessions_list_repository_returns_archived_too(): void
    {
        $this->seedRow('ussd_sessions');
        $this->seedRow('ussd_sessions_archive');

        $repo = resolve(UssdSessionRepository::class)->setModel();
        $sessions = $repo->queryUssdSessionsWithoutFilters()->get();

        $this->assertCount(2, $sessions, 'the Sessions list must include archived sessions');
    }

    public function test_history_model_is_read_only(): void
    {
        $this->expectException(\LogicException::class);
        (new SessionHistory)->fill(['session_id' => 'x'])->save();
    }
}
