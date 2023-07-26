<?php

namespace App\Services\RequestPayload;

use stdClass;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\UssdAccount;
use Illuminate\Support\Facades\DB;
use App\Models\UssdAccountConnection;
use App\Models\UssdSession;
use App\Services\RequestPayload\Base\BasePayloadService;

class ReportPayloadService extends BasePayloadService
{
    static $accountReport = null;

    static $appConnections = null;
    static $activeAppConnections = null;
    static $inactiveAppConnections = null;

    static $projectConnections = null;
    static $activeProjectConnections = null;
    static $inactiveProjectConnections = null;

    static $versionConnections = null;
    static $activeVersionConnections = null;
    static $inactiveVersionConnections = null;

    /**
     *  Get reports payload
     *
     *  This supports multiple account endpoints e.g
     *
     *  GET /reports
     *      : Get entire system reports
     *
     *  GET /projects/1/reports
     *      : Get specific project reports
     *
     *  GET /projects/1/apps/2/reports
     *      : Get specific project and app reports
     *
     *  GET /projects/1/apps/2/versions/2/reports
     *      : Get specific project, app and version reports
     */
    public static function getReportsPayload()
    {
        $payload = [
            'reportPayload' => [
                'accountReport' => [
                    'overview' => [

                        array_merge([
                            'title' => 'Total',
                            'subtitle' => 'This is the total number of unique accounts ever created.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts Created').' chart below to visualize account creation over time.',
                        ], collect(self::getAccountCreationTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Active',
                            'subtitle' => 'This is the total number of unique accounts ever created and currently showing signs of more recent activity (active). These accounts dialed to consume services not too long ago.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts By More Recent Activity').' chart below to visualize account activity over time.',
                        ], collect(self::getActiveAccountsByLastActivityTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Inactive',
                            'subtitle' => 'This is the total number of unique accounts ever created and currently showing signs of more recent activity (inactive). These accounts dialed to consume services some time ago.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts By Less Recent Activity').' chart below to visualize account activity over time.',
                        ], collect(self::getInactiveAccountsByLastActivityTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Experienced Failures',
                            'subtitle' => 'This is the total number of unique accounts ever created but experienced a failed activity. These accounts dialed to consume services some time ago.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts By Failed Activity').' chart below to visualize account activity over time.',
                        ], collect(self::getAccountsByLastFailedActivityTotalReport())->toArray()),

                        array_merge([
                            'title' => "Experienced Failures \n And Left",
                            'subtitle' => 'This is the total number of unique accounts ever created but experienced a failed activity being the final activity by that account. These accounts dialed to consume services some time ago.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts By Failed Activity (Being Final Activity)').' chart below to visualize account activity over time.',
                        ], collect(self::getAccountsByLastFailedActivityAsFinalActivityTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Bounced',
                            'subtitle' => 'This is the total number of unique accounts ever created but bounced (dialed and left) on their last activity. These accounts dialed to consume services some time ago.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts By Bounce Activity').' chart below to visualize account bounce activity over time.',
                        ], collect(self::getAccountsByBouncedActivityTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Bounced And Left',
                            'subtitle' => 'This is the total number of unique accounts ever created but bounced (dialed and left) on their last activity. These accounts dialed to consume services some time ago and never returned.'.self::breakHtmlTags(2).'. Refer to the '.self::primaryHtmlTags('Accounts By Bounce Activity').' chart below to visualize account bounce activity over time.',
                        ], collect(self::getAccountsByBouncedActivityAsFinalActivityTotalReport())->toArray()),



                        //
                        array_merge([
                            'title' => 'Never Attempted Payment',
                            'subtitle' => 'This is the total number of unique accounts ever created that have never attempted to initiate a payment',
                        ], collect(self::getAccountsThatHaveNeverAttemptedPaymentTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Attempted Payment',
                            'subtitle' => 'This is the total number of unique accounts ever created that have attempted to initiate a payment (whether it was successful or not)',
                        ], collect(self::getAccountsThatHaveAttemptedPaymentTotalReport())->toArray()),




                        array_merge([
                            'title' => 'Paid Once',
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated one successful payment',
                        ], collect(self::getAccountsThatHaveOneSuccessfulPaymentTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Paid More Than Once',
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated more than one successful payment',
                        ], collect(self::getAccountsThatHaveMoreThanOneSuccessfulPaymentTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Never Failed Payment',
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated payments that never failed',
                        ], collect(self::getAccountsThatHaveNoFailedPaymentsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Failed Payment Once',
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated one failed payment',
                        ], collect(self::getAccountsThatHaveOneFailedPaymentTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Failed Payment More Than Once',
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated more than one failed payment',
                        ], collect(self::getAccountsThatHaveMoreThanOneFailedPaymentTotalReport())->toArray()),




                        array_merge([
                            'title' => "Attempted \n Prepaid Payment",
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated a prepaid payment',
                        ], collect(self::getAccountsThatHaveAttemptedPrepaidPaymentTotalReport())->toArray()),

                        array_merge([
                            'title' => "Attempted \n Postpaid Payment",
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated a postpaid payment',
                        ], collect(self::getAccountsThatHaveAttemptedPostpaidPaymentTotalReport())->toArray()),

                        array_merge([
                            'title' => "Attempted \n Prepaid & Postpaid Payment",
                            'subtitle' => 'This is the total number of unique accounts ever created that have initiated a prepaid and postpaid payment',
                        ], collect(self::getAccountsThatHaveAttemptedPrepaidAndPostpaidPaymentTotalReport())->toArray()),










                        //  Project connections

                        array_merge([
                            'title' => 'Project Connections',
                            'subtitle' => 'This is the total number of unique connections established between accounts and various projects e.g If 2 accounts are associated with 10 projects each, then we have 20 connections. This includes active and inactive connections.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Project Connections').' chart below to visualize total connections vs project names.',
                        ], collect(self::getProjectConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Active Project Connections',
                            'subtitle' => 'This is the total number of unique active connections established between accounts and various projects e.g If 2 accounts are associated with 10 projects each, then we have 20 active connections. The connection is considered active if the subscriber interacted with the project recently.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Project Active Connections').' chart below to visualize total active connections vs project names.',
                        ], collect(self::getActiveProjectConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Inactive Project Connections',
                            'subtitle' => 'This is the total number of unique inactive connections established between accounts and various projects e.g If 2 accounts are associated with 10 projects each, then we have 20 inactive connections. The connection is considered inactive if the subscriber never interacted with the project recently.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Project Inactive Connections').' chart below to visualize total inactive connections vs project names.',
                        ], collect(self::getInactiveProjectConnectionsTotalReport())->toArray()),

                        //  App connections

                        array_merge([
                            'title' => 'App Connections',
                            'subtitle' => 'This is the total number of unique connections established between accounts and various project apps e.g If 2 accounts are associated with 10 project apps each, then we have 20 connections. This includes active and inactive connections.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('App Connections').' chart below to visualize total connections vs app names.',
                        ], collect(self::getAppConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Active App Connections',
                            'subtitle' => 'This is the total number of unique active connections established between accounts and various project apps e.g If 2 accounts are associated with 10 project apps each, then we have 20 active connections. The connection is considered active if the subscriber interacted with the app recently.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('App Active Connections').' chart below to visualize total active connections vs app names.',
                        ], collect(self::getActiveAppConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Inactive App Connections',
                            'subtitle' => 'This is the total number of unique inactive connections established between accounts and various project apps e.g If 2 accounts are associated with 10 project apps each, then we have 20 inactive connections. The connection is considered inactive if the subscriber never interacted with the app recently.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('App Inactive Connections').' chart below to visualize total inactive connections vs app names.',
                        ], collect(self::getInactiveAppConnectionsTotalReport())->toArray()),

                        //  Version connections

                        array_merge([
                            'title' => 'Version Connections',
                            'subtitle' => 'This is the total number of unique connections established between accounts and various app versions e.g If 2 accounts are associated with 10 app versions each, then we have 20 connections. This includes active and inactive connections.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Version Connections').' chart below to visualize total connections vs version numbers.',
                        ], collect(self::getVersionConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Active Version Connections',
                            'subtitle' => 'This is the total number of unique active connections established between accounts and various app versions e.g If 2 accounts are associated with 10 app versions each, then we have 20 active connections. The connection is considered active if the subscriber interacted with the version recently.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Version Active Connections').' chart below to visualize total active connections vs version numbers.',
                        ], collect(self::getActiveVersionConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Inactive Version Connections',
                            'subtitle' => 'This is the total number of unique inactive connections established between accounts and various app versions e.g If 2 accounts are associated with 10 app versions each, then we have 20 inactive connections. The connection is considered inactive if the subscriber never interacted with the version recently.'.self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Version Inactive Connections').' chart below to visualize total inactive connections vs version numbers.',
                        ], collect(self::getInactiveVersionConnectionsTotalReport())->toArray()),

                        array_merge([
                            'title' => 'Recently Created',
                            'subtitle' => 'This is the total number of unique accounts created ' . self::getDateRangeText().self::breakHtmlTags(2).'Refer to the '.self::primaryHtmlTags('Accounts Created').' chart below to visualize recent account creation over time.',
                        ], collect(self::getAccountCreationTotalReport(true, true, true))->toArray()),


                    ],
                    'charts' => [






                        //  Account activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By Activity',
                            'subtitle' => 'Total accounts based on their last activity (more and less recent activity combined)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getAccountsByLastActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsByLastActivityLineChartComparisonReport()
                        ],

                        //  Accounts more recent activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By More Recent Activity',
                            'subtitle' => 'Total accounts that are gaining momentum due to signs of recent activity',
                            'description' => 'Total accounts that are gaining momentum due to signs of recent activity. These accounts are shown in respective to the time they were last active',
                            'series_name' => self::getDateType(),
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAccountsByLastActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getActiveAccountsByLastActivityLineChartComparisonReport()
                        ],

                        //  Accounts less recent activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By Less Recent Activity',
                            'subtitle' => 'Total accounts that are losing momentum due to signs of less recent activity',
                            'description' => 'Total accounts that are losing momentum due to signs of less recent activity. These accounts are shown in respective to the time they were last active',
                            'series_name' => self::getDateType(),
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAccountsByLastActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getInactiveAccountsByLastActivityLineChartComparisonReport()
                        ],

                        //  Account failed activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-6',
                            'title' => 'Accounts By Failed Activity',
                            'subtitle' => 'Total accounts based on their last failed activity',
                            'description' => 'Total accounts based on their last failed activity while using a service. These accounts are shown in respective to the last time they experienced a failure while trying to use a service.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and while using the service they encounter an error. At this point the account will be captured on this chart as an account that experienced a failure. If the subscriber dials again and does not encounter any issues, their last failed activity that was recorded will still show on this chart respective to the time that the failure occurred.'.self::breakHtmlTags(2).'This chart can be used to study the occurance of service failures as recent as they occur.',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getAccountsByLastFailedActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsByLastFailedActivityLineChartComparisonReport()
                        ],

                        //  Account failed activity as final activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-6',
                            'title' => 'Accounts By Failed Activity (Being Final Activity)',
                            'subtitle' => 'Total accounts based on their last failed activity being the final activity by that account',
                            'description' => 'Total accounts based on their last failed activity being the final activity by that account while using a service. These accounts are shown in respective to the last time they experienced a failure while trying to use a service. The same accounts never attempted to use services after the failure was encountered.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and while using the service they encounter an error. At this point the account will be captured on this chart as an account that experienced a failure as its final activity. If the subscriber dials again and does not encounter any issues, the previous failed activity that was recorded will no longer show on this chart since the subscribers final activity was successful.'.self::breakHtmlTags(2).'This chart can be used to study subscribers that stopped using a service after experiencing a failure. These subscribers abandoned using services after these failures occured',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getAccountsByLastFailedActivityAsFinalActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsByLastFailedActivityAsFinalActivityLineChartComparisonReport()
                        ],

                        //  Account bounce activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-6',
                            'title' => 'Accounts By Bounce Activity',
                            'subtitle' => 'Total accounts based on their bounce activity (Dialing once and leaving)',
                            'description' => 'Total accounts based on their bounce activity (Dialing once and leaving). These accounts are shown in respective to the last time they dialed once and left.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and while using the service they never reply to the main menu. At this point the account will be captured on this chart after the timeout limit has been exceeded (usually 120 seconds)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#f59e0b',
                            'series_data' => self::getAccountsByBouncedActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsByBouncedActivityLineChartComparisonReport()
                        ],

                        //  Account bounce activity as final activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-6',
                            'title' => 'Accounts By Bounce Activity (Being Final Activity)',
                            'subtitle' => 'Total accounts based on their bounce activity being the final activity',
                            'description' => 'Total accounts based on their bounce activity (Dialing once and leaving). These accounts are shown in respective to the last time they dialed once and left.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and while using the service they never reply to the main menu. At this point the account will be captured on this chart after the timeout limit has been exceeded (usually 120 seconds)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#f59e0b',
                            'series_data' => self::getAccountsByBouncedActivityAsFinalActivityLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsByBouncedActivityAsFinalActivityLineChartComparisonReport()
                        ],







                        //  Account by lifespan
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-12',
                            'title' => 'Accounts By Lifespan',
                            'subtitle' => 'Total accounts based on their lifespan since creation',
                            'description' => 'Total accounts based on their lifespan since creation. The account lifespan is the time elapsed between the first session ever recorded for each account and the current time.'.self::breakHtmlTags(2).'Assume a subscriber dials a service today, and 7 days elapse whether or not the subscriber returns again. The time difference between that first session and the current time now (after 7 days) means this account falls under the '.self::primaryHtmlTags('≤ 1 week').' category.'.self::breakHtmlTags(2).'This chart will capture every account whether active or inactive and can be used to study the various accounts as assigned to respective age groups since creation to date. This gives offers clarity to the age of accounts',
                            'series_name' => 'total accounts',
                            'series_data' => self::getAccountsByLifespanLineChartReport()
                        ],

                        //  Active account by lifespan
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Active Accounts By Lifespan',
                            'subtitle' => 'Total active accounts based on their lifespan',
                            'description' => 'Total active accounts based on their lifespan since creation. The account lifespan is the time elapsed between the first session ever recorded for each account and the current time.'.self::breakHtmlTags(2).'Assume a subscriber dials a service today, and 7 days elapse whether or not the subscriber returns again. The time difference between that first session and the current time now (after 7 days) means this account falls under the '.self::primaryHtmlTags('≤ 1 week').' category.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains active and can be used to study the various active accounts as assigned to respective age groups since creation to date. This gives offers clarity to the age of active accounts',
                            'series_name' => 'total active accounts',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAccountsByLifespanLineChartReport()
                        ],

                        //  Inactive account by lifespan
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Inactive Accounts By Lifespan',
                            'subtitle' => 'Total inactive accounts based on their lifespan',
                            'description' => 'Total inactive accounts based on their lifespan since creation. The account lifespan is the time elapsed between the first session ever recorded for each account and the current time.'.self::breakHtmlTags(2).'Assume a subscriber dials a service today, and 7 days elapse whether or not the subscriber returns again. The time difference between that first session and the current time now (after 7 days) means this account falls under the '.self::primaryHtmlTags('≤ 1 week').' category.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains inactive and can be used to study the various inactive accounts as assigned to respective age groups since creation to date. This gives offers clarity to the age of inactive accounts',
                            'series_name' => 'total inactive accounts',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAccountsByLifespanLineChartReport()
                        ],











                        //  Account by session count
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-12',
                            'title' => 'Accounts By Sessions',
                            'subtitle' => 'Total accounts based on their session count',
                            'description' => 'Total accounts based on their session count. Accounts are shown in respective to the total number of sessions produced.'.self::breakHtmlTags(2).'Assume a subscriber dials a service 25 times over a period of time therefore resulting in 25 different sessions. This means that this account falls under the '.self::primaryHtmlTags('20 < x ≤ 30').' category indicating the class respective to the total sessions.'.self::breakHtmlTags(2).'This chart will capture every account whether active or inactive and can be used to study the common range of sessions executed by various accounts.',
                            'series_name' => 'total accounts',
                            'series_data' => self::getAccountsBySessionsLineChartReport()
                        ],

                        //  Active account by session count
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Active Accounts By Sessions',
                            'subtitle' => 'Total active accounts based on their session count',
                            'description' => 'Total active accounts based on their session count. Accounts are shown in respective to the total number of sessions produced.'.self::breakHtmlTags(2).'Assume a subscriber dials a service 25 times over a period of time therefore resulting in 25 different sessions. This means that this account falls under the '.self::primaryHtmlTags('20 < x ≤ 30').' category indicating the class respective to the total sessions.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains active and can be used to study the common range of sessions executed by various active accounts.',
                            'series_name' => 'total active accounts',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAccountsBySessionsLineChartReport()
                        ],

                        //  Inactive account by session count
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Inactive Accounts By Sessions',
                            'subtitle' => 'Total inactive accounts based on their session count',
                            'description' => 'Total inactive accounts based on their session count. Accounts are shown in respective to the total number of sessions produced.'.self::breakHtmlTags(2).'Assume a subscriber dials a service 25 times over a period of time therefore resulting in 25 different sessions. This means that this account falls under the '.self::primaryHtmlTags('20 < x ≤ 30').' category indicating the class respective to the total sessions.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains inactive and can be used to study the common range of sessions executed by various inactive accounts.',
                            'series_name' => 'total inactive accounts',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAccountsBySessionsLineChartReport()
                        ],









                        //  Account by session duration
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-12',
                            'title' => 'Accounts By Overall Session Duration',
                            'subtitle' => 'Total accounts based on their overall session duration',
                            'description' => 'Total accounts based on their overall session duration. Accounts are shown in respective to the total session duration which is the total time spent interacting with a single service or multiple services.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and spends 5 minutes and then later dials again and spends 10 minutes. This means that this account falls under the '.self::primaryHtmlTags('14 < x < 16').' category indicating the class respective to the total time spent.'.self::breakHtmlTags(2).'This chart will capture every account whether active or inactive and can be used to study the common range of session duration (time spent using services) executed by various accounts.',
                            'series_name' => 'total accounts',
                            'series_data' => self::getAccountsByOverallSessionDurationLineChartReport()
                        ],

                        //  Active account by session duration
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Active Accounts By Overall Session Duration',
                            'subtitle' => 'Total active accounts based on their overall session duration',
                            'description' => 'Total accounts based on their overall session duration. Accounts are shown in respective to the total session duration which is the total time spent interacting with a single service or multiple services.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and spends 5 minutes and then later dials again and spends 10 minutes. This means that this account falls under the '.self::primaryHtmlTags('14 < x < 16').' category indicating the class respective to the total time spent.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains active and can be used to study the common range of session duration (time spent using services) executed by various active accounts.',
                            'series_name' => 'total active accounts',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAccountsByOverallSessionDurationLineChartReport()
                        ],

                        //  Inactive account by session duration
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Inactive Accounts By Overall Session Duration',
                            'subtitle' => 'Total inactive accounts based on their overall session duration',
                            'description' => 'Total accounts based on their overall session duration. Accounts are shown in respective to the total session duration which is the total time spent interacting with a single service or multiple services.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and spends 5 minutes and then later dials again and spends 10 minutes. This means that this account falls under the '.self::primaryHtmlTags('14 < x < 16').' category indicating the class respective to the total time spent.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains inactive and can be used to study the common range of session duration (time spent using services) executed by various inactive accounts.',
                            'series_name' => 'total inactive accounts',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAccountsByOverallSessionDurationLineChartReport()
                        ],











                        //  Account by average session duration
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-12',
                            'title' => 'Accounts By Average Session Duration',
                            'subtitle' => 'Total accounts based on their average session duration',
                            'description' => 'Total accounts based on their average session duration. Accounts are shown in respective to the total average session duration which is the total time spent interacting with a single service or multiple services.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and spends 5 minutes and then later dials again and spends 10 minutes. This means that this account falls under the '.self::primaryHtmlTags('14 mins < x < 16 mins').' category indicating the class respective to the total time spent.'.self::breakHtmlTags(2).'This chart will capture every account whether active or inactive and can be used to study the common range of average session duration (time spent using services) executed by various accounts.',
                            'series_name' => 'total accounts',
                            'series_data' => self::getAccountsByAverageSessionDurationLineChartReport()
                        ],

                        //  Active account by average session duration
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Active Accounts By Average Session Duration',
                            'subtitle' => 'Total active accounts based on their average session duration',
                            'description' => 'Total accounts based on their average session duration. Accounts are shown in respective to the total average session duration which is the total time spent interacting with a single service or multiple services.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and spends 5 minutes and then later dials again and spends 10 minutes. This means that this account falls under the '.self::primaryHtmlTags('14 < x < 16').' category indicating the class respective to the total time spent.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains active and can be used to study the common range of average session duration (time spent using services) executed by various active accounts.',
                            'series_name' => 'total active accounts',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAccountsByAverageSessionDurationLineChartReport()
                        ],

                        //  Inactive account by average session duration
                        [
                            'chart' => 'bar',
                            'col_span' => 'col-span-6',
                            'title' => 'Inactive Accounts By Average Session Duration',
                            'subtitle' => 'Total inactive accounts based on their average session duration',
                            'description' => 'Total accounts based on their average session duration. Accounts are shown in respective to the total average session duration which is the total time spent interacting with a single service or multiple services.'.self::breakHtmlTags(2).'Assume a subscriber dials a service and spends 5 minutes and then later dials again and spends 10 minutes. This means that this account falls under the '.self::primaryHtmlTags('14 < x < 16').' category indicating the class respective to the total time spent.'.self::breakHtmlTags(2).'This chart will capture every account as long as it remains inactive and can be used to study the common range of average session duration (time spent using services) executed by various inactive accounts.',
                            'series_name' => 'total inactive accounts',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAccountsByAverageSessionDurationLineChartReport()
                        ],













                        //  Account creation total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-12',
                            'title' => 'Accounts Created',
                            'subtitle' => 'Total accounts created over time',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getAccountCreationLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountCreationLineChartComparisonReport()
                        ],




                        //  Account By Shortcode (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Accounts By Dialed Shortcodes',
                            'subtitle' => 'Total accounts by shortcodes dialed',
                            'description' => 'Total accounts based on shortcodes dialed. Each shortcode consists of the total number of unique accounts that have dialed that particular shortcode atleast once since that account was created.'.self::breakHtmlTags(2).'This chart will capture every account whether it dialed the shortcode more or less recently and can be used to study the popularity of shortcodes among existing accounts',
                            'series_name' => 'shortcodes',
                            'series_data' => self::getAccountsByShortcodeColumnChartReport()
                        ],

                        //  Active Account By Shortcode (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Accounts By More Recently Dialed Shortcodes',
                            'subtitle' => 'Total accounts by shortcodes dialed more recently (gaining momentum)',
                            'description' => 'Total accounts based on shortcodes dialed more recently. Each shortcode consists of the total number of unique accounts that have dialed that particular shortcode atleast once since that account was created.'.self::breakHtmlTags(2).'This chart will capture every account as long as the last time that the account dialed the shortcode was a more recent event. Assume a subscriber dials *100#, then this account will be counted since this activity just happened. If the same account does not dial the same shortcode for some time, the account will no longer be counted due to signs of inactivity on this shortcode.'.self::breakHtmlTags(2).'This can be used to study shortcodes that have been dialed more recently and momentarily gaining momentum (activity from subscribers). Read this as "This many accounts (subscribers) dialed this shortcode" recently',
                            'series_name' => 'shortcodes',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAccountsByShortcodeColumnChartReport()
                        ],

                        //  Inactive Account By Shortcode (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Accounts By Less Recently Dialed Shortcodes (losing momentum)',
                            'description' => 'Total accounts based on shortcodes dialed less recently. Each shortcode consists of the total number of unique accounts that have dialed that particular shortcode atleast once since that account was created.'.self::breakHtmlTags(2).'This chart will capture every account as long as the last time that the account dialed the shortcode was a less recent event. Assume a subscriber dials *100#, then this account will not be counted since this activity just happened. If the same account does not dial the same shortcode for some time, the account will then be counted due to signs of inactivity on this shortcode.'.self::breakHtmlTags(2).'This can be used to study shortcodes that have been dialed less recently and momentarily losing momentum (activity from subscribers). Read this as "This many accounts (subscribers) haven\'t dialed this shortcode" recently',
                            'series_name' => 'shortcodes',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAccountsByShortcodeColumnChartReport()
                        ],







                        //  Project Connections (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Project Connections',
                            'subtitle' => 'Total account to project associations',
                            'series_name' => 'connections',
                            'series_data' => self::getProjectConnectionsColumnChartReport()
                        ],

                        //  Active Project Connections (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Active Project Connections',
                            'subtitle' => 'Total account to project active associations',
                            'series_name' => 'active connections',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveProjectConnectionsColumnChartReport()
                        ],

                        //  Inactive Project Connections (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Inactive Project Connections',
                            'subtitle' => 'Total account to project inactive associations',
                            'series_name' => 'inactive connections',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveProjectConnectionsColumnChartReport()
                        ],

                        //  App Connections (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'App Connections',
                            'subtitle' => 'Total account to app associations',
                            'series_name' => 'connections',
                            'series_data' => self::getAppConnectionsColumnChartReport()
                        ],

                        //  Active App Connections (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Active App Connections',
                            'subtitle' => 'Total account to app active associations',
                            'series_name' => 'active connections',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveAppConnectionsColumnChartReport()
                        ],

                        //  Inactive App Connections (Name vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Inactive App Connections',
                            'subtitle' => 'Total account to app inactive associations',
                            'series_name' => 'inactive connections',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveAppConnectionsColumnChartReport()
                        ],

                        //  Version Connections (Number vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Version Connections',
                            'subtitle' => 'Total account to version associations',
                            'series_name' => 'connections',
                            'series_data' => self::getVersionConnectionsColumnChartReport()
                        ],

                        //  Active Version Connections (Number vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Active Version Connections',
                            'subtitle' => 'Total account to version active associations',
                            'series_name' => 'active connections',
                            'series_color' => '#83cc16',
                            'series_data' => self::getActiveVersionConnectionsColumnChartReport()
                        ],

                        //  Inactive Version Connections (Number vs Total)
                        [
                            'chart' => 'column',
                            'title' => 'Inactive Version Connections',
                            'subtitle' => 'Total account to version inactive associations',
                            'series_name' => 'inactive connections',
                            'series_color' => '#f59e0b',
                            'series_data' => self::getInactiveVersionConnectionsColumnChartReport()
                        ],

















                        //  Account payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By Attempted Payments',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more and less recent activity combined)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getAccountsThatHaveAttemptedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsThatHaveAttemptedPaymentLineChartComparisonReport()
                        ],

                        //  Active Account payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Active Accounts By Attempted Payments',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more recent activity)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getActiveAccountsThatHaveAttemptedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getActiveAccountsThatHaveAttemptedPaymentLineChartComparisonReport()
                        ],

                        //  Inactive Account payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Inactive Accounts By Attempted Payments',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (less recent activity)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getInactiveAccountsThatHaveAttemptedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getInactiveAccountsThatHaveAttemptedPaymentLineChartComparisonReport()
                        ],



                        //  Account one payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By One Successful Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more and less recent activity combined)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getAccountsThatHaveOneSuccessfulPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
                        ],

                        //  Active Account one payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Active Accounts By One Successful Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more recent activity)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getActiveAccountsThatHaveOneSuccessfulPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getActiveAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
                        ],

                        //  Inactive Account one payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Inactive Accounts By One Successful Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (less recent activity)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getInactiveAccountsThatHaveOneSuccessfulPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getInactiveAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
                        ],







                        //  Account more than one payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By More Than One Successful Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more and less recent activity combined)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
                        ],

                        //  Active Account more than one payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Active Accounts By More Than One Successful Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more recent activity)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getActiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getActiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
                        ],

                        //  Inactive Account more than one payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Inactive Accounts By More Than One Successful Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (less recent activity)',
                            'series_name' => self::getDateType(),
                            'series_data' => self::getInactiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getInactiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
                        ],





                        //  Account by one failed payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By One Failed Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more and less recent activity combined)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getAccountsThatHaveOneFailedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsThatHaveOneFailedPaymentLineChartComparisonReport()
                        ],

                        //  Active Account by one failed payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Active Accounts By One Failed Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more recent activity)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getActiveAccountsThatHaveOneFailedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getActiveAccountsThatHaveOneFailedPaymentLineChartComparisonReport()
                        ],

                        //  Inactive Account by one failed payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Inactive Accounts By One Failed Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (less recent activity)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getInactiveAccountsThatHaveOneFailedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getInactiveAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
                        ],







                        //  Account by more than one failed payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Accounts By More Than One Failed Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more and less recent activity combined)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getAccountsThatHaveMoreThanOneFailedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getAccountsThatHaveMoreThanOneFailedPaymentLineChartComparisonReport()
                        ],

                        //  Active Account by more than one failed payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Active Accounts By More Than One Failed Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (more recent activity)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getActiveAccountsThatHaveMoreThanOneFailedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getActiveAccountsThatHaveMoreThanOneFailedPaymentLineChartComparisonReport()
                        ],

                        //  Inactive Account by more than one failed payment activity total over time
                        [
                            'chart' => 'area',
                            'col_span' => 'col-span-4',
                            'title' => 'Inactive Accounts By More Than One Failed Payment',
                            'subtitle' => 'Total accounts based on their last attempted payment activity (less recent activity)',
                            'series_name' => self::getDateType(),
                            'series_color' => '#ef4444',
                            'series_data' => self::getInactiveAccountsThatHaveMoreThanOneFailedPaymentLineChartReport(),
                            'comparison_series_name' => self::getComparisonDateType(),
                            'comparison_series_data' => self::getInactiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
                        ],



                    ]
                ],
                /*
                'sessionReport' => [
                    'overview' => [
                        array_merge(['name' => 'Sessions'], self::getSessionReport()),
                    ],
                    'charts' => [

                        //  Session total over time
                        [
                            'chart' => 'line',
                            'title' => self::getDateType(),
                            'data' => self::getSessionTotalOverTimeReport(),
                            'comparison_title' => self::getComparisonDateType(),
                            'comparison_data' => self::getSessionTotalOverTimeComparisonReport()
                        ]
                    ]
                ],
                */
                'aboutReport' => [
                    'date_range_text' => self::getDateRangeText(),
                    'date_range_comparison_text' => self::getDateRangeComparisonText()
                ],
            ]
        ];

        //  Merge the payload with the project, app and version payloads
        $payload = self::mergeAdditionalPayloads($payload);

        //  Return payload
        return $payload;
    }


    /******************************
     *  Account Creation Reports  *
     *****************************/

    /**
     *  Get the total accounts created
     */
    public static function getAccountCreationTotalReport($filterByDate = false, $withComparison = false, $runAgain = false)
    {
        if( is_null(self::$accountReport) || $runAgain == true ) {

            $modelInstance = resolve(UssdAccount::class);

            self::$accountReport = self::prepareOverviewReport($modelInstance, $filterByDate, $withComparison);

        }
        return self::$accountReport;
    }

    /**
     *  Get the total accounts created and currently active (more recent last activity)
     */
    public static function getActiveAccountsByLastActivityTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getActiveAccountsByLastActivity(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created but currently inactive (less recent last activity)
     */
    public static function getInactiveAccountsByLastActivityTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getInactiveAccountsByLastActivity(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created with their last failed activity
     */
    public static function getAccountsByLastFailedActivityTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsByLastFailedActivity(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created with their last failed activity being the final activity
     */
    public static function getAccountsByLastFailedActivityAsFinalActivityTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsByLastFailedActivityAsFinalActivity(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created with their last activity being a bounced activity
     */
    public static function getAccountsByBouncedActivityTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsByBouncedActivity(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created with their last activity being a bounced activity as the final activity
     */
    public static function getAccountsByBouncedActivityAsFinalActivityTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsByBouncedActivityAsFinalActivity(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have never initiated a payment before
     */
    public static function getAccountsThatHaveNeverAttemptedPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveNeverAttemptedPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a payment before
     */
    public static function getAccountsThatHaveAttemptedPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveAttemptedPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a prepaid payment before
     */
    public static function getAccountsThatHaveAttemptedPrepaidPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveAttemptedPrepaidPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a postpaid payment before
     */
    public static function getAccountsThatHaveAttemptedPostpaidPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveAttemptedPostpaidPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a prepaid and postpaid payment before
     */
    public static function getAccountsThatHaveAttemptedPrepaidAndPostpaidPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveAttemptedPrepaidAndPostpaidPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a payment before
     */
    public static function getAccountsThatHaveOneSuccessfulPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveOneSuccessfulPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a payment before
     */
    public static function getAccountsThatHaveMoreThanOneSuccessfulPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveMoreThanOneSuccessfulPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }


    /**
     *  Get the total accounts created that have initiated payments that never failed
     */
    public static function getAccountsThatHaveNoFailedPaymentsTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveNoFailedPayments(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated a failed payment before
     */
    public static function getAccountsThatHaveOneFailedPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveOneFailedPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }

    /**
     *  Get the total accounts created that have initiated more than one failed payment before
     */
    public static function getAccountsThatHaveMoreThanOneFailedPaymentTotalReport($filterByDate = false, $withComparison = true)
    {
        $total = self::getAccountsThatHaveMoreThanOneFailedPayment(true);
        $comparisionTotal = $withComparison ? self::getAccountCreationTotalReport()->total : null;

        return self::prepareOverviewReport($total, $filterByDate, $withComparison, $comparisionTotal);
    }













    /**
     *  Get the total accounts created over time
     */
    public static function getAccountCreationLineChartReport()
    {
        $queryCollection = resolve(UssdAccount::class)->oldest()->get();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection));
    }

    /**
     *  Get the comparison total accounts created over time
     */
    public static function getAccountCreationLineChartComparisonReport()
    {
        $queryCollection = resolve(UssdAccount::class)->oldest()->get();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection));
    }

    /***************************************
     *  Accounts By Last Activity Reports  *
     **************************************/

    /**
     *  Get the accounts with their last activity
     */
    public static function getAccountsByLastActivity($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("MAX(ussd_sessions.updated_at) as updated_at"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id');

        return $count ? $instance->count() : $instance->get();
    }

    /**
     *  Get the accounts last activity total over time
     */
    public static function getAccountsByLastActivityLineChartReport()
    {
        $queryCollection = self::getAccountsByLastActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /**
     *  Get the accounts last activity comparison total over time
     */
    public static function getAccountsByLastActivityLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsByLastActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /******************************************
     *  Account More Recently Active Reports  *
     *****************************************/

    /**
     *  Get the accounts with their more recent last activity
     */
    public static function getActiveAccountsByLastActivity($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("MAX(ussd_sessions.updated_at) as updated_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id');

        return $count ? $instance->count() : $instance->get();
    }

    /**
     *  Get the accounts with their more recent last activity total over time
     */
    public static function getActiveAccountsByLastActivityLineChartReport()
    {
        $queryCollection = self::getActiveAccountsByLastActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /**
     *  Get the accounts with their more recent last activity comparison total over time
     */
    public static function getActiveAccountsByLastActivityLineChartComparisonReport()
    {
        $queryCollection = self::getActiveAccountsByLastActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /******************************************
     *  Account Less Recently Active Reports  *
     *****************************************/

    /**
     *  Get the accounts with their less recent last activity
     */
    public static function getInactiveAccountsByLastActivity($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("MAX(ussd_sessions.updated_at) as updated_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id');

        return $count ? $instance->count() : $instance->get();
    }

    /**
     *  Get the accounts with their less recent last activity total over time
     */
    public static function getInactiveAccountsByLastActivityLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsByLastActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /**
     *  Get the accounts with their less recent last activity comparison total over time
     */
    public static function getInactiveAccountsByLastActivityLineChartComparisonReport()
    {
        $queryCollection = self::getInactiveAccountsByLastActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }


    /******************************************
     *  Account Last Failed Activity Reports  *
     *****************************************/

    /**
     *  Get the accounts with their last failed activity.
     *  This means that we want accounts by the last time that they experienced a failure
     *  while using a service. The time is determined by the last failure experienced
     */
    public static function getAccountsByLastFailedActivity($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', 'ussd_sessions.fatal_error', DB::raw("MAX(ussd_sessions.updated_at) as updated_at"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id', 'fatal_error')
            ->havingRaw('fatal_error = ?', ['1']);

        return $count ? $instance->count() : $instance->get();
    }

    /**
     *  Get the accounts last failed activity total over time
     */
    public static function getAccountsByLastFailedActivityLineChartReport()
    {
        $queryCollection = self::getAccountsByLastFailedActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /**
     *  Get the accounts last failed activity comparison total over time
     */
    public static function getAccountsByLastFailedActivityLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsByLastFailedActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }


    /************************************************************
     *  Account Last Failed Activity As Final Activity Reports  *
     ***********************************************************/

    /**
     *  Get the accounts with their last failed activity.
     *  This means that we want accounts by the last time that they experienced a failure
     *  while using a service and the user never dialed again after the failure. The time
     *  is determined by the last failure experienced
     */
    public static function getAccountsByLastFailedActivityAsFinalActivity($count = false)
    {
        $collection = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', 'ussd_sessions.fatal_error', DB::raw("MAX(ussd_sessions.updated_at) as updated_at"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id', 'fatal_error')
            ->orderByDesc('updated_at')
            ->get();

        /**
         *  We need to collect the top-most account-to-session record of each grouped record so
         *  that we can determine whether the top-most record is composed of a failed session.
         *
         *  We then need to capture account-to-session records that have failed
         */
        $collection = collect($collection)->groupBy('id')->map(function($groupRecords){

            /**
             *  Sort the related records according to the updated_at so that
             *  we can retrieve the record a the top of the stack. We want
             *  to capture the top-most record with the latest fatal_error
             */
            return collect($groupRecords)->sortByDesc('updated_at')->first();

        })->flatten()->filter(function($record){
            return $record->fatal_error == 1;
        });

        return $count ? $collection->count() : $collection;
    }

    /**
     *  Get the accounts last failed activity total over time
     */
    public static function getAccountsByLastFailedActivityAsFinalActivityLineChartReport()
    {
        $queryCollection = self::getAccountsByLastFailedActivityAsFinalActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }

    /**
     *  Get the accounts last failed activity comparison total over time
     */
    public static function getAccountsByLastFailedActivityAsFinalActivityLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsByLastFailedActivityAsFinalActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'updated_at'), 'updated_at');
    }












    /******************************************
     *  Account Bounce Activity Reports  *
     *****************************************/

    /**
     *  Get the accounts with their last bounced activity
     *  This occurs when the request type is equal to "1" and
     *  the session does not receive a reply before timeout
     */
    public static function getAccountsByBouncedActivity($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', 'ussd_sessions.request_type', DB::raw("MAX(ussd_sessions.timeout_at) as timeout_at"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->havingRaw('request_type = ? AND timeout_at <= ?', ['1', Carbon::now()])
            ->groupBy('ussd_accounts.id', 'request_type');

        return $count ? $instance->count() : $instance->get();
    }

    /**
     *  Get the accounts last bounced activity total over time
     */
    public static function getAccountsByBouncedActivityLineChartReport()
    {
        $queryCollection = self::getAccountsByBouncedActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'timeout_at'), 'timeout_at');
    }

    /**
     *  Get the accounts last bounced activity comparison total over time
     */
    public static function getAccountsByBouncedActivityLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsByBouncedActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'timeout_at'), 'timeout_at');
    }

    /*******************************************************
     *  Account Bounce Activity As Final Activity Reports  *
     ******************************************************/

    /**
     *  Get the accounts with their last bounced activity as the final activity
     *  This occurs when the request type is equal to "1" and the session does not
     *  receive a reply within the maximum session duration
     */
    public static function getAccountsByBouncedActivityAsFinalActivity($count = false)
    {
        /**
         *  Notice that the sessions that have a request type equal to 1 must wait the maximum session
         *  duration (the duration before timeout) before being captured while any other session that
         *  has a request type other than 1 can be collection immediately.
         */
        $collection = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', 'ussd_sessions.request_type', DB::raw("MAX(ussd_sessions.timeout_at) as timeout_at"))
            ->havingRaw('(request_type = ? AND timeout_at <= ?) OR (request_type != 1)', ['1', Carbon::now()])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id', 'request_type')
            ->orderByDesc('timeout_at')
            ->get();

        /**
         *  We need to collect the top-most account-to-session record of each grouped record so
         *  that we can determine whether the top-most record is a bounced session.
         *
         *  We then need to capture account-to-session records that have failed
         */
        $collection = collect($collection)->groupBy('id')->map(function($groupRecords){

            /**
             *  Sort the related records according to the timeout_at so that
             *  we can retrieve the record a the top of the stack. We want
             *  to capture the top-most record with the request type
             *  equal to "1"
             */
            return collect($groupRecords)->sortByDesc('timeout_at')->first();

        })->flatten()->filter(function($record){
            return $record->request_type == 1;
        });

        return $count ? $collection->count() : $collection;
    }

    /**
     *  Get the accounts last failed activity total over time
     */
    public static function getAccountsByBouncedActivityAsFinalActivityLineChartReport()
    {
        $queryCollection = self::getAccountsByBouncedActivityAsFinalActivity();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'timeout_at'), 'timeout_at');
    }

    /**
     *  Get the accounts last failed activity comparison total over time
     */
    public static function getAccountsByBouncedActivityAsFinalActivityLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsByBouncedActivityAsFinalActivity();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'timeout_at'), 'timeout_at');
    }




    /******************************************
     *  Account Payment Activity Reports      *
     *****************************************/

    /**
     *  Get the accounts that have never attempted to initiate a payment before
     */
    public static function getAccountsThatHaveNeverAttemptedPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->leftJoin('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->havingRaw('COUNT(airtime_billing_payments.id) = 0')
            ->groupBy('ussd_accounts.id')
            ->select('ussd_accounts.id');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have attempted to initiate a payment before
     */
    public static function getAccountsThatHaveAttemptedPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        /**
         *  Using count() alone does not output the correct result the we must get() then count()
         */
        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the active accounts that have attempted to initiate a payment before
     */
    public static function getActiveAccountsThatHaveAttemptedPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        /**
         *  Using count() alone does not output the correct result the we must get() then count()
         */
        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the active accounts that have attempted to initiate a payment before
     */
    public static function getInactiveAccountsThatHaveAttemptedPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        /**
         *  Using count() alone does not output the correct result the we must get() then count()
         */
        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have attempted to initiate a prepaid payment before
     */
    public static function getAccountsThatHaveAttemptedPrepaidPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->where('is_prepaid_account', '1')
            ->groupBy('ussd_accounts.id')
            ->select('ussd_accounts.id');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have attempted to initiate a postpaid payment before
     */
    public static function getAccountsThatHaveAttemptedPostpaidPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->where('is_prepaid_account', '0')
            ->groupBy('ussd_accounts.id')
            ->select('ussd_accounts.id');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have attempted to initiate a prepaid and postpaid payment before
     */
    public static function getAccountsThatHaveAttemptedPrepaidAndPostpaidPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("COUNT(IF(is_prepaid_account = 1, 1, NULL)) as total_prepaid, COUNT(IF(is_prepaid_account = 0, 1, NULL)) as total_postpaid"))
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->having('total_postpaid', '>' , '0')
            ->having('total_prepaid', '>' , '0')
            ->groupBy('ussd_accounts.id');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated only one successful payment
     */
    public static function getAccountsThatHaveOneSuccessfulPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('COUNT(airtime_billing_payments.id) = 1')
            ->where('success_status', '1')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the active accounts that have initiated only one successful payment
     */
    public static function getActiveAccountsThatHaveOneSuccessfulPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) = 1')
            ->where('success_status', '1')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the inactive accounts that have initiated only one successful payment
     */
    public static function getInactiveAccountsThatHaveOneSuccessfulPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) = 1')
            ->where('success_status', '1')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated more than one successful payment
     */
    public static function getAccountsThatHaveMoreThanOneSuccessfulPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('COUNT(airtime_billing_payments.id) > 1')
            ->where('success_status', '1')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the active accounts that have initiated more than one successful payment
     */
    public static function getActiveAccountsThatHaveMoreThanOneSuccessfulPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) > 1')
            ->where('success_status', '1')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the inactive accounts that have initiated more than one successful payment
     */
    public static function getInactiveAccountsThatHaveMoreThanOneSuccessfulPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_sessions.id', '=', 'airtime_billing_payments.ussd_session_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) > 1')
            ->where('success_status', '1')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated payments that never failed
     */
    public static function getAccountsThatHaveNoFailedPayments($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->havingRaw('COUNT(IF(airtime_billing_payments.success_status = 0, airtime_billing_payments.id, NULL)) = 0')
            ->groupBy('ussd_accounts.id')
            ->select('ussd_accounts.id');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated one failed payment
     */
    public static function getAccountsThatHaveOneFailedPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('COUNT(airtime_billing_payments.id) = 1')
            ->where('success_status', '0')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated one failed payment
     */
    public static function getActiveAccountsThatHaveOneFailedPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) = 1')
            ->where('success_status', '0')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated one failed payment
     */
    public static function getInactiveAccountsThatHaveOneFailedPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) = 1')
            ->where('success_status', '0')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated more than one failed payment
     */
    public static function getAccountsThatHaveMoreThanOneFailedPayment($count = false)
    {
        $instance = DB::table('ussd_accounts')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('COUNT(airtime_billing_payments.id) > 1')
            ->where('success_status', '0')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated more than one failed payment
     */
    public static function getActiveAccountsThatHaveMoreThanOneFailedPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) > 1')
            ->where('success_status', '0')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

    /**
     *  Get the accounts that have initiated more than one failed payment
     */
    public static function getInactiveAccountsThatHaveMoreThanOneFailedPayment($count = false, $duration = 1)
    {
        $instance = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->join('airtime_billing_payments', 'ussd_accounts.id', '=', 'airtime_billing_payments.ussd_account_id')
            ->select('ussd_accounts.id', DB::raw("MAX(airtime_billing_payments.created_at) as created_at"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->havingRaw('COUNT(airtime_billing_payments.id) > 1')
            ->where('success_status', '0')
            ->groupBy('ussd_accounts.id')
            ->orderByDesc('created_at');

        return $count ? $instance->get()->count() : $instance->get();
    }

























    /***********************************
     *  Accounts By Attempted Payment  *
     **********************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of accounts by last attempted payment
     */
    public static function getAccountsThatHaveAttemptedPaymentLineChartReport()
    {
        $queryCollection = self::getAccountsThatHaveAttemptedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of accounts by last attempted payment
     */
    public static function getAccountsThatHaveAttemptedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsThatHaveAttemptedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /******************************************
     *  Active Accounts By Attempted Payment  *
     *****************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of active accounts by last attempted payment
     */
    public static function getActiveAccountsThatHaveAttemptedPaymentLineChartReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveAttemptedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of active accounts by last attempted payment
     */
    public static function getActiveAccountsThatHaveAttemptedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveAttemptedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /********************************************
     *  Inactive Accounts By Attempted Payment  *
     *******************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of inactive accounts by last attempted payment
     */
    public static function getInactiveAccountsThatHaveAttemptedPaymentLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveAttemptedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of inactive accounts by last attempted payment
     */
    public static function getInactiveAccountsThatHaveAttemptedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveAttemptedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }










    /***************************************
     *  Accounts By One Successful Payment *
     **************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of accounts by only one successful payment
     */
    public static function getAccountsThatHaveOneSuccessfulPaymentLineChartReport()
    {
        $queryCollection = self::getAccountsThatHaveOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of accounts by only one successful payment
     */
    public static function getAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsThatHaveOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**********************************************
     *  Active Accounts By One Successful Payment *
     *********************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of active accounts by only one successful payment
     */
    public static function getActiveAccountsThatHaveOneSuccessfulPaymentLineChartReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of active accounts by only one successful payment
     */
    public static function getActiveAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /************************************************
     *  Inactive Accounts By One Successful Payment *
     ***********************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of inactive accounts by only one successful payment
     */
    public static function getInactiveAccountsThatHaveOneSuccessfulPaymentLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of inactive accounts by only one successful payment
     */
    public static function getInactiveAccountsThatHaveOneSuccessfulPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }










    /*************************************************
     *  Accounts By More Than One Successful Payment *
     ************************************************/

    /**
     *  Return the X and Y values to draw a line chart of
     *  accounts by only more than one successful payment
     */
    public static function getAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartReport()
    {
        $queryCollection = self::getAccountsThatHaveMoreThanOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line chart
     *  of accounts by only more than one successful payment
     */
    public static function getAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsThatHaveMoreThanOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**********************************************
     *  Active Accounts By One Successful Payment *
     *********************************************/

    /**
     *  Return the X and Y values to draw a line chart of
     *  active accounts by more than one successful payment
     */
    public static function getActiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveMoreThanOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line chart of
     *  active accounts by more than one successful payment
     */
    public static function getActiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveMoreThanOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /************************************************
     *  Inactive Accounts By One Successful Payment *
     ***********************************************/

    /**
     *  Return the X and Y values to draw a line chart of inactive
     *  accounts by more than one successful payment
     */
    public static function getInactiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveMoreThanOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line chart of
     *  inactive accounts by more than one successful payment
     */
    public static function getInactiveAccountsThatHaveMoreThanOneSuccessfulPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveMoreThanOneSuccessfulPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }













    /***********************************
     *  Accounts By One Failed Payment *
     ***********************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of accounts by only one failed payment
     */
    public static function getAccountsThatHaveOneFailedPaymentLineChartReport()
    {
        $queryCollection = self::getAccountsThatHaveOneFailedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of accounts by only one failed payment
     */
    public static function getAccountsThatHaveOneFailedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsThatHaveOneFailedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**********************************************
     *  Active Accounts By One Failed Payment *
     *********************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of active accounts by last failed payment
     */
    public static function getActiveAccountsThatHaveOneFailedPaymentLineChartReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveOneFailedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of active accounts by last failed payment
     */
    public static function getActiveAccountsThatHaveOneFailedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveOneFailedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /************************************************
     *  Inactive Accounts By One Failed Payment *
     ***********************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of inactive accounts by last failed payment
     */
    public static function getInactiveAccountsThatHaveOneFailedPaymentLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveOneFailedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of inactive accounts by last failed payment
     */
    public static function getInactiveAccountsThatHaveOneFailedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveOneFailedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }


















    /***********************************
     *  Accounts By One Failed Payment *
     ***********************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of accounts by more than one failed payment
     */
    public static function getAccountsThatHaveMoreThanOneFailedPaymentLineChartReport()
    {
        $queryCollection = self::getAccountsThatHaveMoreThanOneFailedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of accounts by more than one failed payment
     */
    public static function getAccountsThatHaveMoreThanOneFailedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getAccountsThatHaveMoreThanOneFailedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**********************************************
     *  Active Accounts By One Failed Payment *
     *********************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of active accounts by last failed payment
     */
    public static function getActiveAccountsThatHaveMoreThanOneFailedPaymentLineChartReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveMoreThanOneFailedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of active accounts by last failed payment
     */
    public static function getActiveAccountsThatHaveMoreThanOneFailedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getActiveAccountsThatHaveMoreThanOneFailedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /************************************************
     *  Inactive Accounts By One Failed Payment *
     ***********************************************/

    /**
     *  Return the X and Y values to draw a line chart
     *  of inactive accounts by last failed payment
     */
    public static function getInactiveAccountsThatHaveMoreThanOneFailedPaymentLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveMoreThanOneFailedPayment();
        return self::groupByDateConstraints(self::filterByDateConstraints($queryCollection, 'created_at'), 'created_at');
    }

    /**
     *  Return the X and Y values to draw a comparison line
     *  chart of inactive accounts by last failed payment
     */
    public static function getInactiveAccountsThatHaveMoreThanOneFailedPaymentLineChartComparisonReport()
    {
        $queryCollection = self::getInactiveAccountsThatHaveMoreThanOneFailedPayment();
        return self::groupByDateConstraints(self::filterComparisonDateConstraints($queryCollection, 'created_at'), 'created_at');
    }




















    /*******************************
     *  Account Life Span Reports  *
     ******************************/

    /**
     *  Get the accounts with their lifespan difference in seconds
     */
    public static function getAccountsByLifespan()
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("TIMESTAMPDIFF(SECOND, MIN(ussd_sessions.created_at), NOW()) as duration"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the accounts by life span total
     */
    public static function getAccountsByLifespanLineChartReport()
    {
        $queryCollection = self::getAccountsByLifespan();
        return self::groupByDurationTiers($queryCollection);
    }

    /**************************************
     *  Active Account Life Span Reports  *
     **************************************/

    /**
     *  Get the active accounts with their lifespan difference in seconds
     */
    public static function getActiveAccountsByLifespan($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("TIMESTAMPDIFF(SECOND, MIN(ussd_sessions.created_at), NOW()) as duration"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the active accounts by life span total
     */
    public static function getActiveAccountsByLifespanLineChartReport()
    {
        $queryCollection = self::getActiveAccountsByLifespan();
        return self::groupByDurationTiers($queryCollection);
    }

    /**************************************
     *  Inactive Account Life Span Reports  *
     **************************************/

    /**
     *  Get the inactive accounts with their lifespan difference in seconds
     */
    public static function getInactiveAccountsByLifespan($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("TIMESTAMPDIFF(SECOND, MIN(ussd_sessions.created_at), NOW()) as duration"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the inactive accounts by life span total
     */
    public static function getInactiveAccountsByLifespanLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsByLifespan();
        return self::groupByDurationTiers($queryCollection);
    }
























    /******************************
     *  Account Sessions Reports  *
     *****************************/

    /**
     *  Get the accounts with their session count
     */
    public static function getAccountsBySessions()
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("COUNT('*') as total_sessions"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('total_sessions')
            ->get();
    }

    /**
     *  Get the accounts by session count total
     */
    public static function getAccountsBySessionsLineChartReport()
    {
        $queryCollection = self::getAccountsBySessions();
        return self::groupByTotalTiers($queryCollection, 'total_sessions');
    }

    /*************************************
     *  Active Account Sessions Reports  *
     *************************************/

    /**
     *  Get the active accounts with their session count
     */
    public static function getActiveAccountsBySessions($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("COUNT('*') as total_sessions"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('total_sessions')
            ->get();
    }

    /**
     *  Get the active accounts by session count total
     */
    public static function getActiveAccountsBySessionsLineChartReport()
    {
        $queryCollection = self::getActiveAccountsBySessions();
        return self::groupByTotalTiers($queryCollection, 'total_sessions');
    }

    /***************************************
     *  Inactive Account Sessions Reports  *
     **************************************/

    /**
     *  Get the inactive accounts with their session count
     */
    public static function getInactiveAccountsBySessions($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("COUNT('*') as total_sessions"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('total_sessions')
            ->get();
    }

    /**
     *  Get the inactive accounts by session count total
     */
    public static function getInactiveAccountsBySessionsLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsBySessions();
        return self::groupByTotalTiers($queryCollection, 'total_sessions');
    }






















    /**************************************
     *  Account Session Duration Reports  *
     *************************************/

    /**
     *  Get the accounts with their overall session duration
     */
    public static function getAccountsByOverallSessionDuration()
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("SUM(TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at)) as duration"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the accounts by session duration total
     */
    public static function getAccountsByOverallSessionDurationLineChartReport()
    {
        $queryCollection = self::getAccountsByOverallSessionDuration();
        return self::groupByDurationTiers($queryCollection);
    }

    /*********************************************
     *  Active Account Session Duration Reports  *
     ********************************************/

    /**
     *  Get the active accounts with their overall session duration
     */
    public static function getActiveAccountsByOverallSessionDuration($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("SUM(TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at)) as duration"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the active accounts by session duration total
     */
    public static function getActiveAccountsByOverallSessionDurationLineChartReport()
    {
        $queryCollection = self::getActiveAccountsByOverallSessionDuration();
        return self::groupByDurationTiers($queryCollection);
    }

    /***********************************************
     *  Inactive Account Session Duration Reports  *
     **********************************************/

    /**
     *  Get the inactive accounts with their overall session duration
     */
    public static function getInactiveAccountsByOverallSessionDuration($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("SUM(TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at)) as duration"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the inactive accounts by session duration total
     */
    public static function getInactiveAccountsByOverallSessionDurationLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsByOverallSessionDuration();
        return self::groupByDurationTiers($queryCollection);
    }


















    /**********************************************
     *  Account Average Session Duration Reports  *
     *********************************************/

    /**
     *  Get the accounts with their average session duration
     */
    public static function getAccountsByAverageSessionDuration()
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("ROUND(AVG(TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at))) as duration"))
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the accounts by average session duration total
     */
    public static function getAccountsByAverageSessionDurationLineChartReport()
    {
        $queryCollection = self::getAccountsByAverageSessionDuration();
        return self::groupByDurationTiers($queryCollection);
    }

    /*****************************************************
     *  Active Account Average Session Duration Reports  *
     ****************************************************/

    /**
     *  Get the active accounts with their average session duration
     */
    public static function getActiveAccountsByAverageSessionDuration($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("ROUND(AVG(TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at))) as duration"))
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the active accounts by average session duration total
     */
    public static function getActiveAccountsByAverageSessionDurationLineChartReport()
    {
        $queryCollection = self::getActiveAccountsByAverageSessionDuration();
        return self::groupByDurationTiers($queryCollection);
    }

    /*******************************************************
     *  Inactive Account Average Session Duration Reports  *
     ******************************************************/

    /**
     *  Get the inactive accounts with their average session duration
     */
    public static function getInactiveAccountsByAverageSessionDuration($duration = 1)
    {
        return DB::table('ussd_accounts')
            ->select('ussd_accounts.id', DB::raw("ROUND(AVG(TIMESTAMPDIFF(SECOND, ussd_sessions.created_at, ussd_sessions.updated_at))) as duration"))
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_accounts.id')
            ->orderBy('duration')
            ->get();
    }

    /**
     *  Get the inactive accounts by average session duration total
     */
    public static function getInactiveAccountsByAverageSessionDurationLineChartReport()
    {
        $queryCollection = self::getInactiveAccountsByAverageSessionDuration();
        return self::groupByDurationTiers($queryCollection);
    }















    /**********************************
     *  Account By Shortcode Reports  *
     **********************************/

    /**
     *  Return the X and Y values to draw a column chart
     *  of the account by shortcode totals
     */
    public static function getAccountsByShortcodeColumnChartReport()
    {
        $queryCollection = DB::table('ussd_accounts')
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_sessions.service_code', 'ussd_sessions.ussd_account_id')
            ->select('ussd_sessions.service_code', DB::raw("COUNT('*') as total"))
            ->orderByDesc('total')
            ->get();

        $limitResults = self::getColumnChartLimit();
        $collection = self::groupRelatedRecordsIntoTotals($queryCollection, 'service_code');
        return self::setXandYaxis($collection, 'total', 'service_code', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of active accounts by shortcode totals
     */
    public static function getActiveAccountsByShortcodeColumnChartReport($duration = 1)
    {
        $queryCollection = DB::table('ussd_accounts')
            ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_sessions.service_code', 'ussd_sessions.ussd_account_id')
            ->select('ussd_sessions.service_code', DB::raw("COUNT('*') as total"))
            ->orderByDesc('total')
            ->get();

        $limitResults = self::getColumnChartLimit();
        $collection = self::groupRelatedRecordsIntoTotals($queryCollection, 'service_code');
        return self::setXandYaxis($collection, 'total', 'service_code', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of inactive accounts by shortcode totals
     */
    public static function getInactiveAccountsByShortcodeColumnChartReport($duration = 1)
    {
        $queryCollection = DB::table('ussd_accounts')
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('ussd_sessions', 'ussd_accounts.id', '=', 'ussd_sessions.ussd_account_id')
            ->groupBy('ussd_sessions.service_code', 'ussd_sessions.ussd_account_id')
            ->select('ussd_sessions.service_code', DB::raw("COUNT('*') as total"))
            ->orderByDesc('total')
            ->get();

        $limitResults = self::getColumnChartLimit();
        $collection = self::groupRelatedRecordsIntoTotals($queryCollection, 'service_code');
        return self::setXandYaxis($collection, 'total', 'service_code', $limitResults);
    }


























    /*****************************************
     *  Account-Project Connections Reports  *
     ****************************************/

    /**
     *  Get the project connections grouped by project names and totals
     */
    public static function getProjectConnections()
    {
        if( is_null(self::$projectConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "projects"
             *  so that we can collect the "ussd_account_connections" project name. We then
             *  groupBy() the "ussd_account_id" and "project_id" so that we can derive the
             *  available connections between users and projects. The select() will then
             *  narrow down the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select('projects.name', 'ussd_account_connections.project_id', 'ussd_account_connections.ussd_account_id')
                ->groupBy('ussd_account_connections.ussd_account_id', 'ussd_account_connections.project_id')
                ->join('projects', 'projects.id', '=', 'ussd_account_connections.project_id')
                ->get();

            self::$projectConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'project_id');

        }

        return self::$projectConnections;
    }

    /**
     *  Get the active project connections grouped by project names and totals
     */
    public static function getActiveProjectConnections($duration = 1)
    {
        if( is_null(self::$activeProjectConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "ussd_sessions"
             *  so that we can collect the sessions of each "ussd_account_connection" record.
             *  Then using the havingRaw(), we can select "ussd_account_connections" having
             *  sessions that were created recently. The groupBy() will be useful to group
             *  the results so that we can determine the MAX date of the sessions foreach
             *  "ussd_account_connection" making it possible to know whether the
             *  "ussd_account_connection" has a session recently created. We
             *  must also join to the "projects" so that we can collect the
             *  "ussd_account_connections" project name. The select() will
             *  then narrow down the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select('projects.name', 'ussd_account_connections.project_id', 'ussd_account_connections.ussd_account_id', DB::raw("MAX(ussd_sessions.updated_at) as last_active_at"))
                ->join('ussd_sessions', 'ussd_account_connections.id', '=', 'ussd_sessions.ussd_account_connection_id')
                ->groupBy('ussd_account_connections.ussd_account_id', 'ussd_account_connections.project_id')
                ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
                ->join('projects', 'projects.id', '=', 'ussd_account_connections.project_id')
                ->get();

            self::$activeProjectConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'project_id');

        }

        return self::$activeProjectConnections;
    }

    /**
     *  Get the inactive project connections grouped by project names and totals
     */
    public static function getInactiveProjectConnections($duration = 1)
    {
        if( is_null(self::$inactiveProjectConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "ussd_sessions"
             *  so that we can collect the sessions of each "ussd_account_connection" record.
             *  Then using the havingRaw(), we can select "ussd_account_connections" having
             *  sessions that were not created recently. The groupBy() will be useful to
             *  group the results so that we can determine the MAX date of the sessions
             *  foreach "ussd_account_connection" making it possible to know whether
             *  the "ussd_account_connection" has a session recently created. We
             *  must also join to the "projects" so that we can collect the
             *  "ussd_account_connections" project name. The select() will
             *  then narrow down the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select('projects.name', 'ussd_account_connections.project_id', 'ussd_account_connections.ussd_account_id', DB::raw("MAX(ussd_sessions.updated_at) as last_active_at"))
                ->join('ussd_sessions', 'ussd_account_connections.id', '=', 'ussd_sessions.ussd_account_connection_id')
                ->groupBy('ussd_account_connections.ussd_account_id', 'ussd_account_connections.project_id')
                ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
                ->join('projects', 'projects.id', '=', 'ussd_account_connections.project_id')
                ->get();

            self::$inactiveProjectConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'project_id');

        }

        return self::$inactiveProjectConnections;
    }

    /**
     *  Return the total account-to-project connections
     */
    public static function getProjectConnectionsTotalReport()
    {
        $total = self::getProjectConnections()->sum('total');
        return self::prepareOverviewReport($total, false, false);
    }

    /**
     *  Return the total active account-to-project connections
     */
    public static function getActiveProjectConnectionsTotalReport($withComparison = true)
    {
        $comparisionTotal = $withComparison ? self::getProjectConnectionsTotalReport()->total : null;
        $total = self::getActiveProjectConnections()->sum('total');

        return self::prepareOverviewReport($total, false, $withComparison, $comparisionTotal);
    }

    /**
     *  Return the total inactive account-to-project connections
     */
    public static function getInactiveProjectConnectionsTotalReport($withComparison = true)
    {
        $comparisionTotal = $withComparison ? self::getProjectConnectionsTotalReport()->total : null;
        $total = self::getInActiveProjectConnections()->sum('total');

        return self::prepareOverviewReport($total, false, $withComparison, $comparisionTotal);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the account-to-project connections
     */
    public static function getProjectConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getProjectConnections(), 'total', 'name', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the active account-to-project connections
     */
    public static function getActiveProjectConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getActiveProjectConnections(), 'total', 'name', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the inactive account-to-project connections
     */
    public static function getInactiveProjectConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getInactiveProjectConnections(), 'total', 'name', $limitResults);
    }


    /*****************************************
     *  Account-App Connections Reports  *
     ****************************************/

    /**
     *  Get the app connections grouped by app names and totals
     */
    public static function getAppConnections()
    {
        if( is_null(self::$appConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "apps"
             *  so that we can collect the "ussd_account_connections" app name. We then
             *  groupBy() the "ussd_account_id" and "app_id" so that we can derive the
             *  available connections between users and apps. The select() will then
             *  narrow down the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select('apps.name', 'ussd_account_connections.app_id', 'ussd_account_connections.ussd_account_id')
                ->groupBy('ussd_account_connections.ussd_account_id', 'ussd_account_connections.app_id')
                ->join('apps', 'apps.id', '=', 'ussd_account_connections.app_id')
                ->get();

            self::$appConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'app_id');

        }

        return self::$appConnections;
    }

    /**
     *  Get the active app connections grouped by app names and totals
     */
    public static function getActiveAppConnections($duration = 1)
    {
        if( is_null(self::$activeAppConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "ussd_sessions"
             *  so that we can collect the sessions of each "ussd_account_connection" record.
             *  Then using the havingRaw(), we can select "ussd_account_connections" having
             *  sessions that were created recently. The groupBy() will be useful to group
             *  the results so that we can determine the MAX date of the sessions foreach
             *  "ussd_account_connection" making it possible to know whether the
             *  "ussd_account_connection" has a session recently created. We
             *  must also join to the "apps" so that we can collect the
             *  "ussd_account_connections" app name. The select() will
             *  then narrow down the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select('apps.name', 'ussd_account_connections.app_id', 'ussd_account_connections.ussd_account_id', DB::raw("MAX(ussd_sessions.updated_at) as last_active_at"))
                ->join('ussd_sessions', 'ussd_account_connections.id', '=', 'ussd_sessions.ussd_account_connection_id')
                ->groupBy('ussd_account_connections.ussd_account_id', 'ussd_account_connections.app_id')
                ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
                ->join('apps', 'apps.id', '=', 'ussd_account_connections.app_id')
                ->get();

            self::$activeAppConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'app_id');

        }

        return self::$activeAppConnections;
    }

    /**
     *  Get the inactive app connections grouped by app names and totals
     */
    public static function getInactiveAppConnections($duration = 1)
    {
        if( is_null(self::$inactiveAppConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "ussd_sessions"
             *  so that we can collect the sessions of each "ussd_account_connection" record.
             *  Then using the havingRaw(), we can select "ussd_account_connections" having
             *  sessions that were not created recently. The groupBy() will be useful to
             *  group the results so that we can determine the MAX date of the sessions
             *  foreach "ussd_account_connection" making it possible to know whether
             *  the "ussd_account_connection" has a session recently created. We
             *  must also join to the "apps" so that we can collect the
             *  "ussd_account_connections" app name. The select() will
             *  then narrow down the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select('apps.name', 'ussd_account_connections.app_id', 'ussd_account_connections.ussd_account_id', DB::raw("MAX(ussd_sessions.updated_at) as last_active_at"))
                ->join('ussd_sessions', 'ussd_account_connections.id', '=', 'ussd_sessions.ussd_account_connection_id')
                ->groupBy('ussd_account_connections.ussd_account_id', 'ussd_account_connections.app_id')
                ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
                ->join('apps', 'apps.id', '=', 'ussd_account_connections.app_id')
                ->get();

            self::$inactiveAppConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'app_id');

        }

        return self::$inactiveAppConnections;
    }

    /**
     *  Return the total account-to-app connections
     */
    public static function getAppConnectionsTotalReport()
    {
        $total = self::getAppConnections()->sum('total');
        return self::prepareOverviewReport($total, false, false);
    }

    /**
     *  Return the total active account-to-app connections
     */
    public static function getActiveAppConnectionsTotalReport($withComparison = true)
    {
        $comparisionTotal = $withComparison ? self::getAppConnectionsTotalReport()->total : null;
        $total = self::getActiveAppConnections()->sum('total');

        return self::prepareOverviewReport($total, false, $withComparison, $comparisionTotal);
    }

    /**
     *  Return the total inactive account-to-app connections
     */
    public static function getInactiveAppConnectionsTotalReport($withComparison = true)
    {
        $comparisionTotal = $withComparison ? self::getAppConnectionsTotalReport()->total : null;
        $total = self::getInActiveAppConnections()->sum('total');

        return self::prepareOverviewReport($total, false, $withComparison, $comparisionTotal);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the account-to-app connections
     */
    public static function getAppConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getAppConnections(), 'total', 'name', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the active account-to-app connections
     */
    public static function getActiveAppConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getActiveAppConnections(), 'total', 'name', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the inactive account-to-app connections
     */
    public static function getInactiveAppConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getInactiveAppConnections(), 'total', 'name', $limitResults);
    }


    /*****************************************
     *  Account-Version Connections Reports  *
     ****************************************/

    /**
     *  Get the version connections grouped by version numbers and totals
     */
    public static function getVersionConnections()
    {
        if( is_null(self::$versionConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "versions"
             *  so that we can collect the "ussd_account_connections" version number. we
             *  must then join to the "apps" so that we can collect the app name. We
             *  then groupBy() the "apps.name", "ussd_account_id" and "version_id"
             *  so that we can derive the available connections between users and
             *  versions. The select() will then narrow down the results to what
             *  we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select(DB::raw("CONCAT(name, ' (v ' , number, ')') AS name"), 'ussd_account_connections.version_id', 'ussd_account_connections.ussd_account_id')
                ->groupBy('apps.name', 'ussd_account_connections.ussd_account_id', 'ussd_account_connections.version_id')
                ->join('versions', 'versions.id', '=', 'ussd_account_connections.version_id')
                ->join('apps', 'apps.id', '=', 'ussd_account_connections.app_id')
                ->get();

            self::$versionConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'version_id');

        }

        return self::$versionConnections;
    }

    /**
     *  Get the active version connections grouped by version names and totals
     */
    public static function getActiveVersionConnections($duration = 1)
    {
        if( is_null(self::$activeVersionConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "ussd_sessions"
             *  so that we can collect the sessions of each "ussd_account_connection" record.
             *  Then using the havingRaw(), we can select "ussd_account_connections" having
             *  sessions that were created recently. The groupBy() will be useful to group
             *  the results so that we can determine the MAX date of the sessions foreach
             *  "ussd_account_connection" making it possible to know whether the
             *  "ussd_account_connection" has a session recently created. We
             *  must also join to the "versions" and "apps" so that we can
             *  collect the "ussd_account_connections" app name as well as
             *  the version number. The select() will then narrow down
             *  the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
                ->select(DB::raw("CONCAT(name, ' (v ' , number, ')') AS name"), 'ussd_account_connections.version_id', 'ussd_account_connections.ussd_account_id', DB::raw("MAX(ussd_sessions.updated_at) as last_active_at"))
                ->groupBy('apps.name', 'ussd_account_connections.ussd_account_id', 'ussd_account_connections.version_id')
                ->join('ussd_sessions', 'ussd_account_connections.id', '=', 'ussd_sessions.ussd_account_connection_id')
                ->havingRaw('MAX(ussd_sessions.updated_at) >= ?', [Carbon::now()->subDays($duration)])
                ->join('versions', 'versions.id', '=', 'ussd_account_connections.version_id')
                ->join('apps', 'apps.id', '=', 'ussd_account_connections.app_id')
                ->get();

            self::$activeVersionConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'version_id');

        }

        return self::$activeVersionConnections;
    }

    /**
     *  Get the inactive version connections grouped by version names and totals
     */
    public static function getInactiveVersionConnections($duration = 1)
    {
        if( is_null(self::$inactiveVersionConnections) ) {

            /**
             *  Starting with the "ussd_account_connections", we must join to the "ussd_sessions"
             *  so that we can collect the sessions of each "ussd_account_connection" record.
             *  Then using the havingRaw(), we can select "ussd_account_connections" having
             *  sessions that were not created recently. The groupBy() will be useful to
             *  group the results so that we can determine the MAX date of the sessions
             *  foreach "ussd_account_connection" making it possible to know whether
             *  the "ussd_account_connection" has a session recently created. We
             *  must also join to the "versions" and "apps" so that we can
             *  collect the "ussd_account_connections" app name as well as
             *  the version number. The select() will then narrow down
             *  the results to what we care about.
             */
            $queryCollection = resolve(UssdAccountConnection::class)
            ->select(DB::raw("CONCAT(name, ' (v ' , number, ')') AS name"), 'ussd_account_connections.version_id', 'ussd_account_connections.ussd_account_id', DB::raw("MAX(ussd_sessions.updated_at) as last_active_at"))
            ->groupBy('apps.name', 'ussd_account_connections.ussd_account_id', 'ussd_account_connections.version_id')
            ->join('ussd_sessions', 'ussd_account_connections.id', '=', 'ussd_sessions.ussd_account_connection_id')
            ->havingRaw('MAX(ussd_sessions.updated_at) < ?', [Carbon::now()->subDays($duration)])
            ->join('versions', 'versions.id', '=', 'ussd_account_connections.version_id')
            ->join('apps', 'apps.id', '=', 'ussd_account_connections.app_id')
            ->get();

            self::$inactiveVersionConnections = self::groupRelatedRecordsIntoTotals($queryCollection, 'version_id');

        }

        return self::$inactiveVersionConnections;
    }

    /**
     *  Return the total account-to-version connections
     */
    public static function getVersionConnectionsTotalReport()
    {
        $total = self::getVersionConnections()->sum('total');
        return self::prepareOverviewReport($total, false, false);
    }

    /**
     *  Return the total active account-to-version connections
     */
    public static function getActiveVersionConnectionsTotalReport($withComparison = true)
    {
        $comparisionTotal = $withComparison ? self::getVersionConnectionsTotalReport()->total : null;
        $total = self::getActiveVersionConnections()->sum('total');

        return self::prepareOverviewReport($total, false, $withComparison, $comparisionTotal);
    }

    /**
     *  Return the total inactive account-to-version connections
     */
    public static function getInactiveVersionConnectionsTotalReport($withComparison = true)
    {
        $comparisionTotal = $withComparison ? self::getVersionConnectionsTotalReport()->total : null;
        $total = self::getInActiveVersionConnections()->sum('total');

        return self::prepareOverviewReport($total, false, $withComparison, $comparisionTotal);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the account-to-version connections
     */
    public static function getVersionConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getVersionConnections(), 'total', 'name', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the active account-to-version connections
     */
    public static function getActiveVersionConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getActiveVersionConnections(), 'total', 'name', $limitResults);
    }

    /**
     *  Return the X and Y values to draw a column chart
     *  of the inactive account-to-version connections
     */
    public static function getInactiveVersionConnectionsColumnChartReport()
    {
        $limitResults = self::getColumnChartLimit();
        return self::setXandYaxis(self::getInactiveVersionConnections(), 'total', 'name', $limitResults);
    }









    /**
     *  Return the column chart limit (Bars per column chart)
     */
    public static function getColumnChartLimit()
    {
        return 10;
    }

    /**
     *  @param Illuminate\Database\Eloquent\Builder | Illuminate\Database\Eloquent\Model $model
     */
    public static function prepareOverviewReport($model, $filterByDate, $withComparison, $comparisonTotal = null)
    {
        $obj = new stdClass;

        $obj->total = $filterByDate ? self::filterByDateConstraints($model)->count() : (is_numeric($model) ? $model : $model->count());

        if( $withComparison ) {

            if( $comparisonTotal === null ) {

                $obj->comparison_total = $filterByDate ? self::filterComparisonDateConstraints($model)->count() : $model->count();

                //  Calculate the percentage increase or decrease
                $obj->comparison_percentage = $obj->comparison_total > 0 ? round( ($obj->total - $obj->comparison_total) / $obj->comparison_total * 100, 1 ) : 0;

            }else{

                $obj->comparison_total = $comparisonTotal;

                //  Calculate the percentage
                $obj->comparison_percentage = $obj->comparison_total > 0 ? round( $obj->total / $obj->comparison_total * 100, 1 ) : 0;

            }

            //  If we have a percentage increase calculated within this function (not passed as the $comparisonTotal parameter) then show the positive arrow
            $obj->show_positive_arrow = $comparisonTotal === null && ($obj->comparison_percentage > 0);

            //  If we have a percentage decrease calculated within this function (not passed as the $comparisonTotal parameter) then show the negative arrow
            $obj->show_negative_arrow = $comparisonTotal === null && ($obj->comparison_percentage < 0);

            //  Make  sure that the percentage decrease is positive
            $obj->comparison_percentage = $obj->comparison_percentage >= 0 ? $obj->comparison_percentage : ($obj->comparison_percentage * -1);

        }

        return $obj;
    }

    /**
     *  Group related connections into totals
     *
     *  @param Collection $queryCollection
     *  @param Integer $groupingId
     *
     *  Example: convert the following
     *
     *  $queryCollection = [
     *      [
     *          'name' => 'Project 1',
     *          'project_id' => 1
     *      ],
     *      [
     *          'name' => 'Project 1',
     *          'project_id' => 1
     *      ],
     *      [
     *          'name' => 'Project 2',
     *          'project_id' => 2
     *      ]
     *  ]
     *
     *  return [
     *      [
     *          'name' => 'Project 1',
     *          'project_id' => 1,
     *          'total' => 2
     *      ],
     *      [
     *          'name' => 'Project 2',
     *          'project_id' => 2,
     *          'total' => 1
     *      ]
     *  ]
     *
     *  Note that the $groupingId can represent the key
     *  that indicates what to group based on
     */
    public static function groupRelatedRecordsIntoTotals($queryCollection, $groupingId)
    {
        $collection = $queryCollection->groupBy($groupingId)->map(function ($group) {

            //  Get the first record of the group
            $record = $group->first();

            //  Set the total of the group items on the first record as the "total"
            $record->total = $group->count();

            //  Return the modified record containing the "total"
            return $record;

        });

        //  Sort and return the grouped records
        return $collection->sortByDesc('total');
    }

    /**
     *  Return the data as an array of values to
     *  plot a chart with x-axis and y-axis
     */
    public static function setXandYaxis($results, $pluckX, $pluckY, $limitResults = null)
    {
        /**
         *  return [
         *      'y-axis' => ['App 1', 'App 2', 'App 3', ..., 'App 10'],
         *      'x-axis' => [100, 90, 80, ..., 0]
         *  ]
         */
        $xAxis = collect($results)->pluck($pluckX);
        $yAxis = collect($results)->pluck($pluckY);

        //  Check if we want to limit the results
        if( is_integer($limitResults) ) {

            $xAxis = $xAxis->take($limitResults);
            $yAxis = $yAxis->take($limitResults);
        }

        return [
            'x-axis' => $xAxis->toArray(),
            'y-axis' => $yAxis->toArray()
        ];
    }

    /*******************************************
     *  Filtering Methods For Date Constraits  *
     ******************************************/

    public static function getDateConstraints()
    {
        $type = self::getDateType();

        if( $type === 'today' ) {

            return self::todayDateConstraints();

        }else if( $type === 'yesterday' ) {

            return self::yesterdayDateConstraints();

        }else if( $type === 'this week' ) {

            return self::thisWeekDateConstraints();

        }else if( $type === 'this month' ) {

            return self::thisMonthDateConstraints();

        }else if( $type === 'this year' ) {

            return self::thisYearDateConstraints();

        }else if( $type === 'last 7 days' ) {

            return self::last7DaysDateConstraints();

        }else if( $type === 'last 14 days' ) {

            return self::last14DaysDateConstraints();

        }else if( $type === 'last 30 days' ) {

            return self::last30DaysDateConstraints();

        }else if( $type === 'last 60 days' ) {

            return self::last60DaysDateConstraints();

        }else if( $type === 'last 90 days' ) {

            return self::last90DaysDateConstraints();

        }else if( $type === 'last week' ) {

            return self::lastWeekDateConstraints();

        }else if( $type === 'last month' ) {

            return self::lastMonthDateConstraints();

        }else if( $type === 'last year' ) {

            return self::lastYearDateConstraints();

        }else if( $type === '2 years ago' ) {

            return self::last2YearsDateConstraints();

        }else if( $type === '3 years ago' ) {

            return self::last3YearsDateConstraints();

        }else if( $type === 'custom' ) {

            return self::customDateConstraints();

        }else{

            /**
             *  Return a tomorrow date so that we can never
             *  get results if we reach this point
             */
            return self::tomorrowDateConstraints();

        }
    }

    public static function getComparisonDateConstraints()
    {
        $type = self::getComparisonDateType();

        if( $type === 'yesterday' ) {

            return self::yesterdayDateConstraints();

        }else if( $type === '2 days ago' ) {

            return self::twoDaysAgoDateConstraints();

        }else if( $type === 'last week' ) {

            return self::lastWeekDateConstraints();

        }else if( $type === 'last month' ) {

            return self::lastMonthDateConstraints();

        }else if( $type === 'last year' ) {

            return self::lastYearDateConstraints();

        }else if( $type === '14 - 7 days ago' ) {

            return self::last14To7DaysDateConstraints();

        }else if( $type === '28 - 14 days ago' ) {

            return self::last28To14DaysDateConstraints();

        }else if( $type === '60 - 30 days ago' ) {

            return self::last60To30DaysDateConstraints();

        }else if( $type === '120 - 60 days ago' ) {

            return self::last120To60DaysDateConstraints();

        }else if( $type === '180 - 90 days ago' ) {

            return self::last180To90DaysDateConstraints();

        }else if( $type === '2 weeks ago' ) {

            return self::twoWeeksAgoDateConstraints();

        }else if( $type === '2 months ago' ) {

            return self::twoMonthsAgoDateConstraints();

        }else if( $type === '2 years ago' ) {

            return self::twoYearsAgoDateConstraints();

        }else if( $type === '4 - 2 years ago' ) {

            return self::last4To2YearsDateConstraints();

        }else if( $type === '6 - 3 years ago' ) {

            return self::last6To3YearsDateConstraints();

        }else if( $type === 'custom' ) {

            //  return self::customDateConstraints();
            //  $endDate = self::customDateConstraints()->end;

        }else{

            /**
             *  Return a tomorrow date so that we can never
             *  get results if we reach this point
             */
            return self::tomorrowDateConstraints();

        }

    }

    public static function filterByDateConstraints($model, $filterBy = 'created_at')
    {
        return $model->where($filterBy, '>=', self::getDateConstraints()->start)
                     ->where($filterBy, '<=', self::getDateConstraints()->end);
    }

    public static function filterComparisonDateConstraints($model)
    {
        return $model->where('created_at', '>=', self::getComparisonDateConstraints()->start)
                     ->where('created_at', '<=', self::getComparisonDateConstraints()->end);
    }

    public static function tomorrowDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Tomorrow';
        $obj->start = Carbon::tomorrow();   //  2022-08-02 00:00:00
        $obj->end = Carbon::tomorrow();     //  2022-08-02 00:00:00
        return $obj;
    }

    public static function todayDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Today';
        $obj->start = Carbon::today();   //  2022-08-01 00:00:00
        $obj->end = Carbon::now();       //  2022-08-01 14:30:45
        return $obj;
    }

    public static function yesterdayDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Yesterday';
        $obj->start = Carbon::yesterday();               //  2022-08-01 00:00:00
        $obj->end = Carbon::yesterday()->endOfDay();     //  2022-08-01 23:59:59
        return $obj;
    }

    public static function thisWeekDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'This week';
        $obj->start = Carbon::today()->startOfWeek();    //  2022-06-01 00:00:00 (Monday)
        $obj->end = Carbon::now();                       //  2022-06-04 14:30:45 (Thursday)
        return $obj;
    }

    public static function thisMonthDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'This month';
        $obj->start = Carbon::today()->startOfMonth();   //  2022-06-01 00:00:00 (August - Monday)
        $obj->end = Carbon::now();                       //  2022-06-04 14:30:45 (August - Thursday)
        return $obj;
    }

    public static function thisYearDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'This year';
        $obj->start = Carbon::today()->startOfYear();    //  2022-01-01 00:00:00 (2022 January - Saturday)
        $obj->end = Carbon::now();                       //  2022-06-04 14:30:45 (2022 August - Tuesday)
        return $obj;
    }

    public static function last7DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 7 days';
        $obj->start = Carbon::now()->subDays(7)->startOfDay();      //  2022-06-01 00:00:00
        $obj->end = Carbon::now();                                  //  2022-06-08 14:30:45
        return $obj;
    }

    public static function last14DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 14 days';
        $obj->start = Carbon::now()->subDays(14)->startOfDay();      //  2022-06-01 00:00:00
        $obj->end = Carbon::now();                                   //  2022-06-15 14:30:45
        return $obj;
    }

    public static function last30DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 30 days';
        $obj->start = Carbon::now()->subDays(30)->startOfDay();     //  2022-05-31 00:00:00
        $obj->end = Carbon::now();                                  //  2022-06-30 14:30:45
        return $obj;
    }

    public static function last60DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 60 days';
        $obj->start = Carbon::now()->subDays(60)->startOfDay();     //  2022-05-01 00:00:00
        $obj->end = Carbon::now();                                  //  2022-06-30 14:30:45
        return $obj;
    }

    public static function last90DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 90 days';
        $obj->start = Carbon::now()->subDays(90)->startOfDay();     //  2022-04-01 00:00:00
        $obj->end = Carbon::now();                                  //  2022-06-30 14:30:45
        return $obj;
    }

    public static function lastWeekDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last week';
        $obj->start = Carbon::now()->startOfWeek()->subWeek();
        $obj->end = Carbon::now()->subWeek()->endOfWeek();
        return $obj;
    }

    public static function lastMonthDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last month';
        $obj->start = Carbon::now()->startOfMonth()->subMonthsNoOverflow();
        $obj->end = Carbon::now()->subMonthsNoOverflow()->endOfMonth();
        return $obj;
    }

    public static function lastYearDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last year';
        $obj->start = Carbon::now()->startOfYear()->subYearNoOverflow();
        $obj->end = Carbon::now()->subYearNoOverflow()->endOfYear();
        return $obj;
    }

    public static function last2YearsDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 2 years';
        $obj->start = Carbon::now()->startOfYear()->subYearsNoOverflow(2);
        $obj->end = Carbon::now()->subYearsNoOverflow(2)->endOfYear();
        return $obj;
    }

    public static function last3YearsDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 3 years';
        $obj->start = Carbon::now()->startOfYear()->subYearsNoOverflow(3);
        $obj->end = Carbon::now()->subYearsNoOverflow(3)->endOfYear();
        return $obj;
    }

    public static function customDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Custom range';
        $obj->start = Carbon::parse(request()->start_date);
        $obj->end = Carbon::parse(request()->end_date);
        return $obj;
    }

    /******************************************************
     *  Filtering Methods For Comparison Date Constraits  *
     *****************************************************/

    public static function twoDaysAgoDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = '2 days ago';
        $obj->start = Carbon::now()->startOfDay()->subDays(2);
        $obj->end = Carbon::now()->subDays(2)->endOfDay();
        return $obj;
    }

    public static function twoWeeksAgoDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = '2 weeks ago';
        $obj->start = Carbon::now()->startOfWeek()->subWeeks(2);
        $obj->end = Carbon::now()->subWeeks(2)->endOfWeek();
        return $obj;
    }

    public static function twoMonthsAgoDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = '2 months ago';
        $obj->start = Carbon::now()->startOfMonth()->subMonths(2);
        $obj->end = Carbon::now()->subMonths(2)->endOfMonth();
        return $obj;
    }

    public static function twoYearsAgoDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = '2 years ago';
        $obj->start = Carbon::now()->startOfYear()->subYears(2);
        $obj->end = Carbon::now()->subYears(2)->endOfYear();
        return $obj;
    }

    public static function last14To7DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 14 to 7 days ago';
        $obj->start = Carbon::now()->subDays(14)->startOfDay();
        $obj->end = Carbon::now()->subDays(7)->endOfDay();
        return $obj;
    }

    public static function last28To14DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 28 to 14 days ago';
        $obj->start = Carbon::now()->subDays(28)->startOfDay();
        $obj->end = Carbon::now()->subDays(14)->endOfDay();
        return $obj;
    }

    public static function last60To30DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 60 to 30 days ago';
        $obj->start = Carbon::now()->subDays(60)->startOfDay();
        $obj->end = Carbon::now()->subDays(30)->endOfDay();
        return $obj;
    }

    public static function last120To60DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 120 to 60 days ago';
        $obj->start = Carbon::now()->subDays(120)->startOfDay();
        $obj->end = Carbon::now()->subDays(60)->endOfDay();
        return $obj;
    }

    public static function last180To90DaysDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 180 to 90 days ago';
        $obj->start = Carbon::now()->subDays(180)->startOfDay();
        $obj->end = Carbon::now()->subDays(90)->endOfDay();
        return $obj;
    }

    public static function last4To2YearsDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 4 to 2 years ago';
        $obj->start = Carbon::now()->subYears(4)->startOfYear();
        $obj->end = Carbon::now()->subYears(2)->endOfYear();
        return $obj;
    }

    public static function last6To3YearsDateConstraints()
    {
        $obj = new stdClass;
        $obj->name = 'Last 6 to 3 years ago';
        $obj->start = Carbon::now()->subYears(6)->startOfYear();
        $obj->end = Carbon::now()->subYears(3)->endOfYear();
        return $obj;
    }

    /**
     *  Return the X and Y values to draw a line chart
     *  of the results grouped by date constraints
     *
     *  @param Illuminate\Support\Collection | Illuminate\Database\Eloquent\Collection $collection
     */
    public static function groupByDateConstraints($collection, $groupBy = 'created_at')
    {
        $type = self::getDateType();

        if( in_array($type, ['today', 'yesterday']) ) {

            //  Group by hours (13:00)
            $collection = $collection->groupBy(function ($record) use ($groupBy) {
                return Carbon::parse($record->$groupBy)->format('H:00');
            });

            $hoursOfDay = [
                '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
                '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
            ];

            $collectionInOrder = [];

            //  Set missing hours to Zero / Set correct order of hours
            for ($x = 0; $x < count($hoursOfDay); ++$x) {

                $hourOfDay = $hoursOfDay[$x];

                if (isset($collection[$hourOfDay])) {
                    $collectionInOrder[$hourOfDay] = $collection[$hourOfDay];
                }else{
                    $collectionInOrder[$hourOfDay] = 0;
                }
            }

            $collection = $collectionInOrder;

        }else if( in_array($type, ['this week', 'last week']) ) {

            //  Group by day name (Friday)
            $collection = $collection->groupBy(function ($record) use ($groupBy) {
                return Carbon::parse($record->$groupBy)->dayName;
            });

            $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            $collectionInOrder = [];

            //  Set missing days of the week to Zero / Set correct order of days of the week
            for ($x = 0; $x < count($daysOfWeek); ++$x) {

                $dayOfWeek = $daysOfWeek[$x];

                if (isset($collection[$dayOfWeek])) {
                    $collectionInOrder[$dayOfWeek] = $collection[$dayOfWeek];
                }else{
                    $collectionInOrder[$dayOfWeek] = 0;
                }
            }

            $collection = $collectionInOrder;

        }else if( in_array($type, ['this month', 'last month']) ) {

            //  Group by day of month (01)
            $collection = $collection->groupBy(function ($record) use ($groupBy) {
                return Carbon::parse($record->$groupBy)->day;
            });

            $daysOfMonth = [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
                '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
            ];

            $collectionInOrder = [];

            //  Set missing days of the month to Zero / Set correct order of days of the month
            for ($x = 0; $x < count($daysOfMonth); ++$x) {

                $dayOfMonth = $daysOfMonth[$x];

                if (isset($collection[$dayOfMonth])) {
                    $collectionInOrder[$dayOfMonth] = $collection[$dayOfMonth];
                }else{
                    $collectionInOrder[$dayOfMonth] = 0;
                }
            }

            $collection = $collectionInOrder;

        }else if( in_array($type, ['this year', 'last year', '2 years ago', '3 years ago']) ) {

            //  Group by month name (January)
            $collection = $collection->groupBy(function ($record) use ($groupBy) {
                return Carbon::parse($record->$groupBy)->monthName;
            });

            $monthsOfYear = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ];

            $collectionInOrder = [];

            //  Set missing months to Zero / Set correct order of months
            for ($x = 0; $x < count($monthsOfYear); ++$x) {

                $monthOfYear = $monthsOfYear[$x];

                if (isset($collection[$monthOfYear])) {
                    $collectionInOrder[$monthOfYear] = $collection[$monthOfYear];
                }else{
                    $collectionInOrder[$monthOfYear] = 0;
                }
            }

            $collection = $collectionInOrder;

        }else if( in_array($type, ['last 7 days', 'last 14 days', 'last 30 days', 'last 60 days', 'last 90 days']) ) {

            if($type == 'last 7 days' ) {
                $startCreatedAt = Carbon::now()->subDays(6)->startOfDay();
            }else if($type == 'last 14 days' ) {
                $startCreatedAt = Carbon::now()->subDays(13)->startOfDay();
            }else if($type == 'last 30 days' ) {
                $startCreatedAt = Carbon::now()->subDays(29)->startOfDay();
            }else if($type == 'last 60 days' ) {
                $startCreatedAt = Carbon::now()->subDays(59)->startOfDay();
            }else if($type == 'last 90 days' ) {
                $startCreatedAt = Carbon::now()->subDays(89)->startOfDay();
            }

            $collectionInOrder = [];
            $endCreatedAt = Carbon::now();
            $listOfDaysInBetweeen = CarbonPeriod::create($startCreatedAt, $endCreatedAt);

            //  If the start and end year is the same
            if($startCreatedAt->year === $endCreatedAt->year) {

                //  show the day and month
                $format = 'd M';
            }else {

                //  show the day, month and year
                $format = 'd M Y';
            }

            //  Group by month name (01 January 2022)
            $collection = $collection->groupBy(function ($record, $key) use ($groupBy, $format) {
                return Carbon::parse($record->$groupBy)->format($format);
            });

            foreach($listOfDaysInBetweeen as $currentDay) {

                $key = $currentDay->format($format);

                if (isset($collection[$key])) {
                    $collectionInOrder[$key] = $collection[$key];
                }else{
                    $collectionInOrder[$key] = 0;
                }

            }

            $collection = $collectionInOrder;

        }else if( $type === 'custom' ) {

        }else{

        }

        $collection = collect($collection)->map(function ($value) {
            return is_int($value) ? $value : collect($value)->count();
        });

        $collection = collect($collection)->map(function ($date, $total) {

            return ['date' => $date, 'total' => $total];

        })->values();

        return self::setXandYaxis($collection, 'date', 'total');

    }

    /**
     *  Return the X and Y values to draw a line chart
     *  of the results grouped by session count tiers
     *
     *  @param Illuminate\Support\Collection | Illuminate\Database\Eloquent\Collection $collection
     */
    public static function groupByTotalTiers($collection, $target = 'total')
    {
        $tier = [];
        $tiers = [];

        $limits = [
            ...range(10, 90, 10),                   //  tens tiers
            ...range(100, 900, 100),                //  hundreds tiers
            ...range(1000, 9000, 1000),             //  thousands tiers
            ...range(10000, 90000, 10000),          //  ten thousands tiers
            ...range(100000, 900000, 100000),       //  hundred thousands tiers
            ...range(1000000, 9000000, 1000000),    //  millions tiers
        ];

        //  Create the different types of tiers
        foreach($limits as $limit) {

            $start = 0;
            $step = $limit / 10;

            array_push($tiers, range($start, $limit, $step));

        }

        //  Get the maximum total number of sessions
        $maxSessions = collect($collection)->pluck($target)->max();

        //  Select the most suitable tier to accomodate the number of sessions
        collect($tiers)->each(function($currTier) use (&$tier, $maxSessions) {

            //  Get the maximum tier value
            $maxTierValue = collect($currTier)->max();

            /**
             *  Stop iterating through the items by returning false if the total
             *  sessions are less-than or equal-to the maximum tier value.
             *  Capture the current tier as the preffered tier for use.
             */
            if( $maxSessions <= $maxTierValue ) {

                $tier = $currTier;

                return false;

            };

        });

        /**
         *  Determine the step e.g +10 is the step for tier [10, 20, 30 ... 100]
         *  Determine the step e.g +20 is the step for tier [20, 40, 40 ... 200]
         */
        $tierStep = (collect($tier)->max() - collect($tier)->min()) / 10;

        $collection = $collection->groupBy(function ($record, $key) use ($tier, $tierStep, $target) {

            /**
             *  $tier = [10, 20, 30 ... 100];
             *  $tierValue = 0, 10 ... 100;
             *  $tierStep = 10;
             */
            foreach($tier as $tierValue) {

                if($record->$target <= $tierValue) {

                    if( $tierValue > 0 ) {

                        //  If the step is equal to 1
                        if( $tierStep == 1 ) {

                            return 'x = ' . $tierValue;   //  x = 1

                        }else{

                            return $tierValue - $tierStep .' < x ≤ ' . $tierValue;   //  0 < x ≤ 10

                        }

                    }else {

                        return '0';

                    }

                }

            }

        });

        $collection = collect($collection)->map(function ($value) {
            return collect($value)->count();
        });

        $collection = collect($collection)->map(function ($date, $total) {

            return ['date' => $date, 'total' => $total];

        })->values();

        return self::setXandYaxis($collection, 'date', 'total');

    }

    /**
     *  Return the X and Y values to draw a line chart
     *  of the results grouped by lifespan tiers
     *
     *  @param Illuminate\Support\Collection | Illuminate\Database\Eloquent\Collection $collection
     */
    public static function groupByDurationTiers($collection)
    {
        $tier = [];

        $tiers = [
            range(0, 20, 1),                           //  seconds tier by 1 seconds until 20 seconds
            range(0, 40, 2),                           //  seconds tier by 2 seconds until 40 seconds
            range(0, 60, 5),                           //  seconds tier by 5 seconds until 1 minute
            range(0, 10*60, 60),                       //  minutes tier by 1 minute until 10 minutes
            range(0, 30*60, 2*60),                     //  minutes tier by 2 minutes until 30 minutes
            range(0, 60*60, 5*60),                     //  minutes tier by 5 minutes until 1 hour
            range(0, 6*60*60, 30*60),                  //  minutes tier by 30 minutes until 6 hours
            range(0, 24*60*60, 60*60),                 //  hours tier by 1 hour until 24 hours
            range(0, 7*24*60*60, 24*60*60),            //  days tier by 1 day until 7 days
            range(0, 14*24*60*60, 24*60*60),           //  days tier by 1 day until 14 days
            range(0, 21*24*60*60, 24*60*60),           //  days tier by 1 day until 21 days
            range(0, 30*24*60*60, 5*24*60*60),         //  days tier by 5 days until 30 days
            range(0, 365*24*60*60, 365*24*60*60/12),   //  months tier by 1 month until 1 year
            range(0, 50*365*24*60*60, 365*24*60*60),   //  years tier by 1 year until 50 years
        ];

        //  Get the maximum total session duration
        $maxDuration = collect($collection)->pluck('duration')->max();

        //  Select the most suitable tier to accomodate the session duration
        collect($tiers)->each(function($currTier) use (&$tier, $maxDuration) {

            //  Get the maximum tier value
            $maxTierValue = collect($currTier)->max();

            /**
             *  Stop iterating through the items by returning false if the maximum
             *  session duration is less-than or equal-to the maximum tier value.
             *  Capture the current tier as the preffered tier for use.
             */
            if( $maxDuration <= $maxTierValue ) {

                $tier = $currTier;

                return false;

            };

        });

        $format = function($seconds) {

            if($seconds == 1) {
                return '1 sec';
            }else if($seconds < 60) {
                return $seconds . ' secs';
            }else if($seconds == 60) {
                return '1 min';
            }else if($seconds < 60*60) {
                return $seconds/60 . ' mins';
            }else if($seconds == 60*60) {
                return '1 hour';
            }else if($seconds < 24*60*60) {
                return $seconds/60/60 . ' hours';
            }else if($seconds == 24*60*60) {
                return '1 day';
            }else if($seconds < 7*24*60*60) {
                return $seconds/24/60/60 . ' days';
            }else if($seconds == 7*24*60*60) {
                return '1 week';
            }else if($seconds < 14*24*60*60) {
                return $seconds/24/60/60 . ' days';
            }else if($seconds == 14*24*60*60) {
                return '2 weeks';
            }else if($seconds < 21*24*60*60) {
                return $seconds/24/60/60 . ' days';
            }else if($seconds == 21*24*60*60) {
                return '3 weeks';
            }else if($seconds < 365*24*60*60/12) {
                return $seconds/24/60/60 . ' days';
            }else if($seconds == 365*24*60*60/12) {
                return '1 month';
            //  If 2 months to 11 months
            }else if($seconds <= 365*24*60*60/12 * 11) {
                for ($i=2; $i <= 11; $i++) {
                    if( $seconds == 365*24*60*60/12 * $i ) {
                        return $i . ' months';
                    }
                }
            }else if($seconds == 365*24*60*60) {
                return '1 year';
            //  If 2 years to 50 years
            }else if($seconds <= 365*24*60*60 * 50) {
                for ($i=2; $i <= 50; $i++) {
                    if( $seconds <= 365*24*60*60 * $i ) {
                        return $i . ' years';
                    }
                }
            }

        };

        $collection = $collection->groupBy(function ($record, $key) use ($tier, $format) {

            $min = 0;
            $max = 0;

            $duration = $record->duration;

            foreach($tier as $key => $tierValue)
            {
                if( $duration != 0 && $duration <= $tierValue ) {

                    //  Set the current tier value as the maximum limit
                    $max = $tierValue;

                    //  Set the pervious tier value as the minimum limit (if this is not the first value)
                    if( $key > 0) $min = $tier[$key - 1];

                    //  Stop
                    break;

                }
            }

            if( $max > $min ) {

                //  If the maximum session duration is less-than or equal-to 50 years
                if( $max <= 365*24*60*60 * 50 ) {

                    //  If we are incrementing by 1 second
                    if( $max - $min === 1 ) {

                        return 'x = '.$format($max);

                    //  If we are incrementing by more than 1 second e.g 5 seconds
                    }else{

                        return $format($min).' < x ≤ '.$format($max);

                    }

                }else{

                    return 'x > 50 years';

                }
            }else{
                if( $duration == 0 && $max == 0 ) {

                    return 'x = '.$format($max);

                }else{

                    return 'no range';

                }
            }

        });

        $collection = collect($collection)->map(function ($value) {
            return collect($value)->count();
        });

        $collection = collect($collection)->map(function ($date, $total) {

            return ['date' => $date, 'total' => $total];

        })->values();

        return self::setXandYaxis($collection, 'date', 'total');

    }

    /**
     *  Return the date type e.g today, yesterday e.t.c
     */
    public static function getDateType()
    {
        return strtolower(request()->input('date_type') ?? 'today');
    }

    /**
     *  Return the date type e.g yesterday, 2 days ago e.t.c
     */
    public static function getComparisonDateType()
    {
        $type = self::getDateType();

        if( $type === 'today' ) {

            return 'yesterday';

        }else if( $type === 'yesterday' ) {

            return '2 days ago';

        }else if( $type === 'this week' ) {

            return 'last week';

        }else if( $type === 'this month' ) {

            return 'last month';

        }else if( $type === 'this year' ) {

            return 'last year';

        }else if( $type === 'last 7 days' ) {

            return '14 - 7 days ago';

        }else if( $type === 'last 14 days' ) {

            return '28 - 14 days ago';

        }else if( $type === 'last 30 days' ) {

            return '60 - 30 days ago';

        }else if( $type === 'last 60 days' ) {

            return '120 - 60 days ago';

        }else if( $type === 'last 90 days' ) {

            return '180 - 90 days ago';

        }else if( $type === 'last week' ) {

            return '2 weeks ago';

        }else if( $type === 'last month' ) {

            return '2 months ago';

        }else if( $type === 'last year' ) {

            return '2 years ago';

        }else if( $type === '2 years ago' ) {

            return '4 - 2 years ago';

        }else if( $type === '3 years ago' ) {

            return '6 - 3 years ago';

        }else if( $type === 'custom' ) {

            return '';

        }else{

            return '';

        }
    }

    /**
     *  Return the date range text e.g Sep 06 (Today)
     */
    private static function getDateRangeText()
    {
        $type = self::getDateType();
        $range = self::getDateConstraints();

        if( in_array($type, ['today', 'yesterday']) ) {

            $dateRange = $range->start->format('M d');

        }else if( $range->start->year === $range->end->year ) {

            $dateRange = $range->start->format('M d') . ' - ' . $range->end->format('M d');

        }else {

            $dateRange = $range->start->format('M d Y') . ' - ' . $range->end->format('M d Y');

        }

        //  If the range name exists e.g Today, Yesterday, This week, e.t.c append to the date range
        if( $range->name ) $dateRange .= ' (' .  $range->name . ')';

        return $dateRange;
    }

    /**
     *  Return the date range text e.g Sep 05 (Yesterday)
     */
    private static function getDateRangeComparisonText()
    {
        $type = self::getComparisonDateType();
        $range = self::getComparisonDateConstraints();

        if( in_array($type, ['yesterday', '2 days ago']) ) {

            $dateRange = $range->start->format('M d');

        }else if( $range->start->year === $range->end->year ) {

            $dateRange = $range->start->format('M d') . ' - ' . $range->end->format('M d');

        }else {

            $dateRange = $range->start->format('M d Y') . ' - ' . $range->end->format('M d Y');

        }

        //  If the range name exists e.g Today, Yesterday, This week, e.t.c append to the date range
        if( $range->name ) $dateRange .= ' (' .  $range->name . ')';

        return $dateRange;
    }

    private static function primaryHtmlTags($text = '')
    {
        return '<span class="text-blue-500">'.$text.'</span>';
    }

    private static function breakHtmlTags($count = 1)
    {
        return str_repeat('<br/>', $count);
    }

}
