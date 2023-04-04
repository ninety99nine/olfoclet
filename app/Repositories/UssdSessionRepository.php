<?php

namespace App\Repositories;

use App\Models\App;
use App\Models\Project;
use App\Models\UssdSession;
use App\Models\Version;

class UssdSessionRepository extends BaseRepository
{
    protected $modelClass = UssdSession::class;

    /**
     *  Query the sessions
     */
    public function queryUssdSessions()
    {
        //  Set the search term
        $search = request()->input('search');

        //  Set the Eloquent Query
        $query = $this->model->latest();

        //  If the project and app are provided but not the version
        if( request()->project && request()->app && !request()->version ) {

            //  Eager load the version information
            $query = $query->with([
                'version' => function ($query) {
                   $query->select('versions.id', 'versions.number');
                }
            ]);

        //  If the project is provided but not the app and version
        }else if( request()->project && !request()->app && !request()->version ) {

            //  Eager load the version and app information
            $query = $query->with([
                'version' => function ($query) {
                    $query->select('versions.id', 'versions.number', 'versions.app_id');
                },
                'app' => function ($query) {
                    $query->select('apps.id', 'apps.name');
                }
            ]);

        //  If non are provided
        }else if( !request()->project && !request()->app && !request()->version ) {

            //  Eager load the version, app and project information
            $query = $query->with([
                'version' => function ($query) {
                    $query->select('versions.id', 'versions.number', 'versions.app_id');
                },
                'project' => function ($query) {
                    $query->select('projects.id', 'projects.name');
                },
                'app' => function ($query) {
                    $query->select('apps.id', 'apps.name');
                }
            ]);

        }

        //  Query by the specified project id.
        if( request()->project ) {
            $query = $query->where('project_id', request()->project->id);
        }

        //  Query by the specified app id.
        if( request()->app ) {
            $query = $query->where('app_id', request()->app->id);
        }

        //  Query by the specified version id.
        if( request()->version ) {
            $query = $query->where('version_id', request()->version->id);
        }

        //  Apply the filter functionality
        if( $this->canFilter ) {

            //  Filter by origin
            if( $origin = request()->input('origin') ) {
                if($origin === 'mobile') {
                    $query = $query->realAccounts();
                }elseif($origin === 'simulator') {
                    $query = $query->testAccounts();
                }
            }

            //  Filter by status
            if( $status = request()->input('status') ) {
                if($status === 'success') {
                    $query = $query->successful();
                }elseif($status === 'fail') {
                    $query = $query->failed();
                }
            }

            //  Filter by request type
            if( $requestType = request()->input('requestType') ) {
                if($requestType !== 'any') {
                    $query = $query->where('request_type', $requestType);
                }
            }

        }

        //  Apply the search functionality
        return $this->canSearch ? $query->search($search) : $query;
    }

    /**
     *  Query the sessions
     */
    public function queryUssdSessionsWithoutFilters()
    {
        return $this->disableFilter()->queryUssdSessions();
    }

    /**
     *  Return the sessions
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getUssdSessions()
    {
        //  Return paginated or unpaginated sessions
        return $this->canPaginate ? $this->queryUssdSessions()->paginate()->withQueryString() : $this->queryUssdSessions()->get();
    }
}
