<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\Support\GoldenMaster;
use Tests\TestCase;

/**
 * Behaviour-preservation guard for files 01 and 02.
 *
 * Each test walks the real First-Aid builder through a fixed input sequence and
 * snapshots BOTH the user-visible screen output at every step AND the final
 * persisted session row. Every optimisation in 01/02 must leave these snapshots
 * byte-identical — that is the definition of "safe / non-breaking" for the
 * engine. In particular:
 *   - the invalid-input sequence exercises the existing-session REPLAY path that
 *     File 01 Problem 20 (session-state fast path) rewrites;
 *   - the join sequence exercises response-triggered REST events;
 *   - all sequences run the on-start events, screen rendering, and session close.
 *
 * @group golden
 */
class GoldenMasterFlowTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;
    use GoldenMaster;

    /**
     * Run: one new-session dial (msg = dedicated code) then the given continuation
     * inputs. Returns an ordered transcript + a normalised final session row.
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
                break; // session already closed; stop dialling
            }
            $r = $this->dialUssd([
                'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
                'session_id' => $sessionId, 'request_type' => '2', 'msg' => $input,
            ]);
            $transcript[] = ['step' => 'in:'.$i, 'input' => $input] + $this->normaliseUssdResponse($r);
        }

        // NOTE: on-start REST-call COUNT is deliberately NOT snapshotted here — it
        // is an efficiency metric that File 01 Problem 20 intentionally changes
        // (continuations stop re-firing on-start events). That expectation lives
        // in the File 01 target tests, not in this behaviour-preservation guard.
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

    public function test_golden_initial_screen(): void
    {
        $app = FirstAidApp::create();
        $result = $this->runSequence($app, 'gm-initial', []);
        $this->assertMatchesGolden('flow_initial', $result);
    }

    public function test_golden_exit_path(): void
    {
        $app = FirstAidApp::create();
        $result = $this->runSequence($app, 'gm-exit', ['2']);
        $this->assertMatchesGolden('flow_exit', $result);
    }

    public function test_golden_join_path_fires_response_rest_event(): void
    {
        $app = FirstAidApp::create();
        $result = $this->runSequence($app, 'gm-join', ['1']);
        $this->assertMatchesGolden('flow_join', $result);
    }

    public function test_golden_invalid_input_replay_depth(): void
    {
        // Five continuation requests on one session — each re-shows the menu.
        // This is the replay depth that File 01 Problem 20 optimises; the output
        // must stay identical after the fast path lands.
        $app = FirstAidApp::create();
        $result = $this->runSequence($app, 'gm-replay', ['3', '3', '3', '3', '3']);
        $this->assertMatchesGolden('flow_invalid_replay', $result);
    }
}
