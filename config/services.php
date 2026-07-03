<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Orange Botswana internal integrations
    |--------------------------------------------------------------------------
    |
    | Internal Orange hosts the USSD engine calls. Externalised from hardcoded
    | values so staging/Docker can point them at the mock server without a code
    | change. The defaults are the real production values, so behaviour is
    | unchanged when the env vars are absent.
    |
    */

    'orange' => [
        'stk_push_url' => env('ORANGE_STK_PUSH_URL', 'http://192.168.22.87/STK/test/stkpush.php'),
    ],

];
