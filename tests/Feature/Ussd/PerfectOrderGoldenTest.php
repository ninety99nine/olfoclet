<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\PerfectOrderApp;
use Tests\Support\GoldenMaster;
use Tests\TestCase;

/**
 * Behaviour-preservation guard for the SECOND live MNO service, Perfect Order
 * (*250#). Complements GoldenMasterFlowTest (*217#). Together the two golden
 * suites gate BOTH production services, so an engine optimisation (e.g. the
 * eval-bypass fast path) must leave both byte-identical.
 *
 * *250# is data-driven: its on-start events fetch a profile-summary + stores
 * list, so we feed deterministic canned responses (mirroring the CMS shape the
 * builder's custom code reads) via TestableUssdService. With those, the flow
 * renders the Home menu and the replay path deterministically.
 *
 * @group golden
 */
class PerfectOrderGoldenTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;
    use GoldenMaster;

    /** Canned CMS responses that let *250#'s on-start events complete. */
    private function cannedResponses(): callable
    {
        return function ($svc) {
            $svc->cannedResponses = [
                ['match' => fn ($url, $m) => str_contains($url, 'profile-summary'), 'status' => 200,
                    'body' => ['successful' => true,
                        'data' => ['first_name' => 'Test', 'last_name' => 'User', 'name' => 'Test User'],
                        'stats' => ['stores_following' => 0, 'stores_joined' => 0, 'stores_recently_visited' => 0, 'stores' => 0, 'orders' => 0, 'customers' => 0, 'products' => 0]]],
                ['match' => fn ($url, $m) => str_contains($url, 'stores'), 'status' => 200,
                    'body' => ['successful' => true, 'data' => [], 'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => 15, 'total' => 0], 'links' => ['next' => null]]],
            ];
        };
    }

    /**
     * One new-session dial (msg = dedicated code) then the given continuation
     * inputs. Returns an ordered transcript + a normalised final session row.
     *
     * @param  list<string>  $continuations
     * @return array<string,mixed>
     */
    private function runSequence(PerfectOrderApp $app, string $sessionId, array $continuations): array
    {
        $configure = $this->cannedResponses();
        $transcript = [];

        $r = $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => $sessionId, 'request_type' => '1', 'msg' => $app->dedicatedCode,
        ], $configure);
        $transcript[] = ['step' => 'start', 'input' => $app->dedicatedCode] + $this->normaliseUssdResponse($r);

        foreach ($continuations as $i => $input) {
            if ((string) ($transcript[count($transcript) - 1]['request_type']) === '3') {
                break; // session already closed; stop dialling
            }
            $r = $this->dialUssd([
                'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
                'session_id' => $sessionId, 'request_type' => '2', 'msg' => $input,
            ], $configure);
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

    public function test_golden_po_initial_home_menu(): void
    {
        $app = PerfectOrderApp::create();
        $result = $this->runSequence($app, 'po-initial', []);
        $this->assertMatchesGolden('po_flow_initial', $result);
    }

    public function test_golden_po_invalid_input_replay(): void
    {
        // Invalid inputs re-render the Home menu — exercises the existing-session
        // replay path (on-start events cached, not re-fired) for *250#.
        $app = PerfectOrderApp::create();
        $result = $this->runSequence($app, 'po-replay', ['99', '99']);
        $this->assertMatchesGolden('po_flow_invalid_replay', $result);
    }
}
