<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Services\RequestPayload\ReportPayloadService;

class ReportController extends BaseController
{
    public function index()
    {
        $payload = ReportPayloadService::getReportsPayload();
        return request()->expectsJson() ? $payload : Inertia::render('Reports/List/index', $payload);
    }

    public function show()
    {
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
