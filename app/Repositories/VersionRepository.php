<?php

namespace App\Repositories;

use App\Models\App;
use App\Models\Version;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class VersionRepository extends BaseRepository
{
    /**
     *  Query the versions
     */
    public function queryVersions()
    {
        //  Set the search term
        $search = request()->input('search');

        //  Set the eloquent query
        $query = $this->model->latest();

        //  Apply the search functionality
        return $this->canSearch ? $query->search($search) : $query;
    }

    /**
     *  Return the versions
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getVersions()
    {
        //  Return paginated or unpaginated versions
        return $this->canPaginate ? $this->queryVersions()->paginate(6)->withQueryString() : $this->queryVersions()->get();
    }

    /**
     *  Create new version
     *
     *  @return void
     */
    public static function createVersion(App $app)
    {
        $validator = Validator::make(request()->all(), [
            'number' => ['required', 'numeric', 'between:0,9999.99', Rule::unique('versions')->where('app_id', $app->id)],
            'features' => ['sometimes', 'array'],
            'features.*' => ['required'],
            'description' => ['nullable', 'string', 'min:3', 'max:500'],
            'clone_version_id' => in_array(request()->input('clone_version_id'), ['none', null]) ? [] : ['exists:versions,id'],
        ], [
            //  Custom messages
        ], [
            //  Custom attribute names
            'features.*' => 'feature',
            'clone_version_id' => 'version to clone'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  If we want to clone a version
        if( !in_array(request()->input('clone_version_id'), ['none', null]) ) {

            if( $version = Version::find( request()->input('clone_version_id') ) ) {

                $data['builder'] = $version->builder;

            }

        }

        //  Create new version
        $app = Version::create(array_merge($data, [
            'app_id' => $app->id,
        ]));
    }

    /**
     *  Update existing version
     *
     *  @return void
     */
    public function updateVersion()
    {
        //  Check if the builder must be reset
        $wantsToResetBuilder = request()->input('reset_builder') == true;

        //  Incase we want to reset the builder
        if( $wantsToResetBuilder ) {

            //  Reset request builder
            request()->merge(['builder' => $this->model->getBuilderTemplate()]);

        //  If the builder is provided
        }else if( request()->has('builder') ) {

            //  Incase the builder is provided in String format
            if( gettype(request()->input('builder') === 'string') ) {

                //  Convert the builder from String to Array format
                request()->merge(['builder' => json_decode(request()->input('builder'), true)]);

            }

        }

        $validator = Validator::make(request()->all(), [
            'number' => ['sometimes', 'required', 'numeric', 'between:0,9999.99', Rule::unique('versions')->where('app_id', $this->model->app_id)->ignore($this->model->id)],
            'description' => ['nullable', 'string', 'min:3', 'max:500'],

            //  Resetting builder
            'reset_builder' => ['sometimes', 'required', 'boolean'],
            'features' => ['sometimes', 'array'],
            'features.*' => ['required'],
            'builder' => ['sometimes', 'required', 'array'],
            'confirmation_code' => [
                'size:6', ($wantsToResetBuilder ? '' : 'nullable'), Rule::requiredIf($wantsToResetBuilder), Rule::exists('versions')->where(function ($query) {
                    return $query->where('id', $this->model->id);
                })
            ],
        ], [
            //  Custom messages
            'number.regex' => 'The version number must be a valid number or decimal',
            'confirmation_code.exists' => 'The reset code provided is not valid'
        ], [
            //  Custom attribute names
            'features.*' => 'feature',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Update the existing version
        $this->model->update($data);
    }

    /**
     *  Repair existing version
     *
     *  @return void
     */
    public function repairVersion()
    {
        //  If this is a REST Api request
        if ( request()->expectsJson() ) {

            //  If the builder is provided
            if( request()->has('builder') ) {

                //  Incase the builder is provided in String format
                if( gettype(request()->input('builder') === 'string') ) {

                    //  Convert the builder from String to Array format
                    request()->merge(['builder' => json_decode(request()->input('builder'), true)]);

                }

                //  Get the version builder
                $builder = request()->input('builder');

                //  Repair the version builder
                $repairedBuilder = $this->model->repairBuilder($builder);

            }else{

                //  Get the version builder
                $repairedBuilder = $this->model->getBuilderTemplate();

            }

            return $repairedBuilder;

        }
    }

    /**
     *  Delete existing version
     *
     *  @return void
     */
    public function deleteVersion()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('versions')->where(function ($query) {
                return $query->where('id', $this->model->id);
            })],
        ], [
            'confirmation_code.exists' => 'The confirmation code provided is not valid'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        //  If this version has not been soft deleted
        if( empty($this->model->deleted_at) ) {

            //  Soft delete the existing version
            $this->model->delete();

        }else{

            //  Force delete the existing version
            $this->model->forceDelete();

        }
    }

    /**
     *  Restore existing version
     *
     *  @return void
     */
    public function restoreVersion()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('versions')->where(function ($query) {
                return $query->where('id', $this->model->id);
            })],
        ], [
            'confirmation_code.exists' => 'The confirmation code provided is not valid'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        //  Restore the existing version
        $this->model->restore();
    }
}
