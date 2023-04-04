<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\RequestPayload\RequestPayloadService;

class UssdAccountsController extends BaseController
{
    public function index()
    {
        $payload = RequestPayloadService::getAccountsPayload();
        return request()->expectsJson() ? $payload : Inertia::render('Accounts/List/index', $payload);
    }

    public function show()
    {
        $payload = RequestPayloadService::getAccountPayload();
        return request()->expectsJson() ? $payload : Inertia::render('Accounts/Show/index', $payload);

    }

    public function create()
    {
    }

    public function update()
    {
    }

    public function delete()
    {
    }
}
