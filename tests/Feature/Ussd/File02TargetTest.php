<?php

namespace Tests\Feature\Ussd;

use App\Models\Version;
use App\Services\Ussd\UssdService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use ReflectionClass;
use Tests\Support\FirstAidApp;
use Tests\Support\PendingUntilImplemented;
use Tests\TestCase;

/**
 * Executable acceptance criteria for 02_BREAKING_JSON_STRUCTURE_FIXES.md.
 *
 * File 02 makes the builder pure service-definition and moves simulator / timeout
 * / appearance config into a new versions.settings store. These tests describe
 * the end state; each skips until its marker appears. The requirement that real
 * dialling behaviour stays byte-identical after the relocation is enforced by
 * GoldenMasterFlowTest; the one-time conversion of EXISTING builders is covered
 * by File03BuilderUpgraderTest.
 *
 * @group target
 * @group file02
 */
class File02TargetTest extends TestCase
{
    use RefreshDatabase;
    use PendingUntilImplemented;

    private function newTemplateVersion(): Version
    {
        // A version created with no builder → VersionObserver seeds the template
        // and runs repairBuilder (mirrors real creation in the builder UI).
        return Version::factory()->create();
    }

    // ---- Problem 1 — builder schema_version --------------------------------

    public function test_problem1_new_builders_are_stamped_schema_version_2(): void
    {
        $builder = $this->newTemplateVersion()->builder;
        $schema = $builder['schema_version'] ?? 0;

        $this->pendingUnless($schema >= 2, 'File 02 Problem 1 — schema_version stamping');
        $this->assertSame(2, $schema);
    }

    // ---- Problem 2 — versions.settings store --------------------------------

    public function test_problem2_versions_has_a_settings_store_cast_to_array(): void
    {
        $this->pendingUnless($this->columnExists('versions', 'settings'), 'File 02 Problem 2 — versions.settings column');

        $version = $this->newTemplateVersion();
        $version->settings = ['simulator' => ['subscriber' => ['phone_number' => '26770000000']]];
        $version->save();

        $fresh = Version::find($version->id);
        $this->assertIsArray($fresh->settings);
        $this->assertSame('26770000000', $fresh->settings['simulator']['subscriber']['phone_number']);
    }

    public function test_problem2_editing_settings_does_not_touch_the_builder(): void
    {
        // The owner directive: changing a test setting must NOT re-save the builder.
        $this->pendingUnless($this->columnExists('versions', 'settings'), 'File 02 Problem 2 — independent settings save');

        $app = FirstAidApp::create();
        $version = $app->version;
        $builderBefore = Version::find($version->id)->getRawOriginal('builder');

        $version->settings = ['simulator' => ['subscriber' => ['phone_number' => '26771111111']]];
        $version->save();

        $builderAfter = Version::find($version->id)->getRawOriginal('builder');
        $this->assertSame($builderBefore, $builderAfter, 'Saving settings must leave builder bytes unchanged.');
    }

    // ---- Problem 2/4/5 — versionSetting() accessor + relocated reads ---------

    public function test_problem2_version_setting_accessor_reads_from_settings(): void
    {
        $this->pendingUnless($this->serviceMethodExists('versionSetting'), 'File 02 Problem 2 — versionSetting() accessor');

        $version = new Version();
        $version->setRawAttributes(['settings' => json_encode(['session' => ['timeout_limit_in_seconds' => 77]])]);

        $svc = new UssdService(Request::create('/', 'POST'));
        $this->setVersion($svc, $version);

        $ref = new ReflectionClass($svc);
        $m = $ref->getMethod('versionSetting');
        $m->setAccessible(true);

        $this->assertSame(77, $m->invoke($svc, 'session.timeout_limit_in_seconds'));
        $this->assertSame('fallback', $m->invoke($svc, 'session.missing_key', 'fallback'));
    }

    public function test_problem5_timeout_is_read_from_settings_not_builder(): void
    {
        // Marker: versionSetting() exists (only present once File 02 lands). Before
        // that, getTimeoutLimitInSeconds() reads builder and this scenario is N/A.
        $this->pendingUnless($this->serviceMethodExists('versionSetting'), 'File 02 Problem 5 — timeout relocated to settings');

        $version = new Version();
        // Builder deliberately lacks simulator.settings; the value lives in settings.
        $version->setRawAttributes([
            'builder' => json_encode(['screens' => []]),
            'settings' => json_encode(['session' => ['timeout_limit_in_seconds' => 45, 'allow_timeouts' => false]]),
        ]);

        $svc = new UssdService(Request::create('/', 'POST'));
        $this->setVersion($svc, $version);

        $this->assertSame(45, (int) $svc->getTimeoutLimitInSeconds());
    }

    // ---- Problem 3 — appearance out of the builder --------------------------

    public function test_problem3_new_builders_do_not_seed_color_scheme(): void
    {
        $builder = $this->newTemplateVersion()->builder;
        $this->pendingUnless(! array_key_exists('color_scheme', $builder), 'File 02 Problem 3 — color_scheme relocated');

        $this->assertArrayNotHasKey('color_scheme', $builder);
    }

    // ---- Problem 6 — simulator key gone from the builder --------------------

    public function test_problem6_new_builders_do_not_contain_a_simulator_key(): void
    {
        $builder = $this->newTemplateVersion()->builder;
        $this->pendingUnless(! array_key_exists('simulator', $builder), 'File 02 Problem 6 — simulator key removed');

        $this->assertArrayNotHasKey('simulator', $builder);
    }

    private function setVersion(UssdService $svc, Version $version): void
    {
        $p = (new ReflectionClass($svc))->getProperty('version');
        $p->setAccessible(true);
        $p->setValue($svc, $version);
    }
}
