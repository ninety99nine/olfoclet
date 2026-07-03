<?php

namespace Tests\Feature\Ussd;

use App\Models\Version;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\FirstAidApp;
use Tests\Support\PendingUntilImplemented;
use Tests\TestCase;

/**
 * Acceptance criteria for the File 03 one-time converter command
 * `php artisan ussd:upgrade-builders`. Skips until the command is registered.
 *
 * @group target
 * @group file03
 */
class File03CommandTest extends TestCase
{
    use RefreshDatabase;
    use PendingUntilImplemented;

    private function requireCommand(): void
    {
        $this->pendingUnless(
            $this->artisanCommandExists('ussd:upgrade-builders'),
            'File 03 — ussd:upgrade-builders command'
        );
    }

    public function test_it_upgrades_a_legacy_version_to_schema_2_and_extracts_settings(): void
    {
        $this->requireCommand();

        $app = FirstAidApp::create(); // legacy builder, no schema_version, has simulator
        $this->assertArrayHasKey('simulator', Version::find($app->version->id)->builder);

        $this->artisan('ussd:upgrade-builders')->assertExitCode(0);

        $upgraded = Version::find($app->version->id);
        $this->assertSame(2, $upgraded->builder['schema_version'] ?? 0);
        $this->assertArrayNotHasKey('simulator', $upgraded->builder);
        $this->assertIsArray($upgraded->settings);
        $this->assertSame(120, $upgraded->settings['session']['timeout_limit_in_seconds'] ?? null);
    }

    public function test_dry_run_reports_but_does_not_write(): void
    {
        $this->requireCommand();

        $app = FirstAidApp::create();
        $before = Version::find($app->version->id)->getRawOriginal('builder');

        $this->artisan('ussd:upgrade-builders', ['--dry-run' => true])->assertExitCode(0);

        $after = Version::find($app->version->id)->getRawOriginal('builder');
        $this->assertSame($before, $after, 'A dry run must not modify stored builders.');
    }

    public function test_it_is_idempotent(): void
    {
        $this->requireCommand();

        $app = FirstAidApp::create();
        $this->artisan('ussd:upgrade-builders')->assertExitCode(0);
        $first = Version::find($app->version->id)->getRawOriginal('builder');

        // Second run should skip already-upgraded versions and change nothing.
        $this->artisan('ussd:upgrade-builders')->assertExitCode(0);
        $second = Version::find($app->version->id)->getRawOriginal('builder');

        $this->assertSame($first, $second, 'Re-running the converter must be a no-op.');
    }
}
