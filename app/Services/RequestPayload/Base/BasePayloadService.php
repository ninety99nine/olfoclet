<?php

namespace App\Services\RequestPayload\Base;

class BasePayloadService
{
    public static function mergeAdditionalPayloads($payload)
    {
        //  If the project exists on the request, add it as part of the payload
        if( !empty(request()->project) ) {

            $payload['projectPayload'] = request()->project;

            //  If the app exists on the request, add it as part of the payload
            if( !empty(request()->app) ) {

                $payload['appPayload'] = request()->app;

                //  If the version exists on the request, add it as part of the payload
                if( !empty(request()->version) ) {

                    $payload['versionPayload'] = request()->version->makeHidden('builder');

                }else{

                    //  Version options
                    $payload['versionOptions'] = request()->app->versions()->select('id', 'number')->get();

                }

            }else{

                //  App and version options
                $payload['appOptions'] =
                    request()->project->apps()->select('id', 'name')->with([
                        'versions' => function ($query) {
                            $query->select('versions.id', 'versions.number', 'versions.app_id');
                        }])->get();

            }

        }else{

            //  Project, app and version options
            $payload['projectOptions'] =
                self::getAuthUser()->projectsAsTeamMember()->select('projects.id', 'name')->with([
                    'apps' => function ($query) {
                        $query->select('apps.id', 'apps.name', 'apps.project_id')
                            ->with([
                                'versions' => function ($query) {
                                    $query->select('versions.id', 'versions.number', 'versions.app_id');
                            }]);
                    }])->get();
        }

        return $payload;
    }

    /**
     *  @return User $user
     */
    public static function getAuthUser()
    {
        return auth()->user();
    }

}
