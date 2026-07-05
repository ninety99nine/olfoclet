<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use App\Services\Ussd\UssdService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use ReflectionClass;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\Support\PendingUntilImplemented;
use Tests\TestCase;

/**
 * Executable acceptance criteria for 01_SAFE_NON_BREAKING_FIXES.md.
 *
 * Every test skips (pending) until its fix lands, then must pass. Behaviour that
 * these fixes must NOT change is guarded separately by GoldenMasterFlowTest.
 *
 * Not automatable here (infrastructure / server config, documented in the
 * harness README): Problem 4 (InnoDB buffer pool), Problem 7 partial (MySQL),
 * Problem 8 (Redis drivers).
 *
 * @group target
 * @group file01
 */
class File01TargetTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;
    use PendingUntilImplemented;

    // ---- Problem 6 — performance indexes -----------------------------------

    /** @dataProvider expectedIndexes */
    public function test_problem6_hot_path_indexes_exist(string $table, array $columns): void
    {
        $exists = $this->tableHasIndexOnColumns($table, $columns);
        $this->pendingUnless($exists, "File 01 Problem 6 — index on {$table}(".implode(',', $columns).')');
        $this->assertTrue($exists);
    }

    public static function expectedIndexes(): array
    {
        return [
            'ussd_sessions.session_id' => ['ussd_sessions', ['session_id']],
            'ussd_sessions.created_at' => ['ussd_sessions', ['created_at']],
            'global_variables.account_app' => ['global_variables', ['ussd_account_id', 'app_id']],
            'global_variables.account_version' => ['global_variables', ['ussd_account_id', 'version_id']],
            'session_notifications.account_seen' => ['session_notifications', ['ussd_account_id', 'marked_as_seen']],
        ];
    }

    // ---- Problem 5 — reused Guzzle client with timeouts ---------------------

    public function test_problem5_http_client_is_reused_and_has_timeouts(): void
    {
        $this->pendingUnless($this->serviceMethodExists('getHttpClient'), 'File 01 Problem 5 — getHttpClient()');

        $svc = new UssdService(Request::create('/', 'POST'));
        $ref = new ReflectionClass($svc);
        $method = $ref->getMethod('getHttpClient');
        $method->setAccessible(true);

        $clientA = $method->invoke($svc);
        $clientB = $method->invoke($svc);
        $this->assertSame($clientA, $clientB, 'getHttpClient() must return one reused client per request.');

        $configProp = (new ReflectionClass($clientA))->getProperty('config');
        $configProp->setAccessible(true);
        $config = $configProp->getValue($clientA);

        $this->assertSame(10, $config['timeout'] ?? null, 'Expected a 10s timeout.');
        $this->assertSame(5, $config['connect_timeout'] ?? null, 'Expected a 5s connect timeout.');
    }

    // ---- Problem 15 — no default eager-load / appends on UssdSession --------

    public function test_problem15_ussd_session_does_not_eager_load_account_by_default(): void
    {
        $with = (array) $this->protectedProp(new UssdSession(), 'with');
        $this->pendingUnless(! in_array('account', $with, true), 'File 01 Problem 15 — drop $with=[account]');

        $this->assertNotContains('account', $with);
    }

    // ---- Problem 3 — persistent PDO connections -----------------------------

    public function test_problem3_persistent_pdo_option_is_configured(): void
    {
        $options = config('database.connections.mysql.options', []);
        $persistent = $options[\PDO::ATTR_PERSISTENT] ?? null;

        $this->pendingUnless($persistent === true, 'File 01 Problem 4 — PDO::ATTR_PERSISTENT');
        $this->assertTrue($persistent);
    }

    // ---- Problem 10 — scheduled session archiving ---------------------------

    public function test_problem10_archiving_moves_old_sessions_to_archive(): void
    {
        $ready = $this->artisanCommandExists('sessions:archive') && Schema::hasTable('ussd_sessions_archive');
        $this->pendingUnless($ready, 'File 01 Problem 10 — sessions:archive command + archive table');

        // 2 days old: past the 24h move window but well within the 3-month retention,
        // so it is moved to the archive and NOT purged. (See ArchiveOldSessionsTest
        // for the move/cap/purge phases in detail.)
        $app = FirstAidApp::create();
        $oldId = DB::table('ussd_sessions')->insertGetId([
            'ussd_account_id' => 1, 'ussd_account_connection_id' => 1,
            'session_id' => 'old-session', 'service_code' => '*217#', 'request_type' => '3',
            'app_id' => $app->app->id, 'version_id' => $app->version->id,
            'created_at' => now()->subDays(2), 'updated_at' => now()->subDays(2),
        ]);

        $this->artisan('sessions:archive')->assertExitCode(0);

        $this->assertDatabaseMissing('ussd_sessions', ['id' => $oldId]);
        $this->assertDatabaseHas('ussd_sessions_archive', ['session_id' => 'old-session']);
    }

    // ---- Problem 20 — session-state fast path (no per-keystroke replay) ------

    public function test_problem20_session_state_column_exists(): void
    {
        $exists = $this->columnExists('ussd_sessions', 'session_state');
        $this->pendingUnless($exists, 'File 01 Problem 20 — ussd_sessions.session_state column');
        $this->assertTrue($exists);
    }

    public function test_problem20_continuation_requests_do_not_refire_on_start_rest_events(): void
    {
        $this->pendingUnless(
            $this->columnExists('ussd_sessions', 'session_state'),
            'File 01 Problem 20 — session-state fast path'
        );

        $app = FirstAidApp::create();

        // New session: on-start "Get User" fires once.
        $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => 'p20', 'request_type' => '1', 'msg' => $app->dedicatedCode,
        ]);
        $this->assertCount(1, $this->lastUssdService->recordedHttpCalls, 'New session should fire Get User once.');

        // Continuation: with the fast path, on-start events must NOT re-fire.
        $r = $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => 'p20', 'request_type' => '2', 'msg' => '3',
        ]);
        $this->assertCount(0, $this->lastUssdService->recordedHttpCalls,
            'Continuation must resume from saved state without re-firing on-start REST events.');

        // ...and the visible output must be unchanged (behaviour preserved).
        $this->assertStringContainsString('Welcome to First-Aid Counselling', $r['msg']);
    }

    // ---- Problem 7 — bounded session_execution_times ------------------------

    public function test_problem7_session_execution_times_is_capped_at_50(): void
    {
        $app = FirstAidApp::create();

        $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => 'cap', 'request_type' => '1', 'msg' => $app->dedicatedCode,
        ]);

        // Pre-load the session with an already-oversized execution-times array so a
        // single further update is enough to prove whether the cap is applied
        // (cheap — no need to drive 50+ real dials).
        $session = UssdSession::where('session_id', 'cap')->first();
        $session->session_execution_times = array_map(
            fn ($i) => ['screen' => "s{$i}", 'time' => 0.01],
            range(1, 60)
        );
        $session->save();

        // One more continuation appends + (once capped) trims.
        $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => 'cap', 'request_type' => '2', 'msg' => '3',
        ]);

        $count = count(UssdSession::where('session_id', 'cap')->first()->session_execution_times ?? []);

        // While uncapped the array stays > 50 — treat that as pending.
        $this->pendingUnless($count <= 50, 'File 01 Problem 7 — cap session_execution_times at 50');
        $this->assertLessThanOrEqual(50, $count);
    }
}
