<?php

namespace Tests\Support;

use Illuminate\Http\Request;

/**
 * Drives the USSD engine end-to-end from a test the same way the gateway does:
 * a JSON request in, the decoded response envelope out.
 *
 * A single "dial" == one gateway hit. Chain dials that share a session_id to
 * simulate a subscriber walking through screens (request_type 1 then 2,2,2...).
 * The engine persists each step to ussd_sessions, so continuation dials replay /
 * resume real state — which is exactly what the File 01 Problem 20 fast-path
 * must preserve.
 */
trait DialsUssd
{
    /**
     * @param  array<string,mixed>  $params  test_mode, msisdn, session_id, msg, request_type, version_id
     * @param  callable|null  $configure  fn(TestableUssdService $svc) to set canned HTTP responses
     * @return array<string,mixed> decoded response envelope (session_id, request_type, msg, ...)
     */
    protected function dialUssd(array $params, ?callable $configure = null): array
    {
        $request = Request::create(
            '/api/launch/ussd',
            'POST',
            [],
            [],
            [],
            ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'],
            json_encode($params)
        );

        // Bind so both $this->request and the request() global resolve identically
        // (storeUssdGatewayValues() uses request()->isJson()).
        $this->app->instance('request', $request);

        $service = new TestableUssdService($request);

        if ($configure) {
            $configure($service);
        }

        $response = $service->setup();

        $content = method_exists($response, 'getContent') ? $response->getContent() : (string) $response;
        $decoded = json_decode($content, true);

        // Stash the service so a test can inspect recordedHttpCalls after a dial.
        $this->lastUssdService = $service;

        return is_array($decoded) ? $decoded : ['raw' => $content];
    }

    /** @var TestableUssdService|null */
    protected $lastUssdService = null;

    /**
     * Normalise a response envelope for golden-master snapshotting: keep the
     * user-visible + control fields, drop everything volatile (timings, logs,
     * random session id, timestamps) so the snapshot is byte-stable and only
     * changes when ACTUAL behaviour changes.
     *
     * @param  array<string,mixed>  $response
     * @return array<string,mixed>
     */
    protected function normaliseUssdResponse(array $response): array
    {
        return [
            'request_type' => $response['request_type'] ?? null,
            'msg' => $response['msg'] ?? null,
        ];
    }
}
