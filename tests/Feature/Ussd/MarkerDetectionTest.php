<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\PendingUntilImplemented;
use Tests\TestCase;

/**
 * Proves the "pending until implemented" markers detect real schema/state
 * correctly — both positives and negatives — so the target tests genuinely
 * activate when a fix lands instead of skipping forever (which would make them
 * worthless). Ground truth = the CURRENT (pre-implementation) schema.
 *
 * @group harness
 */
class MarkerDetectionTest extends TestCase
{
    use RefreshDatabase;
    use PendingUntilImplemented;

    public function test_index_marker_detects_existing_indexes(): void
    {
        // These indexes exist in the base migrations (positive detection).
        $this->assertTrue($this->tableHasIndexOnColumns('ussd_sessions', ['ussd_account_id']));
        $this->assertTrue($this->tableHasIndexOnColumns('session_notifications', ['session_id']));
        $this->assertTrue($this->tableHasIndexOnColumns('ussd_sessions', ['project_id', 'app_id', 'version_id']));
    }

    public function test_index_marker_reports_missing_target_indexes_as_absent(): void
    {
        // File 01 Problem 6 has not run yet (negative detection) — this is exactly
        // what keeps those target tests skipped for now.
        $this->assertFalse($this->tableHasIndexOnColumns('ussd_sessions', ['session_id']));
        $this->assertFalse($this->tableHasIndexOnColumns('global_variables', ['ussd_account_id', 'app_id']));
    }

    public function test_column_marker_detects_present_and_absent_columns(): void
    {
        $this->assertTrue($this->columnExists('ussd_sessions', 'request_type'));   // present today
        $this->assertFalse($this->columnExists('ussd_sessions', 'session_state')); // File 01 P20 target
        $this->assertFalse($this->columnExists('versions', 'settings'));           // File 02 P2 target
    }

    public function test_model_state_marker_reflects_current_eager_loading(): void
    {
        // UssdSession currently eager-loads 'account' — the File 01 P15 target
        // waits for this to be removed.
        $with = (array) $this->protectedProp(new UssdSession(), 'with');
        $this->assertContains('account', $with);
    }
}
