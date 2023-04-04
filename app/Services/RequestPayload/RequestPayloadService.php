<?php

namespace App\Services\RequestPayload;

use App\Repositories\UssdSessionRepository;
use App\Repositories\UssdAccountRepository;
use App\Repositories\GlobalVariableRepository;
use App\Services\RequestPayload\Base\BasePayloadService;

class RequestPayloadService extends BasePayloadService
{
    /**
     *  Get accounts payload
     *
     *  This supports multiple account endpoints e.g
     *
     *  GET /accounts
     *      : Get entire system accounts
     *
     *  GET /projects/1/accounts
     *      : Get specific project accounts
     *
     *  GET /projects/1/apps/2/accounts
     *      : Get specific project and app accounts
     *
     *  GET /projects/1/apps/2/versions/2/accounts
     *      : Get specific project, app and version accounts
     */
    public static function getAccountsPayload($model = null)
    {
        $accountsPayload = resolve(UssdAccountRepository::class)->setModel($model)->getUssdAccounts();

        $totalAccountQuery = resolve(UssdAccountRepository::class)->queryUssdAccounts();

        $totalSimulatorAccounts = (clone $totalAccountQuery)->testAccounts()->count();
        $totalMobileAccounts = (clone $totalAccountQuery)->realAccounts()->count();
        $totalAccounts = (clone $totalAccountQuery)->count();

        //  Set the payload
        $payload = [
            'accountsPayload' => $accountsPayload,
            'statistics' => [
                'totalAccounts' => number_format($totalAccounts, 0, '', ','),
                'totalMobileAccounts' => number_format($totalMobileAccounts, 0, '', ','),
                'totalSimulatorAccounts' => number_format($totalSimulatorAccounts, 0, '', ',')
            ]
        ];

        //  Merge the payload with the project, app and version payloads
        $payload = RequestPayloadService::mergeAdditionalPayloads($payload);

        //  Return payload
        return $payload;
    }

    /**
     *  Get account payload
     */
    public static function getAccountPayload()
    {
        request()->ussd_account = request()->ussd_account->loadCount([

                //  Count the session of the account for the given version
                'sessions' => function ($query) {
                    $query->where('ussd_sessions.version_id', request()->version->id);
                },

                //  Count the session notifications
                'sessionNotifications',

                //  Count the database entries
                'databaseEntries',

                //  Count the global variables
                'globalVariables'

            ]);

        if ( request()->routeIs('version.account.show') ) {

            $payload = RequestPayloadService::getSessionsPayload(request()->ussd_account->sessions());

            //  Merge the payload with the project, app and version payloads
            $payload = RequestPayloadService::mergeAdditionalPayloads($payload);

        }else if ( request()->routeIs('account.notifications.show') ) {

            //  Get the notification service response
            //$serviceResponse = (new SessionNotificationService())->getNotifications();

        }else if ( request()->routeIs('account.database.entries.show') ) {

            //  Get the database entries service response
            //$serviceResponse = (new DatabaseEntryService())->getDatabaseEntries();

        }else if ( request()->routeIs('account.global.variables.show') ) {

            //  Get the global variables service response
            //$serviceResponse = (new GlobalVariableService())->getGlobalVariables();

        }

        //  Return payload
        return array_merge(['accountPayload' => request()->ussd_account], $payload);
    }

    /**
     *  Get sessions payload
     *
     *  This supports multiple account endpoints e.g
     *
     *  GET /sessions
     *      : Get entire system sessions
     *
     *  GET /projects/1/sessions
     *      : Get specific project sessions
     *
     *  GET /projects/1/apps/2/sessions
     *      : Get specific project and app sessions
     *
     *  GET /projects/1/apps/2/versions/2/sessions
     *      : Get specific project, app and version sessions
     */
    public static function getSessionsPayload($model = null)
    {
        $sessionsPayload = resolve(UssdSessionRepository::class)->setModel($model)->getUssdSessions();

        $totalSessionQuery = resolve(UssdSessionRepository::class)->queryUssdSessions();

        $totalSimulatorSessions = (clone $totalSessionQuery)->TestAccounts()->count();
        $totalMobileSessions = (clone $totalSessionQuery)->realAccounts()->count();
        $totalSuccessfulSessions = (clone $totalSessionQuery)->successful()->count();
        $totalFailedSessions = (clone $totalSessionQuery)->failed()->count();
        $totalSessions = (clone $totalSessionQuery)->count();

        //  Set the payload
        $payload = [
            'sessionsPayload' => $sessionsPayload,
            'statistics' => [
                'totalSessions' => number_format($totalSessions, 0, '', ','),
                'totalMobileSessions' => number_format($totalMobileSessions, 0, '', ','),
                'totalFailedSessions' => number_format($totalFailedSessions, 0, '', ','),
                'totalSimulatorSessions' => number_format($totalSimulatorSessions, 0, '', ','),
                'totalSuccessfulSessions' => number_format($totalSuccessfulSessions, 0, '', ',')
            ]
        ];

        //  Merge the payload with the project, app and version payloads
        $payload = RequestPayloadService::mergeAdditionalPayloads($payload);

        //  Return payload
        return $payload;
    }

    /**
     *  Get session payload
     */
    public static function getSessionPayload()
    {
        $payload = [
            'appPayload' => request()->app,
            'projectPayload' => request()->project,
            'sessionPayload' => request()->ussd_session,
            'versionPayload' => request()->version->makeHidden('builder')
        ];

        //  Return payload
        return $payload;
    }

    /**
     *  Get global variable payload
     *
     *  This supports multiple account endpoints e.g
     *
     *  GET /global-variables
     *      : Get entire system global variable
     *
     *  GET /projects/1/global-variables
     *      : Get specific project global variable
     *
     *  GET /projects/1/apps/2/global-variables
     *      : Get specific project and app global variable
     *
     *  GET /projects/1/apps/2/versions/2/global-variables
     *      : Get specific project, app and version global variable
     */
    public static function getGlobalVariablesPayload($model = null)
    {
        $globalVariablesPayload = resolve(GlobalVariableRepository::class)->setModel($model)->getGlobalVariables();

        $totalGlobalVariableQuery = resolve(GlobalVariableRepository::class)->queryGlobalVariables();

        $totalGlobalVariables = (clone $totalGlobalVariableQuery)->count();

        //  Set the payload
        $payload = [
            'globalVariablesPayload' => $globalVariablesPayload,
            'statistics' => [
                'totalGlobalVariables' => number_format($totalGlobalVariables, 0, '', ',')
            ]
        ];

        //  Merge the payload with the project, app and version payloads
        $payload = RequestPayloadService::mergeAdditionalPayloads($payload);

        //  Return payload
        return $payload;
    }

    /**
     *  Get session payload
     */
    public static function getGlobalVariablePayload()
    {
        $payload = [
            'appPayload' => request()->app,
            'projectPayload' => request()->project,
            'globalVariablePayload' => request()->global_variable,
            'versionPayload' => request()->version->makeHidden('builder')
        ];

        //  Return payload
        return $payload;
    }

}
