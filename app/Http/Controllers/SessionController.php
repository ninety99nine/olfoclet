<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\RequestPayload\RequestPayloadService;

class SessionController extends BaseController
{
    public function index()
    {
        $payload = RequestPayloadService::getSessionsPayload();
        return request()->expectsJson() ? $payload : Inertia::render('Sessions/List/index', $payload);
    }

    public function show()
    {
        $payload = RequestPayloadService::getSessionPayload();
        return request()->expectsJson() ? $payload : Inertia::render('Sessions/Show/index', $payload);
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
