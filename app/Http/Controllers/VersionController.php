<?php

namespace App\Http\Controllers;

use App\Models\App;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Version;
use App\Repositories\VersionRepository;

class VersionController extends BaseController
{
    /**
     * @return Inertia\Response
     */
    public function show()
    {
        //  If this is a REST Api request
        if (request()->expectsJson()) {

            //  Get the version builder
            $builder = $this->version->builder;

            /**
             *  Calculate the content-length which is required
             *  by the Axios REST Api call to calculate the
             *  download progress of the content.
             */
            $contentLength = strlen(json_encode($builder));      //  3219152

            //  Return the version together with the Content-Length header
            return response()->json($builder)->header('Content-Length', $contentLength);

        }else{

            return Inertia::render('Versions/Show/index', [
                'appPayload' => $this->app,
                'projectPayload' => $this->project,
                'versionPayload' => $this->version->makeHidden('builder')
            ]);

        }
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function create()
    {
        VersionRepository::createVersion($this->app);
        return redirect()->route('app.show.with.versions', [ 'project' => $this->project->id, 'app' => $this->app->id ]);
    }

    public function update()
    {
        resolve(VersionRepository::class)->setModel($this->version)->updateVersion();

        if( request()->input('destination') === 'app.show.with.versions' ) {

            //  Show the app
            return redirect()->route('app.show.with.versions', [ 'project' => $this->project->id, 'app' => $this->app->id ]);

        }elseif( request()->input('destination') === 'version.show' ) {

            //  Show the version
            return redirect()->route('version.show', [ 'project' => $this->project->id, 'app' => $this->app->id, 'version' => $this->version->id ]);

        }
    }

    public function delete()
    {
        resolve(VersionRepository::class)->setModel($this->version)->deleteVersion();
        return redirect()->back();
    }

    public function repair()
    {
        $repairedBuilder = resolve(VersionRepository::class)->setModel($this->version)->repairVersion();

        if( !empty($repairedBuilder) ) {

            /**
             *  Calculate the content-length which is required
             *  by the Axios REST Api call to calculate the
             *  download progress of the content.
             */
            $contentLength = strlen(json_encode($repairedBuilder));      //  3219152

            //  Return the version
            return response()->json($repairedBuilder)->header('Content-Length', $contentLength);

        }
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore()
    {
        resolve(VersionRepository::class)->setModel($this->version)->restoreVersion();
        return redirect()->route('app.show.with.versions', ['project' => $this->project->id, 'app' => $this->app->id]);
    }


}
