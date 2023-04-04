<?php

namespace App\Repositories;

use App\Models\Project;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class ProjectRepository extends BaseRepository
{
    /**
     *  Query the projects
     */
    public function queryProjects()
    {
        //  Set the search term
        $search = request()->input('search');

        //  Set the eloquent query
        $query = $this->model->withCount('apps')->withCount('trashedApps')->latest();

        //  Apply the search functionality
        return $this->canSearch ? $query->search($search) : $query;
    }

    /**
     *  Return the projects
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getProjects()
    {
        if( request()->routeIs('trashed.projects.show') ) {
            $query = $this->queryProjects()->onlyTrashed();
        }else{
            $query = $this->queryProjects();
        }

        //  Return paginated or unpaginated projects
        return $this->canPaginate ? $query->paginate(9)->withQueryString() : $query->get();
    }

    /**
     *  Return the project apps
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getProjectApps()
    {
        if( request()->routeIs('project.show.with.trashed.apps') ) {
            return resolve(AppRepository::class)->setModel( $this->model->apps()->onlyTrashed() )->getApps();
        }else{
            return resolve(AppRepository::class)->setModel( $this->model->apps() )->getApps();
        }
    }

    /**
     *  Create new project
     *
     *  @return void
     */
    public static function createProject()
    {
        $validator = Validator::make(request()->all(), [
            'name' => ['required', 'string', 'min:3', 'max:30', 'unique:projects,name']
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Create new project
        $project = Project::create($data);

        //  Add user to project
        $project->addTeamMember(auth()->user());
    }

    /**
     *  Update existing project
     *
     *  @return void
     */
    public function updateProject()
    {
        $validator = Validator::make(request()->all(), [
            'name' => ['required', 'string', 'min:3', 'max:30', Rule::unique('projects')->ignore($this->model->id)]
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Update the existing project
        $this->model->update($data);
    }

    /**
     *  Delete existing project
     *
     *  @return void
     */
    public function deleteProject()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('projects')->where(function ($query) {
                return $query->where('id', $this->model->id);
            })],
        ], [
            'confirmation_code.exists' => 'The confirmation code provided is not valid'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        //  If this app has not been soft deleted
        if( empty($this->model->deleted_at) ) {

            //  Soft delete the existing app
            $this->model->delete();

        }else{

            //  Force delete the existing app
            $this->model->forceDelete();

        }
    }

    /**
     *  Restore existing project
     *
     *  @return void
     */
    public function restoreProject()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('projects')->where(function ($query) {
                return $query->where('id', $this->model->id);
            })],
        ], [
            'confirmation_code.exists' => 'The confirmation code provided is not valid'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Restore the existing project
        $this->model->restore();
    }
}
