<?php

namespace App\Repositories;

use App\Models\GlobalVariable;
use Illuminate\Support\Facades\Validator;

class GlobalVariableRepository extends BaseRepository
{
    protected $modelClass = GlobalVariable::class;

    /**
     *  Query the global variables
     */
    public function queryGlobalVariables()
    {
        //  Set the search term
        $search = request()->input('search');

        //  Set the Eloquent Query
        $query = $this->model->latest();

        //  Eager load the account information
        $query = $query->with(['account']);

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

        //  Query by the specified ussd account id.
        if( request()->ussd_account ) {
            $query = $query->where('ussd_account_id', request()->ussd_account->id);
        }

        //  Apply the search functionality
        return $this->canSearch ? $query->search($search) : $query;
    }

    /**
     *  Query the global variables
     */
    public function queryGlobalVariablesWithoutFilters()
    {
        return $this->disableFilter()->queryGlobalVariables();
    }

    /**
     *  Return the global variables
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getGlobalVariables()
    {
        //  Return paginated or unpaginated global variables
        return $this->canPaginate ? $this->queryGlobalVariables()->paginate()->withQueryString() : $this->queryGlobalVariables()->get();
    }

    /**
     *  Update existing global variable
     *
     *  @return void
     */
    public function updateGlobalVariable()
    {
        $validator = Validator::make(request()->all(), [
            'metadata' => ['required', 'array']
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Update the existing global variable
        $this->model->update($data);
    }
}
