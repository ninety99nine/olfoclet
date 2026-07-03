<?php

namespace Tests\Support;

use App\Services\Ussd\UssdService;
use GuzzleHttp\Psr7\Response;

/**
 * A test seam over the real UssdService.
 *
 * The engine fires on-start REST API events ("Get User" / "Create User") using a
 * raw `new GuzzleHttp\Client()`, which Http::fake() cannot intercept. Rather than
 * change production code, we override the single public network method
 * `callGuzzleHttp()` to return deterministic canned responses while reproducing
 * the exact `$this->api_response` shape the real method builds, so everything
 * downstream behaves identically to a live call.
 *
 * This keeps golden-master runs fully deterministic (no network, no timeouts)
 * and independent of the CMS. It also survives File 01 Problem 5 (getHttpClient):
 * once that lands, this override still short-circuits the network.
 */
class TestableUssdService extends UssdService
{
    /**
     * Recorded outbound calls: [['method' => ..., 'url' => ..., 'options' => ...]].
     * Lets tests assert HOW MANY times on-start REST calls fired (key evidence
     * for the replay/session-state behaviour in File 01 Problem 20).
     *
     * @var array<int, array<string, mixed>>
     */
    public array $recordedHttpCalls = [];

    /**
     * Canned responses. Each entry: ['match' => callable(string $url,string $method):bool,
     * 'status' => int, 'body' => array]. First match wins; falls back to $defaultResponse.
     *
     * @var array<int, array<string, mixed>>
     */
    public array $cannedResponses = [];

    /**
     * Default "Get User" response. The shape mirrors what the First-Aid App's
     * on-start "Set App Properties" custom code reads: $user['metadata']
     * (profile/language) and $user['latestSubscription']. Baseline persona:
     * returning user, has profile, English, no active subscription.
     *
     * @var array{status:int, body:array}
     */
    public array $defaultResponse = [
        'status' => 200,
        'body' => [
            'subscriber' => [
                'id' => 'test-subscriber-1',
                'msisdn' => '26778705094',
                'first_name' => 'Test',
                'last_name' => 'User',
                'metadata' => [
                    'profile' => [
                        'first_name' => 'Test',
                        'last_name' => 'User',
                    ],
                    'language' => 'English',
                ],
                'latestSubscription' => null,
            ],
        ],
    ];

    public function callGuzzleHttp($method, $url, $request_options)
    {
        //  P20: replay a cached on-start response if present — this models the
        //  real callGuzzleHttp, which skips the network on continuation requests.
        //  Replayed calls are NOT recorded (they make no outbound request), which
        //  is exactly what the P20 target test asserts.
        $replay = $this->getOnStartHttpReplay($method, $url);

        if ($replay !== null) {

            $status = (int) $replay['status'];
            $body = (string) $replay['body'];

        } else {

            $this->recordedHttpCalls[] = [
                'method' => $method,
                'url' => $url,
                'options' => $request_options,
            ];

            [$status, $bodyArray] = $this->resolveCannedResponse((string) $url, (string) $method);
            $body = json_encode($bodyArray);
        }

        //  Capture so future continuations can replay
        $this->captureOnStartHttp($method, $url, $body, $status);

        $array_body = json_decode($body, true);
        $json_body = json_decode($body, false);

        $status_code = (int) $status;
        $ok = ($status_code == 200);
        $successful = ($status_code >= 200 && $status_code < 300);
        $redirect = ($status_code >= 300 && $status_code < 400);
        $clientError = ($status_code >= 400 && $status_code < 500);
        $serverError = $status_code >= 500;
        $failed = ($clientError || $serverError);

        // Mirror the production api_response contract exactly (UssdService:7085).
        $this->api_response = [
            'body' => $body,
            'array' => $array_body,
            'json' => $json_body,
            'status' => $status_code,
            'ok' => $ok,
            'successful' => $successful,
            'redirect' => $redirect,
            'clientError' => $clientError,
            'serverError' => $serverError,
            'failed' => $failed,
        ];

        return new Response($status_code, ['Content-Type' => 'application/json'], $body);
    }

    /** @return array{0:int,1:array} */
    private function resolveCannedResponse(string $url, string $method): array
    {
        foreach ($this->cannedResponses as $canned) {
            $match = $canned['match'] ?? null;
            if (is_callable($match) && $match($url, $method)) {
                return [$canned['status'] ?? 200, $canned['body'] ?? []];
            }
        }

        return [$this->defaultResponse['status'], $this->defaultResponse['body']];
    }
}
