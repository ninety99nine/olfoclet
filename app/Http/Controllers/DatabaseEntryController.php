<?php

namespace App\Http\Controllers;

use App\Models\App;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Version;
use App\Models\DatabaseEntry;
use Illuminate\Support\Facades\Validator;
use App\Services\Session\DatabaseEntryService;

class DatabaseEntryController extends BaseController
{
    public function index(Project $project, App $app, Version $version)
    {
        //  Version options
        $versionOptions = $app->versions()->select('id', 'number')->get();

        //  Get the database entry service response
        $databaseEntryServiceResponse = (new DatabaseEntryService())->getDatabaseEntries();

        //  Prepare Response
        $props = array_merge([
            'appPayload' => $app,
            'projectPayload' => $project,
            'versionOptions' => $versionOptions,
            'versionPayload' => $version->makeHidden('builder'),
        ], $databaseEntryServiceResponse);

        //  Return Response
        return request()->expectsJson() ? $props : Inertia::render('DatabaseEntries/List/index', $props);
    }

    public function show(Project $project, App $app, Version $version, DatabaseEntry $databaseEntry)
    {
        //  Prepare Response
        $props = [
            'appPayload' => $app,
            'projectPayload' => $project,
            'databaseEntryPayload' => $databaseEntry,
            'versionPayload' => $version->makeHidden('builder')
        ];

        //  Return Response
        return request()->expectsJson() ? $props : Inertia::render('DatabaseEntries/Show/index', $props);
    }

    public function create()
    {
    }

    public function update(Project $project, App $app, Version $version, DatabaseEntry $databaseEntry)
    {
        //  Validate the request inputs
        $validator = Validator::make(request()->all(), [
            'metadata' => ['required', 'array']
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Update the existing project
        $databaseEntry->update([
            'metadata' => $data['metadata']
        ]);

        return redirect()->back();
    }

    public function delete()
    {
    }
}
