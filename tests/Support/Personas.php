<?php

namespace Tests\Support;

/**
 * Canned "Get User" subscriber responses for the First-Aid on-start REST stub.
 *
 * The First-Aid "Set App Properties" custom code branches the whole flow on the
 * subscriber's profile + subscription state, so the persona chosen determines
 * how deep the reachable menu is:
 *   - unsubscribed  → shallow Welcome → Join / Exit
 *   - subscribed    → deep Home menu (My profile / Services / Change language /
 *                     Settings) with multi-level sub-menus + go-back — the depth
 *                     needed to exercise the P20 session-state fast path.
 */
class Personas
{
    /** Returning, profiled, NO active subscription → shallow Join/Exit flow. */
    public static function unsubscribed(): array
    {
        return [
            'status' => 200,
            'body' => [
                'subscriber' => [
                    'id' => 'test-subscriber-1',
                    'msisdn' => '26778705094',
                    'metadata' => [
                        'profile' => ['first_name' => 'Test', 'last_name' => 'User'],
                        'language' => 'English',
                    ],
                    'latestSubscription' => null,
                ],
            ],
        ];
    }

    /** Profiled AND actively subscribed → deep Home menu with sub-menus. */
    public static function subscribed(): array
    {
        return [
            'status' => 200,
            'body' => [
                'subscriber' => [
                    'id' => 'subbed-1',
                    'msisdn' => '26778705094',
                    'metadata' => [
                        'profile' => ['first_name' => 'Test', 'last_name' => 'User', 'sex' => 'Male'],
                        'language' => 'English',
                    ],
                    'latestSubscription' => ['isActive' => true, 'id' => 'sub-1'],
                ],
            ],
        ];
    }

    /** A configure callback that applies a persona to a TestableUssdService. */
    public static function apply(array $persona): callable
    {
        return function (TestableUssdService $svc) use ($persona) {
            $svc->defaultResponse = $persona;
        };
    }
}
