<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\Support\GoldenMaster;
use Tests\Support\Personas;
use Tests\TestCase;

/**
 * Deep-navigation behaviour-preservation guard, using the "subscribed" persona
 * to unlock the multi-level First-Aid menu (Home → Services → Get Educated →
 * back → Home → My profile → View Profile). Unlike the shallow flows, this walks
 * SEVERAL distinct screens across continuation requests — exactly the replay
 * depth that File 01 Problem 20 (session-state fast path) rewrites. This golden
 * must stay byte-identical through P18/P19/P20.
 *
 * @group golden
 */
class DeepFlowGoldenTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;
    use GoldenMaster;

    /** A deep, deterministic, menu-only navigation path with go-backs.
     *  Home →My profile →back →Services →Get Educated →back →back →Change language →back.
     *  (Stays on menu screens — content screens like View Profile / Daily Quotes
     *  fetch data our stub doesn't model, so they're intentionally not entered.)
     */
    private array $deepPath = ['1', '0', '2', '1', '0', '0', '3', '0'];

    public function test_golden_deep_subscribed_navigation(): void
    {
        $app = FirstAidApp::create();
        $persona = Personas::apply(Personas::subscribed());
        $sessionId = 'deep-nav';

        $transcript = [];
        $r = $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => $sessionId, 'request_type' => '1', 'msg' => $app->dedicatedCode,
        ], $persona);
        $transcript[] = ['step' => 'start', 'input' => $app->dedicatedCode] + $this->normaliseUssdResponse($r);

        foreach ($this->deepPath as $i => $input) {
            if ((string) $transcript[count($transcript) - 1]['request_type'] === '3') {
                break;
            }
            $r = $this->dialUssd([
                'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
                'session_id' => $sessionId, 'request_type' => '2', 'msg' => $input,
            ], $persona);
            $transcript[] = ['step' => 'in:'.$i, 'input' => $input] + $this->normaliseUssdResponse($r);
        }

        $session = UssdSession::where('session_id', $sessionId)->first();

        $this->assertMatchesGolden('flow_deep_subscribed', [
            'transcript' => $transcript,
            'session' => [
                'request_type' => $session?->request_type,
                'fatal_error' => (bool) $session?->fatal_error,
                'reply_records' => $session?->reply_records,
            ],
        ]);
    }
}
