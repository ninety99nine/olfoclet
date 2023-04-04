<?php

namespace App\Http\Controllers;

use App\Models\App;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Version;
use App\Models\GlobalVariable;
use App\Repositories\GlobalVariableRepository;
use Illuminate\Support\Facades\Validator;
use App\Services\RequestPayload\RequestPayloadService;

class GlobalVariableController extends BaseController
{
    public function index()
    {
        $payload = RequestPayloadService::getGlobalVariablesPayload();
        return request()->expectsJson() ? $payload : Inertia::render('GlobalVariables/List/index', $payload);
    }

    public function show()
    {
        $payload = RequestPayloadService::getGlobalVariablePayload();
        return request()->expectsJson() ? $payload : Inertia::render('GlobalVariables/Show/index', $payload);
    }

    public function create()
    {
    }

    public function update()
    {
        resolve(GlobalVariableRepository::class)->setModel(request()->global_variable)->updateGlobalVariable();
        return redirect()->back();
    }

    public function delete()
    {
    }
}
