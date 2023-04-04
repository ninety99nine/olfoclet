<?php

namespace App\Http\Controllers;

use App\Models\App;
use Inertia\Inertia;
use App\Models\Project;
use App\Repositories\AppRepository;
use App\Repositories\SharedShortCodeRepository;

class AppController extends BaseController
{
    /**
     * @return Inertia\Response
     */
    public function show()
    {
        $this->app = $this->app->loadCount(['trashedVersions']);
        $versionsPayload = $this->app->versions()->select('id', 'number')->get();
        $this->appVersionsPayload = resolve(AppRepository::class)->setModel($this->app)->getAppVersions();
        $sharedShortCodesPayload = resolve(SharedShortCodeRepository::class)->getSharedShortCodes();

        return Inertia::render('Apps/Show/index', [
            'appPayload' => $this->app,
            'projectPayload' => $this->project,
            'versionsPayload' => $versionsPayload,
            'appVersionsPayload' => $this->appVersionsPayload,
            'sharedShortCodesPayload' => $sharedShortCodesPayload
        ]);
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create()
    {
        AppRepository::createApp($this->project);
        return redirect()->route('project.show.with.apps', ['project' => $this->project->id]);
    }

    public function update()
    {
        resolve(AppRepository::class)->setModel(request()->app)->updateApp();

        if( request()->input('destination') === 'project.show.with.apps' ) {

            //  Show the project
            return redirect()->route('project.show.with.apps', ['project' => $this->project->id]);

        }else{

            //  Show the app
            return redirect()->route('app.show.with.versions', ['project' => $this->project->id, 'app' => $this->app->id]);

        }
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete()
    {
        resolve(AppRepository::class)->setModel($this->app)->deleteApp();
        return redirect()->back();
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore()
    {
        resolve(AppRepository::class)->setModel($this->app)->restoreApp();
        return redirect()->route('project.show.with.apps', ['project' => $this->project->id]);
    }
}
