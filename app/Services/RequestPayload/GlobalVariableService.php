<?php

namespace app\Services\Session;

use App\Models\UssdAccount;
use App\Models\GlobalVariable;

class GlobalVariableService
{
    public function getGlobalVariables()
    {
        //  Get the search term
        $search = request()->input('search');

        //  If the account exists on the request
        if( request()->account ) {

            //  If the request account is a string
            if( is_string(request()->account) ) {

                //  Query the account
                request()->account = UssdAccount::findOrFail(request()->account);

            }

            //  Get the specified account database entries
            $globalVariables = request()->account->globalVariables();

        }elseif( request()->version ) {

            //  Get the specified version database entries
            $globalVariables = request()->version->globalVariables();

        }else{

            //  Get the app database entries
            $globalVariables = request()->app->globalVariables();

        }

        /**
         *  We need to clone the $globalVariables because when the "Where Clause" is applied
         *  it is then chained as part of the Eloquent "Where Clauses". This then applies
         *  the previous where clause for other code logic which is not a desired outcome.
         *  To solve this, we clone the "$globalVariables" variable and apply the
         *  necessary where clause on that particular instance knowing that it
         *  would not be used again.
         */
        $totalGlobalVariables = (clone $globalVariables)->count();

        $globalVariablesPayload = $globalVariables->search($search)->latest()->paginate()->withQueryString();

        //  Return the sessions
        return [
            'globalVariablesPayload' => $globalVariablesPayload,
            'statistics' => [
                'totalGlobalVariables' => number_format($totalGlobalVariables, 0, '', ',')
            ]
        ];
    }
}
