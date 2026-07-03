<?php

namespace Tests\Feature\Ussd;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

/**
 * Proves the test harness itself is wired correctly BEFORE we rely on it for
 * behaviour-preservation tests of files 01/02/03:
 *   - tests run against the dedicated telcoflo_test schema (never live telcoflo)
 *   - RefreshDatabase migrates the olfoclet schema cleanly on MySQL
 *   - the core USSD tables exist with their columns
 *
 * @group harness
 */
class HarnessSanityTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_runs_against_the_dedicated_test_schema(): void
    {
        $database = DB::connection()->getDatabaseName();

        $this->assertSame(
            'telcoflo_test',
            $database,
            'Tests must run against telcoflo_test, not the live database. Got: '.$database
        );
    }

    public function test_core_ussd_tables_exist_after_migration(): void
    {
        foreach ([
            'projects', 'apps', 'versions', 'short_codes', 'ussd_accounts',
            'ussd_account_connections', 'ussd_sessions', 'global_variables',
            'session_notifications',
        ] as $table) {
            $this->assertTrue(Schema::hasTable($table), "Missing table: {$table}");
        }
    }

    public function test_ussd_sessions_has_the_columns_the_engine_writes(): void
    {
        foreach ([
            'session_id', 'service_code', 'request_type', 'text', 'reply_records',
            'inputs_and_outputs', 'logs', 'session_execution_times', 'timeout_at',
            'allow_timeout', 'ussd_account_id', 'app_id', 'version_id',
        ] as $column) {
            $this->assertTrue(
                Schema::hasColumn('ussd_sessions', $column),
                "ussd_sessions missing column: {$column}"
            );
        }
    }

    public function test_versions_builder_is_cast_to_array(): void
    {
        $version = new \App\Models\Version();

        $this->assertSame('array', $version->getCasts()['builder'] ?? null);
    }
}
