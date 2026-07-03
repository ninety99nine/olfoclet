<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use App\Models\Version;
use App\Services\Ussd\BuilderUpgrader;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\Support\GoldenMaster;
use Tests\TestCase;

/**
 * End-to-end behaviour-preservation guard for File 02 + File 03 together.
 *
 * GoldenMasterFlowTest proves the engine renders the LEGACY builder identically
 * after the File 01/02 engine changes. This test closes the loop: it runs the
 * File 03 converter (BuilderUpgrader) on the same fixture — slimming the builder
 * and extracting versions.settings exactly as `ussd:upgrade-builders` does in
 * production — and then dials the SAME input sequences and asserts the output
 * matches the SAME golden snapshots.
 *
 * If these pass, a real subscriber dialling an UPGRADED (schema_version:2 +
 * settings) application sees byte-identical screens and produces an identical
 * session row to the pre-upgrade legacy application. That is the whole safety
 * contract of File 02 shipping together with File 03.
 *
 * @group golden
 * @group file03
 */
class UpgradedRenderGoldenTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;
    use GoldenMaster;

    /**
     * Create the First-Aid app, then upgrade its stored version in place via the
     * File 03 converter (force, because FirstAidApp::create() saves through
     * repairBuilder which stamps schema_version:2 while the builder is still
     * un-slimmed). Persists both columns and re-caches, mirroring the command.
     */
    private function upgradeInPlace(FirstAidApp $app): void
    {
        $version = Version::find($app->version->id);

        $legacy = $version->builder; // array (model cast)
        $this->assertArrayHasKey('simulator', $legacy, 'Fixture should start un-slimmed.');

        $result = app(BuilderUpgrader::class)->upgrade($legacy, $version->settings, true);

        $violations = app(BuilderUpgrader::class)->validate($legacy, $result['builder'], $result['settings']);
        $this->assertSame([], $violations, 'Converter must produce a valid upgrade of the fixture.');

        $version->builder = $result['builder'];
        $version->settings = $result['settings'];
        $version->save();            // observer re-caches; repairBuilder short-circuits (v2)
        $version->findAndCache();     // belt-and-braces: engine reads the upgraded version

        // Sanity: the served builder is now slim + canonical.
        $fresh = Version::find($app->version->id);
        $this->assertArrayNotHasKey('simulator', $fresh->builder);
        $this->assertSame(2, $fresh->builder['schema_version'] ?? 0);
        $this->assertIsArray($fresh->settings);
    }

    /**
     * Identical to GoldenMasterFlowTest::runSequence — one new-session dial then
     * the given continuations — so the transcript+session snapshot is comparable
     * to the legacy golden.
     *
     * @param  list<string>  $continuations
     * @return array<string,mixed>
     */
    private function runSequence(FirstAidApp $app, string $sessionId, array $continuations): array
    {
        $transcript = [];

        $r = $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => $sessionId, 'request_type' => '1', 'msg' => $app->dedicatedCode,
        ]);
        $transcript[] = ['step' => 'start', 'input' => $app->dedicatedCode] + $this->normaliseUssdResponse($r);

        foreach ($continuations as $i => $input) {
            if ((string) ($transcript[count($transcript) - 1]['request_type']) === '3') {
                break;
            }
            $r = $this->dialUssd([
                'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
                'session_id' => $sessionId, 'request_type' => '2', 'msg' => $input,
            ]);
            $transcript[] = ['step' => 'in:'.$i, 'input' => $input] + $this->normaliseUssdResponse($r);
        }

        $session = UssdSession::where('session_id', $sessionId)->first();

        return [
            'transcript' => $transcript,
            'session' => [
                'request_type' => $session?->request_type,
                'service_code' => $session?->service_code,
                'type' => $session?->type,
                'fatal_error' => (bool) $session?->fatal_error,
                'reply_records' => $session?->reply_records,
            ],
        ];
    }

    public function test_upgraded_initial_screen_matches_legacy_golden(): void
    {
        $app = FirstAidApp::create();
        $this->upgradeInPlace($app);
        $result = $this->runSequence($app, 'up-initial', []);
        $this->assertMatchesGolden('flow_initial', $result);
    }

    public function test_upgraded_exit_path_matches_legacy_golden(): void
    {
        $app = FirstAidApp::create();
        $this->upgradeInPlace($app);
        $result = $this->runSequence($app, 'up-exit', ['2']);
        $this->assertMatchesGolden('flow_exit', $result);
    }

    public function test_upgraded_join_path_matches_legacy_golden(): void
    {
        $app = FirstAidApp::create();
        $this->upgradeInPlace($app);
        $result = $this->runSequence($app, 'up-join', ['1']);
        $this->assertMatchesGolden('flow_join', $result);
    }

    public function test_upgraded_invalid_input_replay_matches_legacy_golden(): void
    {
        $app = FirstAidApp::create();
        $this->upgradeInPlace($app);
        $result = $this->runSequence($app, 'up-replay', ['3', '3', '3', '3', '3']);
        $this->assertMatchesGolden('flow_invalid_replay', $result);
    }
}
