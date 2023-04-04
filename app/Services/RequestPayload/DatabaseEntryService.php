<?php

namespace app\Services\Session;

use App\Models\UssdAccount;
use App\Models\DatabaseEntry;

class DatabaseEntryService
{
    public function getDatabaseEntries()
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
            $databaseEntries = request()->account->databaseEntries();

        }elseif( request()->version ) {

            //  Get the specified version database entries
            $databaseEntries = request()->version->databaseEntries();

        }else{

            //  Get the app database entries
            $databaseEntries = request()->app->databaseEntries();

        }

        /**
         *  We need to clone the $databaseEntries because when the "Where Clause" is applied
         *  it is then chained as part of the Eloquent "Where Clauses". This then applies
         *  the previous where clause for other code logic which is not a desired outcome.
         *  To solve this, we clone the "$databaseEntries" variable and apply the
         *  necessary where clause on that particular instance knowing that it
         *  would not be used again.
         */
        $totalDatabaseEntries = (clone $databaseEntries)->count();

        $databaseEntriesPayload = $databaseEntries->search($search)->latest()->paginate()->withQueryString();

        //  Return the sessions
        return [
            'databaseEntriesPayload' => $databaseEntriesPayload,
            'statistics' => [
                'totalDatabaseEntries' => number_format($totalDatabaseEntries, 0, '', ',')
            ]
        ];
    }
}
