<?php

namespace Tests\Feature\Ussd;

use App\Models\UssdSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\DialsUssd;
use Tests\Support\FirstAidApp;
use Tests\TestCase;

/**
 * Proves the engine driver runs the real First-Aid builder end-to-end,
 * deterministically, with the on-start REST calls stubbed. If this breaks, the
 * golden-master tests below it are meaningless — so it guards the harness itself.
 *
 * @group harness
 */
class EngineSmokeTest extends TestCase
{
    use RefreshDatabase;
    use DialsUssd;

    public function test_new_session_dial_renders_the_first_screen_without_fatal_error(): void
    {
        $app = FirstAidApp::create();

        $response = $this->dialUssd([
            'test_mode' => true,
            'version_id' => $app->version->id,
            'msisdn' => $app->msisdn,
            'session_id' => 'smoke-session-1',
            'request_type' => '1',
            'msg' => $app->dedicatedCode,
        ]);

        // Continue (2), not close (3) — a healthy first screen keeps the session open.
        $this->assertSame('2', (string) $response['request_type'], 'Engine returned a closed/error session.');
        $this->assertNotEmpty($response['msg']);
        $this->assertStringNotContainsString('technical difficulties', $response['msg']);

        // The on-start "Get User" REST call fired exactly once and hit no network.
        $this->assertCount(1, $this->lastUssdService->recordedHttpCalls);

        // The session was persisted cleanly.
        $session = UssdSession::where('session_id', 'smoke-session-1')->first();
        $this->assertNotNull($session);
        $this->assertFalse((bool) $session->fatal_error, 'Session recorded a fatal error: '.$session->fatal_error_msg);
    }
}
