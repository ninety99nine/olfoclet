<?php

namespace App\Http\Controllers;

use App\Models\App;
use App\Models\Version;
use App\Models\Project;
use App\Models\UssdAccount;
use App\Models\UssdSession;
use App\Models\GlobalVariable;

class BaseController extends Controller
{
    public $app;
    public $version;
    public $project;
    public $ussd_account;
    public $ussd_session;
    public $global_variable;


    public function __construct()
    {
        //  Set the Project Model (If exists on the route)
        if( !empty(request()->project) && !(request()->project instanceof Project) ) {

            /**
             *  Enable searching the trashed projects as well using the withTrashed() methods
             */
            request()->project = $this->project = Project::withTrashed()->findOrFail(request()->project);
        }

        //  Set the App Model (If exists on the route)
        if( !empty(request()->app) && !(request()->app instanceof App) ) {

            /**
             *  Enable searching the trashed apps as well using the withTrashed() methods
             */
            request()->app = $this->app = App::withTrashed()->findOrFail(request()->app);
        }

        //  Set the Version Model (If exists on the route)
        if( !empty(request()->version) && !(request()->version instanceof Version) ) {

            /**
             *  Enable searching the trashed versions as well using the withTrashed() methods
             */
            request()->version = $this->version = Version::withTrashed()->findOrFail(request()->version);
        }

        //  Set the Account Model (If exists on the route)
        if( !empty(request()->ussd_account) && !(request()->ussd_account instanceof UssdAccount) ) {
            request()->ussd_account = $this->ussd_account = UssdAccount::findOrFail(request()->ussd_account);
        }

        //  Set the Session Model (If exists on the route)
        if( !empty(request()->ussd_session) && !(request()->ussd_session instanceof UssdSession) ) {
            request()->ussd_session = $this->ussd_session = UssdSession::findOrFail(request()->ussd_session);
        }

        //  Set the Global Variable Model (If exists on the route)
        if( !empty(request()->global_variable) && !(request()->global_variable instanceof GlobalVariable) ) {
            request()->global_variable = $this->global_variable = GlobalVariable::findOrFail(request()->global_variable);
        }

    }

}
