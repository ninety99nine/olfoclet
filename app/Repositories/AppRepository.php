<?php

namespace App\Repositories;

use App\Models\App;
use App\Models\Project;
use App\Models\Version;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class AppRepository extends BaseRepository
{
    /**
     *  Query the apps
     */
    public function queryApps()
    {
        //  Set the relationships
        $relationships = [
            'shortCode',
            'versions' => function($query) { $query->select('id', 'app_id', 'number'); },
            'activeVersion' => function($query) { $query->select('id', 'app_id', 'number', 'features'); }
        ];

        //  Set the search term
        $search = request()->input('search');

        //  Set the eloquent query
        $query = $this->model->withCount('versions')->with($relationships)->latest();

        //  Apply the search functionality
        return $this->canSearch ? $query->search($search) : $query;
    }

    /**
     *  Return the apps
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getApps()
    {
        //  Return paginated or unpaginated projects
        return $this->canPaginate ? $this->queryApps()->paginate(6)->withQueryString() : $this->queryApps()->get();
    }

    /**
     *  Return the app versions
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAppVersions()
    {
        if( request()->routeIs('app.show.with.trashed.versions') ) {
            return resolve(VersionRepository::class)->setModel( $this->model->versionsWithoutBuilder()->onlyTrashed() )->getVersions();
        }else{
            return resolve(VersionRepository::class)->setModel( $this->model->versionsWithoutBuilder() )->getVersions();
        }
    }

    /**
     *  Create new app
     *
     *  @return void
     */
    public static function createApp(Project $project)
    {
        $validator = Validator::make(request()->all(), [
            'online' => ['required', 'boolean'],
            'description' => ['nullable', 'string', 'min:3', 'max:500'],
            'offline_message' => ['nullable', 'string', 'min:3', 'max:120'],
            'shared_short_code_id' => [Rule::exists('shared_short_codes', 'id')],
            'dedicated_code' => ['nullable', 'regex:/^\*[0-9]+(\*[0-9]+)*#$/',
                request()->input('overide_dedicated_code') == true ? '' : Rule::unique('short_codes')
            ],
            'name' => ['required', 'string', 'min:3', 'max:30', Rule::unique('apps')->where('project_id', $project->id)],
        ], [
            'dedicated_code.unique' => 'The :attribute is already used by another app. Do you want to reassign the shortcode?'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Create new app (Set the verison as the active version)
        $app = App::create(array_merge($data, [
            'project_id' => $project->id,
        ]));

        //  Create new version
        $version = $app->versions()->create([
            'builder' => resolve(Version::class)->getBuilderTemplate(),
            'description' => $data['description'],
            'features' => []
        ]);

        //  Assign the active version
        $app->assignActiveVersion($version->id);

        //  Assign the dedicated code
        $app->assignDedicatedCode( request()->input('dedicated_code') );

        //  Assign the shared code
        $app->assignSharedCode( request()->input('shared_short_code_id') );
    }

    /**
     *  Update existing app
     *
     *  @return void
     */
    public function updateApp()
    {
        $validator = Validator::make(request()->all(), [
            'online' => ['required', 'boolean'],
            'active_version_id' => ['required', 'integer'],
            'description' => ['nullable', 'string', 'min:3', 'max:500'],
            'shared_short_code_id' => [Rule::exists('shared_short_codes', 'id')],
            'name' => ['required', 'string', 'min:3', 'max:30', Rule::unique('apps')->where('project_id', $this->model->project_id)->ignore($this->model->id)],
            'offline_message' => ['string', 'min:3', 'max:120', Rule::requiredIf( request()->input('online') == false )],
            'dedicated_code' => ['nullable', 'regex:/^\*[0-9]+(\*[0-9]+)*#$/',
                request()->input('overide_dedicated_code') == true ? '' : Rule::unique('short_codes')->ignore($this->model->id, 'app_id')
            ]
        ], [
            'dedicated_code.unique' => 'The :attribute is already used by another app. Do you want to reassign the shortcode?'
        ], [
            'active_version_id' => 'active version'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Update the existing app
        $this->model->update($data);

        //  Assign the dedicated code
        $this->model->assignDedicatedCode( request()->input('dedicated_code') );

        //  Assign the shared code
        $this->model->assignSharedCode( request()->input('shared_short_code_id') );

        //  Assign the active version
        $this->model->assignActiveVersion( request()->input('active_version_id') );
    }

    /**
     *  Delete existing app
     *
     *  @return void
     */
    public function deleteApp()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('apps')->where(function ($query) {
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
     *  Restore existing app
     *
     *  @return void
     */
    public function restoreApp()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('apps')->where(function ($query) {
                return $query->where('id', $this->model->id);
            })],
        ], [
            'confirmation_code.exists' => 'The confirmation code provided is not valid'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        //  Restore the existing app
        $this->model->restore();
    }
}
