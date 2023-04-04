<?php

namespace App\Repositories;

use App\Models\App;
use App\Models\UssdAccount;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\Builder;

class UssdAccountRepository extends BaseRepository
{
    /**
     *  Query the ussd accounts
     */
    public function queryUssdAccounts()
    {
        //  Set the search term
        $search = request()->input('search');

        //  Set the Eloquent Query
        $query = $this->model->latest();

        /**
         *  Eager load the ussd account relationships (project, app, version).
         *  The eager loaded relations pulled with limited information. The
         *  relations are important for extracting the ids required to
         *  create links on the frontend. A link requires the Project
         *  ID, App ID, Version ID and Account ID e.g
         *
         *  link: /projects/1/apps/1/versions/1/accounts/1
         *
         *  The following is both eager loading and filter the records by
         *  Project ID, App ID or Version ID (within the relations).
         *  The filtering is continued after this logic.
         */
        $query = $query->with([
            'versions' => function ($query) {
                $query->select('versions.id', 'versions.number', 'versions.app_id')->with([
                    'app' => function ($query) {
                        $query->select('apps.id', 'apps.name', 'apps.project_id')->with([
                            'project' => function ($query) {
                                $query->select('projects.id', 'projects.name');
                            }
                        ]);
                    }
                ]);

                //  If the version is provided
                if( request()->version ) {

                    /**
                     *  Return accounts whose version
                     *  contains the specified id
                     */
                    $query->where('versions.id', request()->version->id);

                }else if( request()->app ) {

                    /**
                     *  Return accounts whose version contains
                     *  an app with the specified id
                     */
                    $query->where('versions.app_id', request()->app->id);

                }else if( request()->project ) {

                    $query->whereHas('app', function (Builder $query) {
                        /**
                         *  Return versions whose app contains
                         *  the specified project id
                         */
                        $query->where('apps.project_id', request()->project->id);
                    });

                }
            }
        ]);

        /**
         *  Note the logic above requires additional code
         *  to allow the filtering by Project ID, App ID
         *  or Version ID to work perfectly.
         */

        //  If the version is provided
        if( request()->version ) {

            $query = $query->whereHas('versions', function (Builder $query) {
                /**
                 *  Return accounts whose version
                 *  contains the specified id
                 */
                $query->where('versions.id', request()->version->id);
            });

        //  If the app is provided
        }else if( request()->app ) {

            $query = $query->whereHas('versions', function (Builder $query) {
                /**
                 *  Return accounts whose version contains
                 *  an app with the specified id
                 */
                $query->where('versions.app_id', request()->app->id);
            });

        //  If the project is provided
        }else if( request()->project ) {

            $query = $query->whereHas('versions.app', function (Builder $query) {
                /**
                 *  Return versions whose app contains
                 *  the specified project id
                 */
                $query->where('apps.project_id', request()->project->id);
            });

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

        }

        //  Apply the search functionality
        return $this->canSearch ? $query->search($search) : $query;
    }
    /**
     *  Query the ussd accounts
     */
    public function queryUssdAccountsWithoutFilters()
    {
        return $this->disableFilter()->queryUssdAccounts();
    }

    /**
     *  Return the ussd accounts
     *
     *  @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getUssdAccounts()
    {
        //  Return paginated or unpaginated ussd accounts
        return $this->canPaginate ? $this->queryUssdAccounts()->paginate()->withQueryString() : $this->queryUssdAccounts()->get();
    }

    /**
     *  Create new ussd account
     *
     *  @return void
     */
    public static function createUssdAccount(App $app)
    {
        $validator = Validator::make(request()->all(), [
            'number' => ['required', 'numeric', 'between:0,9999.99', Rule::unique('ussd accounts')->where('app_id', $app->id)],
            'features' => ['sometimes', 'array'],
            'features.*' => ['required'],
            'description' => ['nullable', 'string', 'min:3', 'max:500'],
        ], [
            //  Custom messages
        ], [
            //  Custom attribute names
            'features.*' => 'feature',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Create new ussd account
        $app = UssdAccount::create(array_merge($data, [
            'app_id' => $app->id,
        ]));
    }

    /**
     *  Update existing ussd account
     *
     *  @return void
     */
    public function updateUssdAccount()
    {
        //  Check if the builder must be reset
        $wantsToResetBuilder = request()->input('reset_builder') == true;

        //  If the builder is provided
        if( request()->has('builder') ) {

            //  Incase we want to reset the builder
            if( $wantsToResetBuilder ) {

                //  Reset request builder
                request()->merge(['builder' => $this->model->getBuilderTemplate()]);

            //  Incase the builder is provided in String format
            }else if( gettype(request()->input('builder') === 'string') ) {

                //  Convert the builder from String to Array format
                request()->merge(['builder' => json_decode(request()->input('builder'), true)]);

            }

        }

        $validator = Validator::make(request()->all(), [
            'number' => ['sometimes', 'required', 'numeric', 'between:0,9999.99', Rule::unique('ussd accounts')->where('app_id', $this->model->app_id)->ignore($this->model->id)],
            'description' => ['nullable', 'string', 'min:3', 'max:500'],

            //  Resetting builder
            'reset_builder' => ['sometimes', 'required', 'boolean'],
            'features' => ['sometimes', 'array'],
            'features.*' => ['required'],
            'builder' => ['sometimes', 'required', 'array'],
            'confirmation_code' => [
                'string', 'size:6', ($wantsToResetBuilder ? '' : 'nullable'), Rule::requiredIf($wantsToResetBuilder), Rule::exists('ussd accounts')->where(function ($query) {
                    return $query->where('id', $this->model->id);
                })
            ],
        ], [
            //  Custom messages
            'number.regex' => 'The ussd account number must be a valid number or decimal',
            'confirmation_code.exists' => 'The reset code provided is not valid'
        ], [
            //  Custom attribute names
            'features.*' => 'feature',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        //  Update the existing ussd account
        $this->model->update($data);
    }

    /**
     *  Repair existing ussd account
     *
     *  @return void
     */
    public function repairUssdAccount()
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

                //  Get the ussd account builder
                $builder = request()->input('builder');

                //  Repair the ussd account builder
                $repairedBuilder = $this->model->repairBuilder($builder);

            }else{

                //  Get the ussd account builder
                $repairedBuilder = $this->model->getBuilderTemplate();

            }

            return $repairedBuilder;

        }
    }

    /**
     *  Delete existing ussd account
     *
     *  @return void
     */
    public function deleteUssdAccount()
    {
        $validator = Validator::make(request()->all(), [
            'confirmation_code' => ['required', 'string', 'size:6', Rule::exists('ussd accounts')->where(function ($query) {
                return $query->where('id', $this->model->id);
            })],
        ], [
            'confirmation_code.exists' => 'The confirmation code provided is not valid'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        //  Delete the existing ussd account
        $this->model->delete();
    }
}
