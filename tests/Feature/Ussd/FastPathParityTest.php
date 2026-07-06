<?php

namespace Tests\Feature\Ussd;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\Support\PerfectOrderApp;
use Tests\Support\Personas;
use Tests\TestCase;

/**
 * Proves the session-state fast-path (config `ussd.fast_path`) produces BYTE-IDENTICAL
 * output to the full replay — across forward navigation AND go-backs. We walk the same
 * deterministic path twice (flag off, then on) and assert the transcripts match exactly.
 * If the fast-path ever restores a level differently than replaying it would, these fail.
 *
 * @group golden
 */
class FastPathParityTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;

    /** Total fast-path restores observed across the last walk (proves it actually fired). */
    private int $lastWalkRestores = 0;

    /** Walk a path (new session + continuations) and return the normalised transcript. */
    private function walk($app, ?callable $persona, string $code, array $path, string $sessionId, bool $fastPath): array
    {
        config(['ussd.fast_path' => $fastPath]);
        $this->lastWalkRestores = 0;

        $transcript = [];

        $r = $this->dialUssd([
            'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
            'session_id' => $sessionId, 'request_type' => '1', 'msg' => $code,
        ], $persona);
        $transcript[] = ['input' => $code] + $this->normaliseUssdResponse($r);
        $this->lastWalkRestores += $this->lastUssdService->fastPathRestoreCount;

        foreach ($path as $input) {
            if ((string) ($transcript[count($transcript) - 1]['request_type'] ?? '') === '3') {
                break;
            }
            $r = $this->dialUssd([
                'test_mode' => true, 'version_id' => $app->version->id, 'msisdn' => $app->msisdn,
                'session_id' => $sessionId, 'request_type' => '2', 'msg' => $input,
            ], $persona);
            $transcript[] = ['input' => $input] + $this->normaliseUssdResponse($r);
            $this->lastWalkRestores += $this->lastUssdService->fastPathRestoreCount;
        }

        return $transcript;
    }

    public function test_first_aid_forward_flow_fast_path_matches_replay(): void
    {
        $app = FirstAidApp::create();
        $persona = Personas::apply(Personas::subscribed());
        $path = ['2', '1'];  //  Home -> Services -> Get Educated (pure forward)

        $off = $this->walk($app, $persona, '*217#', $path, 'fwd-off', false);
        $offRestores = $this->lastWalkRestores;
        $on  = $this->walk($app, $persona, '*217#', $path, 'fwd-on', true);

        $this->assertSame(0, $offRestores, 'flag off must never resume from a box');
        $this->assertGreaterThan(0, $this->lastWalkRestores, 'flag on must actually resume from a box (not silently replay)');
        $this->assertSame($off, $on, 'First-Aid forward: fast-path must equal replay');
    }

    public function test_first_aid_deep_flow_with_gobacks_fast_path_matches_replay(): void
    {
        $app = FirstAidApp::create();
        $persona = Personas::apply(Personas::subscribed());
        //  Home -> profile -> back -> Services -> Get Educated -> back -> back -> language -> back
        $path = ['1', '0', '2', '1', '0', '0', '3', '0'];

        $off = $this->walk($app, $persona, '*217#', $path, 'deep-off', false);
        $offRestores = $this->lastWalkRestores;
        $on  = $this->walk($app, $persona, '*217#', $path, 'deep-on', true);

        $this->assertSame(0, $offRestores, 'flag off must never resume from a box');
        $this->assertGreaterThan(0, $this->lastWalkRestores, 'flag on must actually resume from a box (not silently replay)');
        $this->assertSame($off, $on, 'First-Aid deep+goback: fast-path must equal replay');
    }

    /** Canned CMS responses that let *250#'s data-driven on-start events complete. */
    private function perfectOrderCanned(): callable
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

    public function test_perfect_order_flow_fast_path_matches_replay(): void
    {
        $app = PerfectOrderApp::create();
        $canned = $this->perfectOrderCanned();
        //  Invalid inputs re-render Home — exercises resume + reply-handling on the
        //  data-driven *250# service (on-start fetches restored, focused level live).
        $path = ['99', '99'];

        $off = $this->walk($app, $canned, $app->dedicatedCode, $path, 'po-off', false);
        $offRestores = $this->lastWalkRestores;
        $on  = $this->walk($app, $canned, $app->dedicatedCode, $path, 'po-on', true);

        $this->assertSame(0, $offRestores, 'flag off must never resume from a box');
        $this->assertGreaterThan(0, $this->lastWalkRestores, 'flag on must actually resume from a box (not silently replay)');
        $this->assertSame($off, $on, 'Perfect Order: fast-path must equal replay');
    }
}
