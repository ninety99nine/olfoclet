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
        // Positive detection — base-migration indexes plus the File 01 P6
        // session_id index once it has landed.
        $this->assertTrue($this->tableHasIndexOnColumns('ussd_sessions', ['ussd_account_id']));
        $this->assertTrue($this->tableHasIndexOnColumns('session_notifications', ['session_id']));
        $this->assertTrue($this->tableHasIndexOnColumns('ussd_sessions', ['project_id', 'app_id', 'version_id']));
        $this->assertTrue($this->tableHasIndexOnColumns('ussd_sessions', ['session_id'])); // File 01 P6
    }

    public function test_index_marker_reports_missing_target_indexes_as_absent(): void
    {
        // Negative detection — indexes that no phase ever creates, so this stays
        // stable regardless of which fixes have landed.
        $this->assertFalse($this->tableHasIndexOnColumns('ussd_sessions', ['fatal_error_msg']));
        $this->assertFalse($this->tableHasIndexOnColumns('global_variables', ['metadata']));
    }

    public function test_column_marker_detects_present_and_absent_columns(): void
    {
        $this->assertTrue($this->columnExists('ussd_sessions', 'request_type'));       // base column
        $this->assertFalse($this->columnExists('ussd_sessions', 'no_such_column_xyz')); // never exists
    }

    public function test_model_state_marker_reflects_current_eager_loading(): void
    {
        // File 01 P15 removed the default eager-load of 'account' (the marker the
        // P15 target test keys off). It must no longer be auto-loaded.
        $with = (array) $this->protectedProp(new UssdSession(), 'with');
        $this->assertNotContains('account', $with);
    }
}
