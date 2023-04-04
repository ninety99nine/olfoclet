<?php

namespace app\Services\Session;

use App\Models\UssdAccount;
use App\Models\SessionNotification;

class SessionNotificationService
{
    public function getNotifications()
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

            //  Get the specified account notifications
            $notifications = request()->account->sessionNotifications();

        }elseif( request()->version ) {

            //  Get the specified version notifications
            $notifications = request()->version->sessionNotifications();

        }else{

            //  Get the app notifications
            $notifications = request()->app->sessionNotifications();

        }

        /**
         *  We need to clone the $notifications because when the "Where Clause" is applied
         *  it is then chained as part of the Eloquent "Where Clauses". This then applies
         *  the previous where clause for other code logic which is not a desired outcome.
         *  To solve this, we clone the "notifications" variable and apply the necessary
         *  where clause on that particular instance knowing that it would not be used
         *  again.
         */
        $totalNotifications = (clone $notifications)->count();

        $notificationsPayload = $notifications->search($search)->latest()->paginate()->withQueryString();

        //  Return the sessions
        return [
            'notificationsPayload' => $notificationsPayload,
            'statistics' => [
                'totalNotifications' => number_format($totalNotifications, 0, '', ',')
            ]
        ];
    }
}
