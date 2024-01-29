<?php

namespace App\Services\Ussd;

use Carbon\Carbon;
use App\Models\App;
use GuzzleHttp\Client;
use App\Models\Version;
use App\Models\ShortCode;
use App\Models\UssdAccount;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use App\Models\UssdSession;
use Illuminate\Http\Request;
use App\Models\DatabaseEntry;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Models\UssdAccountConnection;

//  AppWrite Support
use \Appwrite\AppwriteException;
use \Appwrite\ID as AppWriteID;
use \Appwrite\Query as AppWriteQuery;
use \Appwrite\Client as AppWriteClient;
use \Appwrite\Services\Users as AppWriteUsers;
use \Appwrite\Services\Teams as AppwriteTeams;
use Appwrite\Services\Storage as AppwriteStorage;
use \Appwrite\Services\Databases as AppwriteDatabases;
use \Appwrite\Services\Functions as AppwriteFunctions;
use Exception;

class UssdService
{
    public $app;
    public $msg;
    public $text;
    public $event;
    public $screen;
    public $app_id;
    public $msisdn;
    public $version;
    public $builder;
    public $display;
    public $screens;
    public $request;
    public $app_name;
    public $response;
    public $logs = [];
    public $level = 1;
    public $test_mode;
    public $session_id;
    public $event_type;
    public $new_session;
    public $service_code;
    public $request_type;
    public $linked_screen;
    public $mobile_number;
    public $linked_display;
    public $sessionResponse;
    public $display_actions;
    public $display_content;
    public $existing_session;
    public $version_id = null;
    public $reply_records = [];
    public $ussd_account = null;
    public $api_response = null;
    public $user_response = null;
    public $fatal_error = false;
    public $summarized_logs = [];
    public $chained_screens = [];
    public $pagination_index = 0;
    public $display_instructions;
    public $chained_displays = [];
    public $current_user_response;
    public $url_query_params = [];
    public $fatal_error_msg = null;
    public $screen_repeats = false;
    public $ussd_service_code_type;
    public $navigation_step_number;
    public $navigation_request_type;
    public $start_session_memory = 0;
    public $timeout_limit_in_seconds;
    public $event_request_type = null;
    public $dynamic_data_storage = [];
    public $screen_total_responses = [];
    public $navigation_target_screen_id;
    public $display_total_responses = [];
    public $session_execution_times = [];
    public $is_revisting_session = false;
    public $requestXmlToJsonOutput = null;
    public $global_variables_to_save = [];
    public $ussd_account_connection = null;
    public $start_session_execution_time = 0;
    public $chained_screen_metadata = ['text' => ''];
    public $chained_display_metadata = ['text' => ''];
    public $allow_dynamic_content_highlighting = true;
    public $default_no_select_options_message = 'No options available';
    public $default_technical_difficulties_message = 'Sorry, we are experiencing technical difficulties';
    public $default_incorrect_option_selected_message = 'You selected an incorrect option. Go back and try again';

    public function __construct(Request $request)
    {
        //  Set the request
        $this->request = $request;
    }

    /***********************************************************
     *
     *
     *
     *
     *  REMOVE THE $this->text completely
     *
     *  ONLY USE IT TO SAVE A RECORD IN DB
     *
     *  OTHERWISE IT IS GOING TO CONFUSE US IN THE FUTURE!!!!
     *
     *
     *
     ***********************************************************/

    /** Start setting up the USSD configurations,
     *  session and build process.
     */
    public function setup()
    {
        /* Example Request (From USSD Gateway)
         *
         *  <ussd>
         *      <msisdn>M</msisdn>
         *      <sessionid>S</sessionid>
         *      <type>T</type>
         *      <msg>MSG</msg>
         *  </ussd>
         *
         *  Example Response (From Third Party Application)
         *
         *  <ussd>
         *      <type>T</type>
         *      <msg>MSG</msg>
         *      <premium>
         *          <cost>C</cost>
         *          <ref>R</ref>
         *      </premium>
         *  </ussd>
         */

        /* Parameters description:
         *
         * ------|--------------------|---------------------------------------------------------------------|
         * CODE  |   PARAMETER  NAME  |   DESCRIPTION                                                       |
         * ------|--------------------|---------------------------------------------------------------------|
         *   M   |   Msisdn           |   Msisdn of USSD subscriber e.g 26776570551                         |
         * ------|--------------------|---------------------------------------------------------------------|
         *   S   |   Session ID       |   Session id Unique session id number                               |
         * ------|--------------------|---------------------------------------------------------------------|
         *   T   |   Request type     |   Request type Description in the next table                        |
         * ------|--------------------|---------------------------------------------------------------------|
         *   MSG |   Message          |   USSD message to be delivered to the subscriber                    |
         * ------|--------------------|---------------------------------------------------------------------|
         *   C   |   Cost             |   Cost Extra cost to be charged to the user                         |
         * ------|--------------------|---------------------------------------------------------------------|
         *   R   |   Cost reference   |   Cost reference Unique value as charge reference                   |
         * ------|--------------------|---------------------------------------------------------------------|
         */

        /* Message type codes:
         *
         * ------|----------|-------------------------|-----------------------------------------------------|
         * CODE  |   VALUE  |     VALUE SENT BY       |   DESCRIPTION                                       |
         * ------|----------|-------------------------|-----------------------------------------------------|
         *       |          | UMB | Service Provider  |                                                     |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         *   1   | REQUEST  |  x  |                   |  New USSD request                                   |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         *   2   | RESPONSE |  x  |        x          |  Response in already existing session               |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         *   3   | RELEASE  |  x  |        x          |  End of session.                                    |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         *   4   | TIMEOUT  |  x  |                   |  Session timeout – USSD subscriber failed to        |
         *       |          |     |                   |  provide answer within time limit                   |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         *   5   | REDIRECT |     |        x          |  Redirect the request to another service provider.  |
         *       |          |     |                   |  MSG field contains USSD code to redirect to.       |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         *  10   | CHARGE   |  x  |                   |  Premium rate charge failed. MSG part contains      |
         *       |          |     |                   |  error description                                  |
         * ------|----------|-----|-------------------|-----------------------------------------------------|
         */

        /*  HANDLE REQUEST   */

        //  Get the start request memory usage
        $this->start_session_memory = memory_get_usage();

        //  Get the start request execution time
        $this->start_session_execution_time = microtime(true);

        //  Store the Ussd Gateway values
        $this->storeUssdGatewayValues();

        //  Handle the Ussd Session request
        $this->handleSessionRequest();

        //  Get the difference in seconds between the start and end request time
        $session_execution_time = $this->calculateSessionExecutionTime();

        $this->logInfo(
            'Total execution time: '.
             $this->wrapAsSuccessHtml($session_execution_time.
            ($session_execution_time == 1 ? ' second' : ' seconds'))
        );

        $memoryUsageInMegabytes = $this->calculateSessionMemoryUsage();

        $this->logInfo('Total memory usage: '.$this->wrapAsSuccessHtml($memoryUsageInMegabytes));

        //  Handle the Ussd Session response
        $response = $this->handleSessionResponse();

        //  Return the response
        return $response;
    }

    /** Store the USSD Gateway values required to perform the
     *  service. This includes the USSD message, phone number,
     *  session id, request type e.t.c.
     */
    public function storeUssdGatewayValues()
    {
        //  Get the "TEST MODE" status
        $this->test_mode = ($this->request->get('test_mode') == 'true' || $this->request->get('test_mode') == '1') ? true : false;

        if ($this->test_mode) {

            //  Get the "Message"
            $this->msg = $this->request->get('msg');

            //  Get the "Msisdn"
            $this->msisdn = $this->request->get('msisdn');

            //  Set the "Mobile Number"
            $this->mobile_number = preg_replace("/^267/", "$1", $this->msisdn);

            //  Get the "Session ID"
            $this->session_id = $this->request->get('session_id');

            //  Get the "Request Type"
            $this->request_type = $this->request->get('request_type');

            //  Get the app "Version ID" to target
            $this->version_id = $this->request->get('version_id');

        } else {

            //  Get the xml content from the request
            $xml = $this->request->getContent();

            //  Convert the XML string into an SimpleXMLElement object.
            $xmlObject = simplexml_load_string($xml);

            //  Encode the SimpleXMLElement object into a JSON string.
            $requestXmlToJsonOutput = json_encode($xmlObject);

            //  Convert it back into an Associative Array
            $jsonArray = json_decode($requestXmlToJsonOutput, true);

            $this->requestXmlToJsonOutput =  $this->convertToString($jsonArray);

            //  Set the "Message"
            $this->msg = $jsonArray['msg'];

            //  Set the "Msisdn"
            $this->msisdn = $jsonArray['msisdn'];

            //  Set the "Mobile Number"
            $this->mobile_number = preg_replace("/^267/", "$1", $this->msisdn);

            //  Set the "Session ID"
            $this->session_id = $jsonArray['sessionid'];

            //  Set the "Request Type"
            $this->request_type = $jsonArray['type'];

        }
    }

    /** Determine if this is a new or existing session, then execute
     *  the relevant methods to further handle the session.
     */
    public function handleSessionRequest()
    {
        /*  If the "Request Type" is equal to "1"
         *  This means a new session must be
         *  started
         */
        if ($this->request_type == '1') {
            //  Handle a new session
            $this->response = $this->handleNewSession();

        /*  If the "Request Type" is equal to "2"
         *  This means a previous session must be
         *  continued
         */
        } elseif ($this->request_type == '2') {
            //  Handle existing session
            $this->response = $this->handleExistingSession();
        }
    }

    /** Start a brand new USSD session
     */
    public function handleNewSession()
    {
        /*  When the "Request Type" is "1", the "Sevice Code" comes embedded
         *  within the "Message" value. When the "Request Type" is "2" the
         *  "Message" contains data from the user.
         */

        //  Get the "Sevice Code" from the "Message" value
        $this->getServiceCodeFromMessage();

        //  Use the USSD Service Code to set the app version
        $setVersionResponse = $this->setVersion();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($setVersionResponse)) {
            return $setVersionResponse;
        }

        //  If the session id was not provided (Usually because we are on test mode)
        if (is_null($this->session_id)) {

            /**
             *  Generate a unique session id, then update the current
             *  session id with the generated session id. We used to
             *  generate the id as follows:
             *
             *  $this->session_id = uniqid('test_').'_'.(Carbon::now())->getTimestamp();
             *
             *  However i prefer using the Laravel UUID method
             */
            $this->session_id = Str::uuid()->toString();

        }

        //  Get the ussd account otherwise create a new one
        if( !($this->ussd_account = $this->getUssdAccountForCurrentVersion()) ) {

            //  Check if the ussd account exist for any other version
            $this->ussd_account = DB::table('ussd_accounts')
                                    ->where('msisdn', $this->msisdn)
                                    ->where('test', $this->test_mode)
                                    ->where('user_id', auth()->user() ? auth()->user()->id : null)->first();

            //  If the account exists (Associate with the current version)
            if( $this->ussd_account ) {

                //  Assign the ussd account to the current version
                DB::table('ussd_account_connections')->insert([
                    'ussd_account_id' => $this->ussd_account->id,
                    'project_id' => $this->app->project_id,
                    'version_id' => $this->version->id,
                    'app_id' => $this->app->id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

            //  If the account does not exist (Create the ussd account and then associate with the current version)
            }else{

                //  Create a new ussd account
                $ussd_account_id = DB::table('ussd_accounts')->insertGetId([
                    'user_id' => auth()->user() ? auth()->user()->id : null,
                    'test' => $this->test_mode,
                    'msisdn' => $this->msisdn,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                //  Associate the ussd account with the current version
                DB::table('ussd_account_connections')->insert([
                    'ussd_account_id' => $ussd_account_id,
                    'project_id' => $this->app->project_id,
                    'version_id' => $this->version->id,
                    'app_id' => $this->app->id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

            }

            //  Get the ussd account that we just created or associated with the current version
            $this->ussd_account = $this->getUssdAccountForCurrentVersion();

        }

        //  Get the ussd account connection associated with the current version
        $this->ussd_account_connection = $this->getUssdAccountConnectionForCurrentVersion();

        //  Handle the current session
        $this->sessionResponse = $this->handleSession();

        /** This will render as: $this->createNewSession()
         *  while being called within a try/catch handler.
         */
        $createResponse = $this->tryCatch('createNewSession');

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($createResponse)) {
            return $createResponse;
        }

        return $this->sessionResponse;
    }

    /**
     * Get the USSD service code embedded within the USSD message
     */
    public function getServiceCodeFromMessage()
    {
        /** Get the "Service Code" embbeded within the "Message" value
         *
         *  e.g *321*3*4*5#.
         *
         *  Depending on the scenerio the first value may be a Shared Ussd
         *  Code or a Dedicated Ussd Code.
         *
         *  -------------------
         *  If this is a Dedicated Ussd Code:
         *
         *  e.g *150*3*4*5#
         *
         *  We need to extract the first value "150" to create "*150#"
         *  which will be used as the "Service Code". The rest of the
         *  value i.e "3*4*5" will be used as the "Message" value.
         *
         *  Therefore
         *
         *  $this->service_code = *150#
         *
         *  $this->msg = 3*4*5
         *
         *  -------------------
         *  If this is a Shared Ussd Code:
         *
         *  e.g *321*3*4*5# or
         *  e.g *321*4*4*5# or
         *  e.g *321*5*4*5#
         *
         *  We need to extract the first value "321" and the second value
         *  to create "*321*3#" or "*321*4#" or "*321*5#" to be used as
         *  the "Service Code". The rest of the value i.e "4*5" will
         *  be used as the "Message" value.
         *
         *  Therefore
         *
         *  $this->service_code = *321*3#
         *
         *  $this->msg = 4*5
         *
         *  ---------------
         *  STEPS
         *  ---------------
         *
         *  First we need to replace the "#" to "*"
         *
         *  *321*3*4*5# becomes *321*3*4*5*
         *
         *  Then we explode into an array using the "*" symbol
         *
         *  $responses = [0=>"", 1=>"321", 2=>"3", 3=>"4", 4=>"5", 5=>""]
         *
         *  Filter to remove any empty values
         *
         *  $responses = [1=>"321", 2=>"3", 3=>"4", 4=>"5"]
         *
         *  Use array_values to re-number the array keys properly
         *
         *  $responses = [0=>"321", 1=>"3", 2=>"4", 3=>"5"]
         *
         *  Use the first value as the service code (if Dedicated Ussd Code) or
         *  the first and second value as the service code (if Shared Ussd Code)
         *
         *  $this->service_code = *150# or *321*3#
         *
         *  To do this we use array_shift(). array_shift() shifts the first value of the array off
         *  and returns it, shortening the array by one element and moving everything down. All
         *  numerical array keys will be modified to start counting from zero while literal
         *  keys won't be affected.
         *
         *  Use the rest of the values as the message. We can do this using the implode() method,
         *  which joins the values using the "*" symbol
         *
         *  $this->msg = 3*4*5
         */

        //  Replace "#" to "*"
        $message = str_replace('#', '*', $this->msg);

        //  Explode into an array using the "*" symbol
        $values = explode('*', $message);

        //  Remove empty values and reset the numerical array keys
        $values = array_values(array_filter($values, function ($value) {
            return $value !== '';
        }));

        /** Get the Shared Service Codes
         *
         *  Use the Query Builder to get the shared service codes instead of Eloquent.
         *  This is so that we can speed up performance. The eloquent alternative
         *  is as follows:.
         *
         *  \App\SharedShortCode::all();
         *
         *  We ran tests to compare the speed of getting the shared short codes using Eloquent
         *  and Query Builder. The results prove that using Query Builder was must faster.
         *  See below speed comparisons:
         *
         *  Eloquent      ->  [0.106, 0.028, 0.047, 0.027, 0.034]
         *  Query Builder ->  [0.002, 0.001, 0.001, 0.001, 0.002]
         *
         *  As seen above, Query Builder performed better
         */

        /**
         *  Get the Short Codes
         *
         *  Attempt to get the short codes from the CACHE otherwise perform a query.
         */
        $short_code_records = Cache::get((new ShortCode())->getCacheName(), function () {

            //  We failed to retrieve from the cache, therefore perform a query
            return (new ShortCode())->findAndCache();

        });

        //  Convert result to an Array e.g ['*200*1*2#','*321#', '*789*1#']
        $short_code_records = collect($short_code_records)->toArray();

        /** Sort by the Shared Short Code length e.g ['*200*1*2#', '*789*1#', '*321#']
         *  We want to sort the shortcodes starting with the longest shortcode
         *  until the shortest shortcode.
         */
        $shared_short_code_records = array_filter($short_code_records, function ($short_code_record) {
            return ($short_code_record->shared_code != '') && !is_null($short_code_record->shared_code);
        });

        $shared_short_code_records = array_values(array_reverse(Arr::sort($shared_short_code_records, function ($shared_short_code_record) {
            return strlen($shared_short_code_record->shared_code);
        })));

        /** Sort by the dedicated Short Code length e.g ['*200*1*2#', '*789*1#', '*321#']
         *  We want to sort the shortcodes starting with the longest shortcode
         *  until the shortest shortcode.
         */
        $dedicated_short_code_records = array_filter($short_code_records, function ($short_code_record) {
            return ($short_code_record->dedicated_code != '') && !is_null($short_code_record->dedicated_code);
        });

        $dedicated_short_code_records = array_values(array_reverse(Arr::sort($dedicated_short_code_records, function ($dedicated_short_code_record) {
            return strlen($dedicated_short_code_record->dedicated_code);
        })));

        /********************************
         *   HANDLE DEDICATED CODES     *
         *******************************/

        // Foreach Dedicated Code e.g *321#, *432#, *543#
        foreach ($dedicated_short_code_records as $key => $dedicated_short_code_record) {
            //  Remove the "*" and "#" symbol from the Dedicated Code of the Main Ussd Service Code e.g from "*321#" to "*321"
            $dedicated_code = str_replace('#', '', $dedicated_short_code_record->dedicated_code);

            //  If the dedicated shortcode is the same at the begining with the dialed shortcode
            if (preg_match('/^'.preg_quote($dedicated_code).'/', $this->msg)) {
                /** Get the remaining message after removing the portion of the Dedicated Short Code
                 *  from the code dialed by the user.
                 *
                 *  User Dialed         *321*1*2#
                 *  Dedicated Short Code   *321*1
                 *  -----------------------------
                 *  Remainder                 *2#
                 *  -----------------------------
                 */
                $remaining_message = preg_replace('/^'.preg_quote($dedicated_code).'/', '', $this->msg);

                //  Replace "#" to "*"
                $remaining_message = str_replace('#', '*', $remaining_message);

                /** Explode into an array using the "*" symbol. If the remaining message is "*1*2#",
                 *  then our values will resolve to the following result:.
                 *
                 *  $values = ['', '2', ''];
                 */
                $values = explode('*', $remaining_message);

                /** Remove empty values and reset the numerical array keys. This will resolve the above
                 *  array to the following result.
                 *
                 *  $values = ['2'];
                 *
                 *  In this case "2" represents the first response by the user to that app.
                 */
                $values = array_values(array_filter($values, function ($value) {
                    return $value !== '';
                }));

                //  Use the Dedicated Code as the Ussd Service Code e.g *321*45#
                $this->service_code = $dedicated_code.'#';

                //  Indicate that this is a Dedicated Service Code
                $this->ussd_service_code_type = 'dedicated';

                //  Get the app id
                $this->app_id = $dedicated_short_code_record->app_id;

                //  Break out of the loop
                break 1;
            }
        }

        /********************************
         *   HANDLE SHARED CODES        *
         *******************************/

        //  If the current Ussd Service Code is not a Shared Service Code (i.e This is a dedicated Service Code)
        if (!$this->ussd_service_code_type) {
            // Foreach Shared Service Code e.g *321#, *432#, *543#
            foreach ($shared_short_code_records as $key => $shared_short_code_record) {
                //  Remove the "*" and "#" symbol from the Shared Service Code of the Main Ussd Service Code e.g from "*321#" to "*321"
                $shared_short_code = str_replace('#', '', $shared_short_code_record->shared_code);

                //  If the shared shortcode is the same at the begining with the dialed shortcode
                if (preg_match('/^'.preg_quote($shared_short_code).'/', $this->msg)) {
                    /** Get the remaining message after removing the portion of the Shared Short Code
                     *  from the code dialed by the user.
                     *
                     *  User Dialed         *321*1*2#
                     *  Shared Short Code   *321*1
                     *  -----------------------------
                     *  Remainder                 *2#
                     *  -----------------------------
                     */
                    $remaining_message = preg_replace('/^'.preg_quote($shared_short_code).'/', '', $this->msg);

                    //  Replace "#" to "*"
                    $remaining_message = str_replace('#', '*', $remaining_message);

                    /** Explode into an array using the "*" symbol. If the remaining message is "*1*2#",
                     *  then our values will resolve to the following result:.
                     *
                     *  $values = ['', '2', ''];
                     */
                    $values = explode('*', $remaining_message);

                    /** Remove empty values and reset the numerical array keys. This will resolve the above
                     *  array to the following result.
                     *
                     *  $values = ['2'];
                     *
                     *  In this case "2" represents the first response by the user to that app.
                     */
                    $values = array_values(array_filter($values, function ($value) {
                        return $value !== '';
                    }));

                    //  Use the Shared Service Code as the Ussd Service Code e.g *321*45#
                    $this->service_code = $shared_short_code.'#';

                    //  Indicate that this is a Shared Service Code
                    $this->ussd_service_code_type = 'shared';

                    //  Get the app id
                    $this->app_id = $shared_short_code_record->app_id;

                    //  Break out of the loop
                    break 1;
                }
            }
        }

        foreach ($values as $user_reply) {
            /***********************************************
             *  SAVE THE USER REPLY TO THE REPLY RECORDS   *
             ***********************************************/

            /* Add of the remaining values as a reply record.
             *  This reply will be recorded to originate from the user
             *  and is a removable reply (Can be deleted by the user)
             */
            $this->addReplyRecord($user_reply, 'user', true);
        }

        //  Use the rest of the values as the message e.g 3*4*5
        $this->user_response = $this->text;

    }

    public function getUssdAccountForCurrentVersion()
    {
        //  Get the database entry matching the given mobile number, mode and version id
        return Cache::get((new UssdAccount())->getCacheName($this->msisdn, $this->test_mode, $this->version->id), function () {

            //  We failed to retrieve from the cache, therefore perform a query
            return (new UssdAccount())->findAndCache($this->msisdn, $this->test_mode, $this->version->id);

        });
    }

    public function getUssdAccountConnectionForCurrentVersion()
    {
        //  Get the database entry matching the given ussd account id and version id
        return Cache::get((new UssdAccountConnection())->getCacheName($this->ussd_account->id, $this->version->id), function () {

            //  We failed to retrieve from the cache, therefore perform a query
            return (new UssdAccountConnection())->findAndCache($this->ussd_account->id, $this->version->id);

        });
    }

    /**
     *  Use the USSD Service Code to set the app version
     */
    public function setVersion()
    {
        //  If we have the app id
        if ($this->app_id) {

            /**
             *  Get the app linked to this app id.
             *
             *  Attempt to get the app from the CACHE otherwise perform a query.
             */
            $this->app = Cache::get((new App())->getCacheName($this->app_id), function () {

                //  We failed to retrieve from the cache, therefore perform a query
                return (new App())->findAndCache($this->app_id);

            });

            //  If the app exists
            if ($this->app) {

                //  If the app has an active version assigned
                if ($this->app->active_version_id) {

                    //  If we are on Test Mode and the Version Id is provided
                    if ($this->test_mode && $this->version_id) {

                        /**
                         *  Get the specified version to simulate
                         *
                         *  Attempt to get the version from the CACHE otherwise perform a query.
                         *  Note that the "getCacheName" is defined within BaseTrait and helps
                         *  us get the correct cache naming convention for our version.
                         */
                        $this->version = Cache::get((new Version())->getCacheName($this->version_id), function () {

                            //  We failed to retrieve from the cache, therefore perform a query
                            return (new Version())->findAndCache($this->version_id);

                        });

                    } else {

                        /**
                         *  Get the app's currently active version
                         *
                         *  Attempt to get the version from the CACHE otherwise perform a query.
                         *  Note that the "getCacheName" is defined within BaseTrait and helps
                         *  us get the correct cache naming convention for our version.
                         */
                        $this->version = Cache::get((new Version())->getCacheName($this->app->active_version_id), function () {

                            //  We failed to retrieve from the cache, therefore perform a query
                            return (new Version())->findAndCache($this->app->active_version_id);

                        });

                    }

                    //  If the version exists
                    if (!$this->version) {
                        //  Return a custom error (The showEndScreen will terminate the session)
                        return $this->showEndScreen('The app "'.$this->app->name.'" could not locate the version to run the service. Please contact the service provider.');
                    }

                    if($this->requestXmlToJsonOutput) {

                        $this->logInfo(
                            'Request XML to JSON output: <br />'.
                            '<div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.
                                $this->wrapAsSuccessHtml($this->requestXmlToJsonOutput).
                            '</div>'
                        );

                    }

                } else {
                    //  Return a custom error (The showEndScreen will terminate the session)
                    return $this->showEndScreen('The app "'.$this->app->name.'" does not have any active version to run the service. Please contact the service provider.');
                }
            } else {
                //  Return a custom error (The showEndScreen will terminate the session)
                return $this->showEndScreen('The app using the shortcode '.$this->service_code.' does not exist anymore. Please contact the service provider.');
            }
        } else {
            //  Return a custom error (The showEndScreen will terminate the session)
            return $this->showEndScreen('The shortcode '.$this->service_code.' does not belong to any app. Please contact the service provider.');
        }
    }

    /** Return the builder's allowed timeout limit in seconds
     */
    public function getTimeoutLimitInSeconds()
    {
        //  Get the timeout limit in seconds e.g "120" to mean "timeout after 120 seconds"
        return $this->version->builder['simulator']['settings']['timeout_limit_in_seconds'];
    }

    /** Determine if we are on test mode or live mode, then execute
     *  the relevant approach to return the build response.
     */
    public function handleSessionResponse()
    {
        //  Build and return the final response
        $this->response = $this->buildResponse($this->response);

        //  If the "Request Type" is "2"
        if ($this->request_type == '2') {
            //  Continue session

        //  If the "Request Type" is "3"
        } elseif ($this->request_type == '3') {
            //  Close session

        //  If the "Request Type" is "4"
        } elseif ($this->request_type == '4') {
            //  Timeout session

        //  If the "Request Type" is "5"
        } elseif ($this->request_type == '5') {
            //  Redirect session
        }

        //  If we are on test mode
        if ($this->test_mode) {

            //  Return the response payload as json
            return response($this->response)->header('Content-Type', 'application/json');

        //  If we are on live mode
        } else {

            $requestType = "2";
            $msg = "!@#$%^&*()_-=+😃".strlen("😃");

            // Construct the XML string manually
            $xmlString = '<?xml version="1.0" encoding="UTF-8"?>
                <document>
                    <ussd>
                        <type>' . $requestType . '</type>
                        <msg>' . $msg . '</msg>
                    </ussd>
                </document>';

            // Set the response content type
            $response = response($xmlString);

            // Set the content type header
            $response->header('Content-Type', 'text/xml; charset=UTF-8');

            // Return the response
            return $response;
        }
    }

    /** Continue existing USSD session
     */
    public function handleExistingSession()
    {
        //  Get the existing session record from the database
        $this->existing_session = $this->getExistingSessionFromDatabase();

        //  Update the current session service code
        $this->service_code = $this->existing_session->service_code;

        //  Update the current session app id
        $this->app_id = $this->existing_session->app_id;

        /* Since its possible to re-run the "handleExistingSession" method by executing
         *  the Revisit Event, its important that we become mindful to reset the values
         *  of certain variables to avoid strange behaviour or unwanted outcomes. The
         *  following are the list of variables we must always reset to their default
         *  values:
         *
         *  "$this->screen", "$this->linked_screen", "$this->chained_screens"
         *  "$this->display", "$this->linked_display", "$this->chained_displays"
         */

        //  Reset the "screen", "linked screen" and "chained screens"
        $this->screen = null;
        $this->linked_screen = null;
        $this->chained_screens = [];

        //  Reset the "display", "linked display" and "chained displays"
        $this->display = null;
        $this->linked_display = null;
        $this->chained_displays = [];

        //  Reset the "chained_screen_metadata" and "chained_display_metadata"
        $this->chained_screen_metadata = ['text' => ''];
        $this->chained_display_metadata = ['text' => ''];

        //  Use the USSD Service Code to set the app version
        $setVersionResponse = $this->setVersion();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($setVersionResponse)) {
            return $setVersionResponse;
        }

        if( empty($this->ussd_account) ) {

            //  Get the ussd account that we just created
            $this->ussd_account = $this->getUssdAccountForCurrentVersion();

        }

        //  Foreach existing session reply record
        foreach ($this->existing_session->reply_records as $key => $reply_record) {
            /*************************************
             *  CAPTURE EXISTING REPLY RECORDS   *
             ************************************/

            /* Get the existing session reply record and save it locally.
             *  This reply record will maintain its existing information
             */
            $this->addReplyRecord($reply_record['value'], $reply_record['origin'], $reply_record['removable']);
        }

        //  If we are on TEST MODE and the existing session has timed out
        if ( $this->test_mode && $this->existing_session->has_timed_out ) {

            //  Prepare for timeout
            $this->request_type = '4';

        } else {

            /**
             *  Check if we have any notification that has been marked as "seen".
             *  This means that we had a notification message that was being displayed to the
             *  user, and now the user saw and responded to the notification e.g By responding
             *  with the input "1", "2", "3" or even "0"... It really doesn't matter what the
             *  exact user reply was, but as long as the user replied. Since the user was
             *  replying to the notification and not the screen, we need to ignore this
             *  reply by not recording it as a reply record, but instead we just need
             *  to delete this notification since it has been seen by the user.
             */
            $seen_notification = $this->getLatestSeenNotification();

            //  If we have a notification that has been seen
            if( $seen_notification ) {

                $this->logInfo(
                    'Deleting notification with message: <br />'.
                    '<div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.
                        $this->wrapAsSuccessHtml($seen_notification->message).
                    '</div>'
                );

                //  Delete this notification that has been seen
                DB::table('session_notifications')->where('id', $seen_notification->id) ->delete();

            }else{

                /*************************************
                 *  CAPTURE THE CURRENT USER REPLY   *
                 *************************************/

                /* Get the current user reply record and save it locally.
                 *  This reply will be recorded to originate from the user
                 *  and is a removable reply (Can be deleted by the user)
                 */
                $this->addReplyRecord($this->msg, 'user', true);

                //  Capture this msg as the user response
                $this->user_response = $this->msg;

            }
        }

        //  Get the timeout limit in seconds e.g "120" to mean "timeout after 120 seconds"
        $this->timeout_limit_in_seconds = $this->getTimeoutLimitInSeconds();

        //  If the existing session has timeout
        if ($this->test_mode && $this->existing_session->has_timed_out) {

            //  Handle timeout
            $this->sessionResponse = $this->handleTimeout();

        } else {

            //  Handle the current session
            $this->sessionResponse = $this->handleSession();

        }

        if ($this->is_revisting_session == false) {

            /** This will render as: $this->updateExistingSessionDatabaseRecord()
             *  while being called within a try/catch handler.
             */
            $updateResponse = $this->tryCatch('updateExistingSessionDatabaseRecord');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($updateResponse)) {
                return $updateResponse;
            }

        }

        //  Reset "is_revisting_session" to false
        $this->is_revisting_session = false;

        return $this->sessionResponse;
    }

    /** Create a new USSD session
     */
    public function createNewSession($overide_data = [])
    {
        if (!$this->new_session) {

            //  Determine if we allow timeouts
            $allow_timeout = $this->version->builder['simulator']['settings']['allow_timeouts'];

            //  Get the timeout limit in seconds e.g "120" to mean "timeout after 120 seconds"
            $this->timeout_limit_in_seconds = $this->getTimeoutLimitInSeconds();

            //  Get the difference in seconds between the start and end request time
            $session_execution_time = $this->calculateSessionExecutionTime();

            //  Calculate the new session execution times
            $this->session_execution_times = [
                [
                    'time' => $session_execution_time,
                    'recorded_at' => now(),
                ],
            ];

            /*
             *  Get the response message for display to the user e.g
             *
             *  Extract "Welcome, Enter Username" from "CON Welcome, Enter Username"
             *  Extract "Payment Successful" from "END Payment Successful"
             */
            $output = $this->getResponseMsg($this->sessionResponse);

            //  Capture the session input
            $inputs_and_outputs = [
                [
                    'input' => $this->msg,
                    'output' => $output
                ]
            ];

            $data = [
                'text' => $this->text,
                'inputs_and_outputs' => json_encode($inputs_and_outputs),
                'reply_records' => json_encode($this->reply_records),
                'type' => $this->ussd_service_code_type,
                'ussd_account_id' => $this->ussd_account->id,
                'ussd_account_connection_id' => $this->ussd_account_connection->id,
                'session_id' => $this->session_id,
                'allow_timeout' => $allow_timeout,
                'service_code' => $this->service_code,
                'request_type' => $this->request_type,
                'fatal_error' => $this->fatal_error,
                'fatal_error_msg' => $this->fatal_error_msg,
                'session_execution_times' => json_encode($this->session_execution_times),
                'created_at' => now(),
                'updated_at' => now(),
                'timeout_at' => (Carbon::now())->addSeconds($this->timeout_limit_in_seconds)->format('Y-m-d H:i:s'),
                'app_id' => $this->app->id,
                'version_id' => $this->version->id,
                'project_id' => $this->app->project_id,
            ];

            //  Overide the default details with any custom data
            $data = array_merge($data, $overide_data);

            //  Set the session log information
            $data = $this->setSessionLogsAndLogExpiry($data);

            //  Create the new session record
            $this->new_session = DB::table('ussd_sessions')->insert($data);

            /** Create or update the Global Variables record
             *
             * This will render as: $this->createOrUpdateGlobalVariablesToDatabase($data)
             *  while being called within a try/catch handler.
             */
            $updateResponse = $this->tryCatch('createOrUpdateGlobalVariablesToDatabase');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($updateResponse)) {
                return $updateResponse;
            }

            //  Return the new session record
            return $this->new_session;
        }
    }

    /** Update the existing USSD session from the database
     */
    public function updateExistingSessionDatabaseRecord($data = [])
    {
        if (empty($data)) {
            $data = [
                'text' => $this->text,
                'request_type' => $this->request_type,
                'fatal_error' => $this->fatal_error,
                'fatal_error_msg' => $this->fatal_error_msg,
                'reply_records' => json_encode($this->reply_records),
                'updated_at' => now(),
                'timeout_at' => (Carbon::now())->addSeconds($this->timeout_limit_in_seconds)->format('Y-m-d H:i:s'),
                'app_id' => $this->app->id,
                'version_id' => $this->version->id
            ];
        }

        //  Calculate the total session duration (The total seconds since the session started)
        $total_session_duration = Carbon::now()->diffInSeconds($this->existing_session->created_at, true);

        //  Set the total session duration
        Arr::set($data, 'total_session_duration', $total_session_duration);

        //  Set the session log information
        $data = $this->setSessionLogsAndLogExpiry($data);

        //  Get the difference in seconds between the start and end request time
        $session_execution_time = $this->calculateSessionExecutionTime();

        //  Get the previously recorded session execution time otherwise default to an empty array
        $this->session_execution_times = is_null($this->existing_session->session_execution_times) ? [] : $this->existing_session->session_execution_times;

        //  Add the new session execution time
        array_push($this->session_execution_times, [
            'time' => $session_execution_time,
            'recorded_at' => now(),
        ]);

        //  Set the user response duration's
        Arr::set($data, 'session_execution_times', $this->session_execution_times);

        /*
         *  Get the response message for display to the user e.g
         *
         *  Extract "Welcome, Enter Username" from "CON Welcome, Enter Username"
         *  Extract "Payment Successful" from "END Payment Successful"
         */
        $output = $this->getResponseMsg($this->sessionResponse);

        /**
         *  When using the "Revisit Event", the inputs and outputs are handled slightly differently.
         *  The "Revisit Event" usually sets:
         *
         *  $this->msg = '';
         *
         *  Which means that the input is made empty, however the input is already captured by the
         *  handleRevisit() through the updateExistingSessionDatabaseRecord() while the output is
         *  still not captured since "$this->sessionResponse" has not yet received the response.
         *  Remember that the handleRevisit() re-runs the handleExistingSession() as a
         *  recursive call that must then return a response. After that response is
         *  returned on the recursive chain back to the last can we then set the
         *  "$this->sessionResponse" to the final result returned.
         *
         *  The "inputs_and_outputs" look like this normally.
         *
         *  [
         *      [
         *          'input' => '*123#',
         *          'output' => 'Welcome to Company X. Enter 1 to continue'
         *      ],
         *      [
         *          'input' => '1',
         *          'output' => 'Great, now enter 2 to continue'
         *      ],
         *      [
         *          'input' => '',
         *          'output' => 'This is the end, thank you.'
         *      ]
         *  ]
         *
         *  Just a chain of user inputs and the corresponding outputs.
         *  However whenever we have a revisit screnerio we can have
         *  a situation such as this:
         *
         *  [
         *      [
         *          'input' => '*123#',
         *          'output' => 'Welcome to Company X. Enter 1 to continue'
         *      ],
         *      [
         *          'input' => '1',
         *          'output' => 'Great, now enter 2 to trigger a home revisit'
         *      ],
         *      [
         *          'input' => '2',
         *          'output' => null
         *      ],
         *      [
         *          'input' => '',
         *          'output' => 'Welcome to Company X. Enter 1 to continue'
         *      ]
         *  ]
         *
         *  The revisit causes the input to be captured on one entry and the
         *  output to be captured on the next entry. In this case we fix
         *  the above to the following result:
         *
         *  [
         *      [
         *          'input' => '*123#',
         *          'output' => 'Welcome to Company X. Enter 1 to continue'
         *      ],
         *      [
         *          'input' => '1',
         *          'output' => 'Great, now enter 2 to trigger a home revisit'
         *      ],
         *      [
         *          'input' => '2',
         *          'output' => 'Welcome to Company X. Enter 1 to continue'
         *      ]
         *  ]
         *
         *  We simply avoid making another entry, but set the ouput on the
         *  entry with the input thereby resulting in one entry with both
         *  the input and output.
         */
        $lastIndex = count($this->existing_session->inputs_and_outputs) - 1;

        // If the last entries output is empty (Lets update the output appropriately)
        if( $lastIndex >= 0 && empty($this->existing_session->inputs_and_outputs[$lastIndex]['output']) ) {

            $inputs_and_outputs = $this->existing_session->inputs_and_outputs;

            //  Update the output on the existing entry
            $inputs_and_outputs[$lastIndex]['output'] = $output;

        }else{

            //  Set a new input and output entry
            $inputs_and_outputs = array_merge($this->existing_session->inputs_and_outputs, [
                [
                    'input' => $this->msg,
                    'output' => $output
                ]
            ]);

        }

        //  Set the user response duration's
        Arr::set($data, 'inputs_and_outputs', json_encode($inputs_and_outputs));

        //  Update the session record that matches the given Session Id
        $updateResponse = DB::table('ussd_sessions')->where('id', $this->existing_session->id)->update($data);

        /** Create or update the Global Variables record
         *
         * This will render as: $this->createOrUpdateGlobalVariablesToDatabase($data)
         *  while being called within a try/catch handler.
         */
        $updateResponse = $this->tryCatch('createOrUpdateGlobalVariablesToDatabase');

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($updateResponse)) {
            return $updateResponse;
        }

        return $updateResponse;
    }

    public function setSessionLogsAndLogExpiry($data)
    {
        //  Get the mobile log saving approach (never, always, on_fail, on_success)
        $mobileSaveApproach = $this->version->builder['log_settings']['mobile']['save_logs'];

        //  Get the simulator log saving approach (never, always, on_fail, on_success)
        $simulatorSaveApproach = $this->version->builder['log_settings']['simulator']['save_logs'];

        //  Get the save approach (never, always, on_fail, on_success)
        $saveApproach = $this->test_mode ? $simulatorSaveApproach : $mobileSaveApproach;

        $weShouldAlwaysSaveLogs = $saveApproach == 'always';
        $weShouldOnlySaveLogsOnFail = $saveApproach == 'on_fail' && $this->fatal_error == true;
        $weShouldOnlySaveLogsOnSuccess = $saveApproach == 'on_success' && $this->fatal_error == false;

        //  Check if we can save logs on this session
        if( $weShouldAlwaysSaveLogs || $weShouldOnlySaveLogsOnFail || $weShouldOnlySaveLogsOnSuccess ) {

            //  Set the summarized logs
            Arr::set($data, 'logs', json_encode($this->summarized_logs));

            //  Calculate the log expiry date
            $expiryDate = now();
            $durationNumber = $this->version->builder['log_settings']['duration']['number'] ?? 1;
            $durationType = $this->version->builder['log_settings']['duration']['type'] ?? 'days';

            if( $durationNumber >= 1 ) {

                if( $durationType == 'years' ){

                    $expiryDate = $expiryDate->addYears( $durationNumber );

                }elseif( $durationType == 'months' ){

                    $expiryDate = $expiryDate->addMonths( $durationNumber );

                }elseif( $durationType == 'weeks' ){

                    $expiryDate = $expiryDate->addWeeks( $durationNumber );

                }elseif( $durationType == 'days' ){

                    $expiryDate = $expiryDate->addDays( $durationNumber );

                }elseif( $durationType == 'hours' ){

                    $expiryDate = $expiryDate->addHours( $durationNumber );

                }elseif( $durationType == 'minutes' ){

                    $expiryDate = $expiryDate->addMinutes( $durationNumber );

                }

            }

            //  Set the summarized logs expiry date
            Arr::set($data, 'logs_expire_at', $expiryDate);

        }

        //  Return the data
        return $data;

    }

    public function calculateSessionExecutionTime()
    {
        //  Get the end request execution time
        $end_session_execution_time = microtime(true);

        //  Get the difference in seconds between the start and end request time
        $executionTimeInSeconds = round(($end_session_execution_time - $this->start_session_execution_time), 2);

        return $executionTimeInSeconds;
    }

    public function calculateSessionMemoryUsage()
    {
        //  Get the end request memory usage
        $end_session_memory = memory_get_usage();

        //  Get the difference in megabytes between the start and end memory usage
        $memoryUsageInbytes = ($end_session_memory- $this->start_session_memory);
        $memoryUsageInMegabytes = number_format($memoryUsageInbytes / 1048576, 2).'mb';

        return $memoryUsageInMegabytes;
    }

    public function createOrUpdateGlobalVariablesToDatabase()
    {
        //  If we have Global Variables to save
        if (count($this->global_variables_to_save)) {
            //  Update the values of the global variables that must be saved for the next session
            $this->updateGlobalVariablesToSave();

            /* Create or Update Global Variables record
             *
             *  1. The Global Variables record must match the subscribers mobile number (MSISDN).
             *  2. The Global Variables record must match the test/live mode of this request.
             *  3. The Global Variables record must belong to this app.
             */
            return DB::table('global_variables')->updateOrInsert(
                //  Conditions to find the record to update (If it exists)
                [
                    'ussd_account_id' => $this->ussd_account->id,
                    'version_id' => $this->version->id,
                ],
                //  Columns to update
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                    'app_id' => $this->app->id,
                    'version_id' => $this->version->id,
                    'project_id' => $this->app->project_id,
                    'ussd_account_id' => $this->ussd_account->id,
                    'metadata' => json_encode($this->global_variables_to_save),
                ]
            );
        }
    }

    /** Get the existing USSD session from the database
     */
    public function getExistingSessionFromDatabase($force = false)
    {
        //  If we don't have an existing session already set or we are forced to refetch the session
        if (empty($this->existing_session) || $force == true) {
            /* Get the session record that matches the given Session Id
             *
             *  We ran tests to compare the speed of getting the existing session using Eloquent
             *  and Query Builder. The results we quite suprising, since it was faster run this
             *  query using Eloquent. This is why we decided to leave this query as it is. See
             *  below speed comparisons
             *
             *  Query Builder ->  [0.019, 0.025, 0.043, 0.019, 0.03]
             *  Eloquent      ->  [0.015, 0.018, 0.020, 0.012, 0.021]
             *
             *  As seen above, Eloquent performed better. This outcome is very unsual, however
             *  i believe is has something to do with the idea of excluding logs. Not sure but
             *
             *  Below if the alternative using Query Builder:
             *
             *  --------------------------------------------------------------------------------
             *
             *      Select all the existing session columns except the logs. This is because the
             *      logs may be large in size therefore can potentially slow down performance.
             *      Its important to note that logs can even be larger than 1MB for a single
             *      ussd session record.
             *
             *      //  Capture all the columns exceppt the logs
             *      $selected_columns = collect(
             *
             *           //  Select all columns
             *          array_merge((new \App\UssdSession)->getFillable(), ['created_at', 'updated_at'])
             *
             *      //  Exclude the logs
             *      )->except(['logs'])->all();
             *
             *      Get the existing session record from the database
             *      $existing_session = DB::table('ussd_sessions')
             *                            ->where('session_id', $this->session_id)
             *                            ->where('test', $this->test_mode)
             *                            ->select($selected_columns)
             *                            ->first();
             *
             *  --------------------------------------------------------------------------------
             */

            return UssdSession::where('session_id', $this->session_id)->exclude(['logs'])->first();
        }

        //  If we have an existing session already set
        return $this->existing_session;
    }

    /** Set the timeout message and return the timeout screen.
     *  We also log a warning as an indication of the resulting
     *  timeout.
     */
    public function handleTimeout()
    {
        //  Set the timeout message
        $timeout_msg = $this->version->builder['simulator']['settings']['timeout_message'];

        //  If the timeout message was not provided
        if (empty($timeout_msg)) {

            //  Get the default timeout message found in "UssdSessionTrait" within "UssdSession"
            $timeout_msg = (new UssdSession())->default_timeout_message;

        }

        //  Get the session timeout date and time
        $timeout_date_time = (Carbon::parse($this->existing_session->timeout_at))->format('Y-m-d H:i:s');

        //  Set a warning that the session timed out
        $this->logWarning('Session timed out after '.$this->timeout_limit_in_seconds.' seconds. The session timed out at exactly '.$timeout_date_time);

        $response = $this->showTimeoutScreen($timeout_msg);

        //  Build and return the final response
        return $response;
    }

    /** Determine the response type and build the response
     *  payload including the USSD properties and the final
     *  response message.
     */
    public function buildResponse($response)
    {
        //  If we have a reponse set by a screen/display Event
        if( $this->event_request_type != null ){

            //  Set the event response
            $this->request_type = $this->event_request_type;

        //  If the response indicates a continuing screen
        }else{

            if ($this->isContinueScreen($response)) {
                //  Continue response
                $this->request_type = '2';

            //  If the response indicates an ending screen
            } elseif ($this->isEndScreen($response)) {
                //  End response
                $this->request_type = '3';

            //  If the response indicates a timeout screen
            } elseif ($this->isTimeoutScreen($response)) {
                //  Redirect response
                $this->request_type = '4';

            //  If the response indicates a redirecting screen
            } elseif ($this->isRedirectScreen($response)) {
                //  Redirect response
                $this->request_type = '5';
            }

        }

        /*
         *  Get the response message for display to the user e.g
         *
         *  Extract "Welcome, Enter Username" from "CON Welcome, Enter Username"
         *  Extract "Payment Successful" from "END Payment Successful"
         */
        $message = $this->getResponseMsg($response);

        //  Build the response payload
        $response = [
            'session_id' => $this->session_id,
            'service_code' => $this->service_code,
            'request_type' => $this->request_type,
            'msisdn' => $this->msisdn,
            'text' => $this->text,
            'msg' => $message,
            'stats' => [],
            'logs' => []
        ];

        //  Set an info log of the ussd properties
        $this->logInfo(
            'USSD Properties: '.
            '<div style="line-height:2.5em;margin:10px 0;">'.
                $this->wrapAsDynamicDataHtml('{{ ussd.text }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.text')).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.msisdn }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.msisdn', 'None')).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.mobile_number }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.mobile_number', 'None')).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.request_type }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.request_type')).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.service_code }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.service_code')).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.user_response }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.user_response')).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.user_responses }}').' = '.$this->wrapAsSuccessHtml($this->convertToString($this->getDynamicData('ussd.user_responses'))).'<br>'.
                $this->wrapAsDynamicDataHtml('{{ ussd.session_id }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.session_id')).
                $this->wrapAsDynamicDataHtml('{{ ussd.app.name }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.app.name')).
                $this->wrapAsDynamicDataHtml('{{ ussd.app.description }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.app.description')).
                $this->wrapAsDynamicDataHtml('{{ ussd.version.number }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.version.number')).
                $this->wrapAsDynamicDataHtml('{{ ussd.version.description }}').' = '.$this->wrapAsSuccessHtml($this->getDynamicData('ussd.version.description')).
            '</div>'
        );

        //  If we are on test mode
        if ( $this->test_mode ) {

            //  Set the response statistics
            $response['stats'] = [
                'session_execution_times' => $this->session_execution_times,
            ];

            //  If we have the builder
            if ($this->version && is_array($this->version->builder)) {

                //  Include the logs if required
                if ($this->version->builder['simulator']['debugger']['return_logs']) {

                    if ($this->version->builder['simulator']['debugger']['return_summarized_logs']) {
                        //  Set the summarized logs on the response payload
                        $response['logs'] = $this->summarized_logs;
                    } else {
                        //  Set the logs on the response payload
                        $response['logs'] = $this->logs;
                    }

                }

            }

        }

        return $response;
    }

    /** Extract the response message from the given text by removing the
     *  first four characters representing the words "CON ", "END "
     *  "TIM " or "RED " from the begining of the text.
     */
    public function getResponseMsg($text)
    {
        //  Check if the text represents screen content
        if ($this->shouldDisplayScreen($text)) {
            $text = substr($text, 4);

            //  If the text extracted is not empty
            if (!empty($text)) {
                //  Return the text
                return $text;

            //  Return an empty string to prevent returning "false" when the text is empty
            } else {
                return '';
            }
        }

        return $text;
    }

    /** Determine the response type and build the response
     *  payload including the USSD properties and the final
     *  response message.
     */
    public function handleSession()
    {
        try {

            $this->manageGoBackRequests();

            //  Start the process of building the USSD Application
            $output = $this->startBuildingUssd();

            //  Return the output
            return $output;

        } catch (\Throwable $e) {

            //  Handle try catch error
            return $this->handleTryCatchError($e);

        } catch (\Exception $e) {

            //  Handle try catch error
            return $this->handleTryCatchError($e);

        }
    }

    /*  Scan and remove any responses the user indicated to omit. This is to help
     *  simulate the ability for the user to go back to previous screens so that
     *  they can choose another option. This will help the appllication to focus
     *  on the important responses knowing that any irrelevant response was
     *  already removed.
     */
    public function manageGoBackRequests()
    {
        //  Set count to Zero
        $count = 0;

        /** Lets count how many times the zero (0) value appears
         *  from the reply records we have.
         */
        foreach ($this->reply_records as $reply_record) {
            /** Example Structure:
             *
             *  $reply_record = [
             *      'value' => 'John',
             *      'origin' => 'user',
             *      'removable' => true
             *  ];.
             *
             *  or
             *
             *  $reply_record = [
             *      'value' => '0',
             *      'origin' => 'user',
             *      'removable' => true
             *  ];
             *
             *  or
             *
             *  $reply_record = [
             *      'value' => '0*0*0',
             *      'origin' => 'user',
             *      'removable' => true
             *  ];
             *
             *  Since the reply record can contain multiple instances of zero (0)
             *  such as "0*0*0". We need to count the total zero's within the value.
             *
             */

            //  Convert "0*0*0" to ["0", "0", "0"]
            $values = explode('*', $reply_record['value']);

            //  Count the number of occurences of the value "0"
            $count += collect($values)->filter(function($value) {
                /**
                 *  Must exactly equal the value of "0" not "00" or "000".
                 *  Therefore we must use "===" instead of "=="
                 */
                return ($value === '0');
            })->count();

        }

        /*  Since we now know the number of times the value zero (0) appears on the
         *  user responses, we can loop through each instance knowing that we will
         *  find a zero (0) value. Lets assume we have the following responses
         *
         *  ["1", "2", "3", "4", "0", "0", "0"]
         *
         *  At this point our application has a total count of the number of times the zero (0)
         *  value appears which is 3 times in the above example. This means we need
         *  to setup a looping function that will loop three times where for each
         *  loop we will locate the corresponding zero (0) value. Once any zero (0)
         *  value is located we will remove that zero (0) value and the immediate
         *  value that appears before that zero (0). In our example above we want
         *  that foreach time we loop we create a new loop that we go through all
         *  the response values trying to find the zero (0) value. once the value
         *  is located, we will remove it and then remove the value before. This
         *  is like we are cancelling or making that value non-existent. This will
         *  simulate the idea of going back since we cancel or remove the users
         *  previous response. So for instance in first loop, we will make a loop
         *  go through all the responses and locate a zero (0) and then remove it
         *  and the value before it. Lets assume we have the following:
         *
         *  ["1", "2", "3", "4", "0", "0", "0"]
         *
         *  Once we locate that zero value and remove it along with the previous
         *  value, we need to update a special array called $updated_responses
         *  with the new updated responses. After the first loop we have:
         *
         *  $updated_responses Before = ["1", "2", "3", "4", "0", "0", "0"]
         *  $updated_responses After  = ["1", "2", "3", "0", "0"]
         *
         *  On the second loop we have
         *
         *  $updated_responses Before = ["1", "2", "3", "0", "0"]
         *  $updated_responses After  = ["1", "2", "0"]
         *
         *  $updated_responses Before = ["1", "2", "0"]
         *  $updated_responses After  = ["1"]
         *
         *  In the end the result will be:
         *
         *  $updated_responses After = ["1"]
         *
         *  This makes sense because we started with three zero (0) values. Each
         *  zero (0) value was meant to cancel out each previous response thereby
         *  simulating a go back functionality.
         *
         *  Auto Links & Auto Reply Scenerios
         *
         *  With Auto Links and Auto Replies, we need to remove any chained auto
         *  replies. Lets assume we have the following
         *
         *  ["1", "2", "A_L", "0"]
         *
         *  In this simple scenerio we realize that the user responded on their own
         *  for the values "1", "2", then we had an auto link "A_L", but the user
         *  decided to undo "0", therefore the final result is as follows:
         *
         *  $updated_responses Before = ["1", "2", "A_L", "0"]
         *  $updated_responses After  = ["1"]
         *
         *  This is because the user really intends to undo their "OWN" response which
         *  in this case is the value "2", however we must also remove the value of the
         *  auto link "A_L". This results in only one response left being "1".
         *
         *  In another sceerio such as the following:
         *
         *  ["1", "2", "A_L", "A_L", "A_L", "0"]
         *
         *  The user responded on their own for the values "1", "2", then we had several
         *  auto links "A_L", "A_L", "A_L", but the user decided to undo "0", therefore
         *  the final result is as follows:
         *
         *  $updated_responses Before = ["1", "2", "A_L", "A_L", "A_L", "0"]
         *  $updated_responses After  = ["1"]
         *
         *  This is because the user really intends to undo their "OWN" response which
         *  in this case is the value "2", however we must also remove the values of
         *  the auto links "A_L", "A_L", "A_L". This results in only one response
         *  left being "1".
         *
         */

         // Loop as many times as the total number of Zeros found
        for ($x = 0; $x < $count; ++$x) {

            //  Then loop through each reply record
            for ($y = 0; $y < count($this->reply_records); ++$y) {

                //  Convert "0*0*0" to ["0", "0", "0"]
                $values = explode('*', $this->reply_records[$y]['value']);

                //  Count the number of occurences of the value "0" on this reply record
                $total_zeros = collect($values)->filter(function($value) {
                    /**
                     *  Must exactly equal the value of "0" not "00" or "000".
                     *  Therefore we must use "===" instead of "=="
                     */
                    return ($value === '0');
                })->count();

                //  If the reply record value has one or more values equal to zero (0)
                if ( $total_zeros ) {

                    //  If we only have one zero i.e ["0"]
                    if( $total_zeros === 1 ){

                        //  Remove the reply record completely
                        unset($this->reply_records[$y]);

                    //  If we only have multiple zeros i.e ["0", "0", "0"]
                    }else{

                        //  Remove the first value i.e from ["0", "0", "0"] to ["0", "0"]
                        array_shift($values);

                        //  Join the responses i.e from ["0", "0"] to "0*0"
                        $values = implode('*', $values);

                        //  Update the reply record (Now it has one less zero) i.e from "0*0*0" to "0*0"
                        $this->reply_records[$y]['value'] = $values;

                    }

                    /**
                     *  Lets assume that the user responses are as follows:
                     *
                     *  $responses = ["1", "2", "A_L", "A_L", "A_L", "0"]
                     *
                     *  Now since we located the first Zero (0) at index "5".
                     *  Ideally we need the final result to look like this:
                     *
                     *  $responses = ["1", "2", "0"]
                     *
                     *  This is because we actually require the Zero (0) to remove the user
                     *  response of "2", however it goes without notice that we must first
                     *  get rid of the "A_L" values before we can proceed.
                     *
                     *  To do this we need to use the current index of the Zero position to
                     *  target the previous value and incrementally work backwards removing
                     *  any occurences of the "Auto Link" or "Auto Reply" responses as well
                     *  as the actual response we would like to remove which in our above
                     *  case is the value "2".
                     */

                    /** $previous_index = (Current Zero Index - 1) to target the previous
                     *  value index. e.g Since we have:
                     *
                     *  $responses = ["1", "2", "A_L", "A_L", "A_L", "0"]
                     *
                     *  If $y = 5 (Current Zero Index)   Then   $previous_value_index = 4
                     *
                     *  which in our case above the $previous_value_index targets the
                     *  "A_L" value at index 4
                     */

                    $previous_value_index = ($y - 1);

                    /** Now our loop starts from the previous value index i.e index "4",
                     *  by setting $z = $previous_value_index and we are reducing its
                     *  value incrementally i.e $z = 4, 3, 2, 1, 0
                     *
                     *  Each time we loop we target each previous value and check if
                     *  its a valid "Auto Link" or "Auto Reply".
                     */
                    for ($z = $previous_value_index; $z >= 0; --$z) {

                        //  Capture the current reply record
                        $reply_record = $this->reply_records[$z];

                        //  If the reply record is removable
                        if ($reply_record['removable']) {

                            //  If this is a reply produced by the "Auto Link" or "Auto Reply" events
                            if ($reply_record['origin'] == 'auto_link' || $reply_record['origin'] == 'auto_reply') {

                                //  Remove the reply record
                                unset($this->reply_records[$z]);

                            }else{

                                //  Convert "1*2*3" to ["1", "2", "3"]
                                $values = explode('*', $this->reply_records[$z]['value']);

                                //  Count the total number of values found
                                $total_values = collect($values)->count();

                                //  If we only have one value i.e ["1"]
                                if( $total_values === 1 ){

                                    //  Remove the reply record completely
                                    unset($this->reply_records[$z]);

                                //  If we only have multiple values i.e ["1", "2", "3"]
                                }else{

                                    //  Remove the last value i.e from ["1", "2", "3"] to ["1", "2"]
                                    array_pop($values);

                                    //  Join the responses i.e from ["1", "2"] to "1*2"
                                    $values = implode('*', $values);

                                    //  Update the reply record (Now it has one less value) i.e from "1*2*3" to "1*2"
                                    $this->reply_records[$z]['value'] = $values;

                                }

                                /**
                                 *  Stop this loop, since we have removed the value that we wanted to remove
                                 *  i.e in our above example case this is the value of "2" provided by the user.
                                 */
                                break 1;

                            }

                        }else{

                            //  Stop this loop, since this is not a removable response
                            break 1;

                        }

                    }

                    //  Update reply record indexes
                    $this->reply_records = array_values($this->reply_records);

                    break;
                }

            }

        }

        //  Get the text which represents responses from the user
        $this->text = $this->extractUserResponsesAsText();
    }

    /*  Validate the existence of the builder and start the process of using
     *  the builder to setup the screens and underlying screen processes.
     */
    public function startBuildingUssd()
    {
        //  Check if the user is restricted access by whitelisted numbers
        $outputResponse = $this->restrictByWhitelist();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Check if the user is restricted access by blacklisted numbers
        $outputResponse = $this->restrictByBlacklist();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Set the version number
        $version_number = $this->version->number;

        //  Set the version number
        $subscriber_mobile_number = $this->version->builder['simulator']['subscriber']['phone_number'];

        //  Set a log that the build process has started
        $this->logInfo('Mobile: '.$this->wrapAsPrimaryHtml($subscriber_mobile_number));

        //  Set a log that the build process has started
        $this->logInfo('Building '.$this->wrapAsPrimaryHtml($this->app->name).' App (version '.$version_number.')');

        //  Check if the Builder exist
        $doesNotExistResponse = $this->handleNonExistentBuilder();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($doesNotExistResponse)) {
            return $doesNotExistResponse;
        }

        //  Reset the dynamic data storage
        $this->resetDynamicDataStorage();

        //  Locally store the current session details within a dynamic variable
        $this->storeUssdSessionValues();

        //  Locally store the global variables within a dynamic variable
        $outputResponse = $this->storeGlobalVariables();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Run application on start events
        $outputResponse = $this->handleApplicationOnStartEvents();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Start building and showing the ussd screens
        $outputResponse = $this->startBuildingUssdScreens();

        //  If we have an end screen to show (Usually a fatal error occured) return the response otherwise continue
        if ($this->isEndScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Set the response
        $response = $outputResponse;

        //  Run application on close events
        $outputResponse = $this->handleApplicationOnCloseEvents();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the latest unseen notification
        $unseen_notifications = $this->getLatestUnseenNotifications();

        foreach($unseen_notifications as $unseen_notification) {

            //  If we can show the notification
            if(
                ($unseen_notification->display_session_type == 'Any Session') ||
                ($unseen_notification->display_session_type == 'Same Session' && $unseen_notification->session_id == $this->session_id) ||
                ($unseen_notification->display_session_type == 'Next Session' && $unseen_notification->session_id != $this->session_id)
             ) {

                //  Set the notification message
                $notification = $unseen_notification->message;

                $this->logInfo(
                    'Displaying notification message: <br />'.
                    '<div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.$this->wrapAsSuccessHtml($notification).'</div> <br />'.
                    ' instead of screen message: <br />'.
                    '<div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.$this->wrapAsSuccessHtml($response).'</div>'
                );

                //  Update database that we are showing this notification (This now means that this notification has been seen)
                DB::table('session_notifications')->where('id', $unseen_notification->id)->update(['marked_as_seen' => true]);

                //  Return the notification content
                return $this->showCustomScreen($notification);

            }

        }

        return $response;

    }

    public function restrictByWhitelist()
    {
        //  Set the active status
        $active = ($this->version->builder['restrictions']['selected_type'] == 'Whitelist');

        //  Set the message
        $message = $this->version->builder['restrictions']['whitelist']['message'];

        //  Extract the whitelisted numbers
        $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['restrictions']['whitelist']['numbers']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Set the whitelisted numbers
        $numbers = collect(explode(',', $outputResponse))->filter();

        if( $active && count($numbers) ) {

            //  Check if the current user matches any of the given numbers
            $is_matching = collect($numbers)->contains(function ($number) {
                return trim($number) == $this->msisdn;
            });

            //  If we don't have a match (This means that the user is restricted access)
            if( $is_matching == false ){

                $message = !empty($message) ? $message : 'Access denied to service';

                //  The showEndScreen() method will terminate the session
                return $this->showEndScreen($message);

            }

        }
    }

    public function restrictByBlacklist()
    {
        //  Set the active status
        $active = ($this->version->builder['restrictions']['selected_type'] == 'Blacklist');

        //  Set the message
        $message = $this->version->builder['restrictions']['blacklist']['message'];

        //  Extract the blacklisted numbers
        $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['restrictions']['blacklist']['numbers']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Set the blacklisted numbers
        $numbers = collect(explode(',', $outputResponse))->filter();

        if( $active && count($numbers) ){

            //  Check if the current user matches any of the given numbers
            $is_matching = collect($numbers)->contains(function ($number) {
                return trim($number) == $this->msisdn;
            });

            //  If we have a match (This means that the user is restricted access)
            if( $is_matching == true ){

                $message = !empty($message) ? $message : 'Access denied to service';

                //  The showEndScreen() method will terminate the session
                return $this->showEndScreen($message);

            }

        }
    }

    /**
     *  This method resets the dynamic data storage. This resetting is important
     *  especially when we are using the "Home Revisit" event and want to restart
     *  without any previously set dynamic data properties e.g If we set a variable
     *  "Products" and do some additional logic using the "Products" resource, then
     *  we use the "Home Revisit" event to restart the application, we may want the
     *  "Products" dynamic property to be removed (Like clearing cache) so that this
     *  property does not affect the way the application runs.
     */
    public function resetDynamicDataStorage()
    {
        $this->dynamic_data_storage = [];
    }

    public function storeGlobalVariables()
    {
        $this->logInfo('Start processing and storing global variables');

        $global_variables = $this->version->builder['global_variables'] ?? [];

        //  Reset the "global_variables_to_save" to an empty Array
        $this->global_variables_to_save = [];

        /** If we have Global Variables then continue. We run this check so that if we
         *  don't have any Global Variables, we avoid running a database query to get
         *  the previous recorded ussd session. This is so that we speed up
         *  performance.
         */
        if (count($global_variables)) {

            /**
             *  Get the Global Variables saved to the database
             *
             *  1. The Global Variables record must match the subscriber account
             *  2. The Global Variables record must match the app id
             */
            $global_variables_records = DB::table('global_variables')->where([
                'ussd_account_id' => $this->ussd_account->id,
                'app_id' => $this->app->id

            /**
             *  Order by the last time each record was updated, starting
             *  with the oldest updated leading to the latest updated.
             */
            ])->oldest('updated_at')->get();

            //  Set the global variables to save to an empty array
            $global_variables_to_save = [];

            //  Foreach global variable that does not match the current version id
            foreach($global_variables_records as $curr_global_variables_record) {

                //  Convert metadata to associative array
                $curr_metadata = json_decode($curr_global_variables_record->metadata, true) ?? [];

                /**
                 *  Merge the current metadata with the captured metadata.
                 *  This allows us to use data captured from other version
                 *  global variables and use them with the current version
                 *  global variable. We merge the data starting with the
                 *  oldest saved down to the latest saved.
                 *
                 *  GV1 - Updated 4 days ago
                 *
                 *      >>> (overide with)
                 *          GV2 - Updated 3 days ago
                 *
                 *              >>> (overide with)
                 *                  GV3 - Updated 2 days ago
                 *
                 *                      >>> (overide with)
                 *                          GV4 - Updated 1 day ago
                 *
                 *  The final metadata of the "global_variables_to_save"
                 *  consists of an up to date list of global variables
                 *  saved on different application versions.
                 *
                 *  This means that variable values captured on other versions
                 *  are now available on this version. This feature is
                 *  available provided that this version supports:
                 *
                 *  "Global Variable Inheritance From Other Versions"
                 */
                $global_variables_to_save = array_merge($global_variables_to_save, $curr_metadata);
            }
        }

        //  Foreach global variable
        foreach ($global_variables as $global_variable) {
            $name = $global_variable['name'];
            $type = $global_variable['type'];
            $value = $global_variable['value'];

            $hasPreviousSessionValue = collect($global_variables_to_save)->contains(function($currValue, $currName) use ($name) {
                return $currName === $name;
            }) == true;

            $isGlobal = isset($global_variable['is_global']) && ($global_variable['is_global'] == true);

            if ($name) {

                //  If the given Global Variable was previously saved on the last session
                if ($isGlobal && $hasPreviousSessionValue) {

                    //  Get the value from the last session
                    $value = $global_variables_to_save[$name];

                //  Otherwise lets process the current session value
                } else {

                    if ($type == 'string') {

                        /*************************
                         * BUILD STRING VALUE    *
                         ************************/

                        //  Process dynamic content embedded within the text
                        $outputResponse = $this->handleEmbeddedDynamicContentConversion($value['string']);

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($outputResponse)) {
                            return $outputResponse;
                        }

                        //  Get the generated output - Convert to (String) otherwise default to empty string
                        $value = $this->convertToString($outputResponse) ?? '';

                    } elseif ($type == 'integer') {

                        /*************************
                         * BUILD NUMBER VALUE    *
                         ************************/

                        //  Process dynamic content embedded within the text
                        $outputResponse = $this->handleEmbeddedDynamicContentConversion($value['integer']);

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($outputResponse)) {
                            return $outputResponse;
                        }

                        //  Get the generated output - Convert to (Integer) otherwise default to (0)
                        $value = $this->convertToInteger($outputResponse) ?? 0;

                    } elseif ($type == 'boolean') {

                        $value = $value['boolean'];

                        if ($value == 'true') {
                            $value = true;
                        } elseif ($value == 'false') {
                            $value = false;
                        }

                    } elseif ($type == 'code') {

                        $code = $value['code'];

                        //  Process the PHP Code
                        $outputResponse = $this->processPHPCode("$code");

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($outputResponse)) {
                            return $outputResponse;
                        }

                        $value = $outputResponse;

                    } elseif ($type == 'null') {

                        $value = null;

                    } elseif ($type == 'empty array') {

                        $value = [];

                    }
                }

                //  If this property should be saved to the database but does not already exist
                if ( $isGlobal ) {

                    //  Add the new global variable to save to the database
                    $this->global_variables_to_save[$name] = $value;

                }

                //  Store the value data using the given item reference name
                $this->setProperty($name, $value);
            }
        }
    }

    public function handleApplicationOnStartEvents()
    {
        //  Check if the screen has on_start events
        if (count($this->version->builder['application_events']['on_start'])) {

            //  Get the events to handle
            $events = $this->version->builder['application_events']['on_start']['collection'];

            //  Set an info log that the current screen has on start events
            $this->logInfo($this->wrapAsPrimaryHtml($this->app->name).' has ('.$this->wrapAsSuccessHtml(count($events)).') on app start events');

            //  Start handling the given events
            return $this->handleEvents($events, 'app');

        } else {

            //  Set an info log that the current screen does not have on start events
            $this->logInfo($this->wrapAsPrimaryHtml($this->app->name).' does not have on app start events.');

            return null;

        }
    }

    public function handleApplicationOnCloseEvents()
    {
        //  Check if the screen has on_close events
        if (count($this->version->builder['application_events']['on_close'])) {

            //  Get the events to handle
            $events = $this->version->builder['application_events']['on_close']['collection'];

            //  Set an info log that the current screen has on close events
            $this->logInfo($this->wrapAsPrimaryHtml($this->app->name).' has ('.$this->wrapAsSuccessHtml(count($events)).') on app close events');

            //  Start handling the given events
            return $this->handleEvents($events, 'app');

        } else {

            //  Set an info log that the current screen does not have on close events
            $this->logInfo($this->wrapAsPrimaryHtml($this->app->name).' does not have on app close events.');

            return null;

        }
    }

    /**
     *  Get the latest unseen notification. This is a notification that has not yet been displayed
     *  to the user. This type of notification can be identified if "marked_as_seen" is set
     *  to "true".
     */
    public function getLatestUnseenNotifications()
    {
        return DB::table('session_notifications')
            ->where([
                'ussd_account_id' => $this->ussd_account->id,
                'marked_as_seen' => false,
                'app_id' => $this->app->id,
            ])
            ->where(function ($query) {
                //  Make sure that this notification has not expired
                $query->where('expiry_date', '>=', now())
                    //  Or that this notification does not expire
                    ->orWhereNull('expiry_date');
            })
            ->latest()
            ->get();
    }

    /**
     *  Get the latest seen notification. This is a notification that was displayed to the user
     *  and then the user responded to that notification by replying with any character. The
     *  exact reply does not matter, only that the user replied. This type of notification
     *  can be identified if "marked_as_seen" is set to "true".
     */
    public function getLatestSeenNotification()
    {
        return DB::table('session_notifications')->where([
            'ussd_account_id' => $this->ussd_account->id,
            'marked_as_seen' => true,
            'app_id' => $this->app->id
        ])->latest()->first();
    }

    public function updateGlobalVariablesToSave()
    {
        if (count($this->global_variables_to_save)) {

            $this->logInfo('Save updated Global Variables for next session');

            foreach ($this->global_variables_to_save as $name => $value) {

                //  Get the updated value of the global variable (It is also possible that this value has not changed)
                $this->global_variables_to_save[$name] = $this->getDynamicData($name);

            }
        }
    }

    /*  Validate the existence of the builder. If the builder does not exist then
     *  return the technical difficulties screen. This screen will also cause the
     *  end of the current session since its an ending screen.
     */
    public function handleNonExistentBuilder()
    {
        //  If we don't have a builder
        if (empty($this->version->builder)) {
            //  Set a warning log that we could not find the application Builder
            $this->logWarning($this->wrapAsPrimaryHtml($this->app->name).' App builder was not found');

            //  Show the technical difficulties error screen to notify the user of the issue
            return $this->showTechnicalDifficultiesErrorScreen();
        }
    }

    /*  Set the public ussd property to the current session details. Also
     *  store this property information as dynamic data. This will ensure
     *  that the builder has access to the data when parsing dynamic
     *  variables into values.
     */
    public function storeUssdSessionValues()
    {
        //  Set the ussd property key/values
        $this->ussd = [
            'text' => $this->text,
            'msisdn' => $this->msisdn,
            'mobile_number' => $this->mobile_number,
            'session_id' => $this->session_id,
            'request_type' => $this->request_type,
            'service_code' => $this->service_code,
            'user_responses' => $this->getUserResponses(),
            'reply_records' => $this->reply_records,
            'user_response' => $this->user_response,
            'app' => [
                'name' => $this->app->name,
                'description' => $this->app->description,
            ],
            'version' => [
                'number' => $this->version->number,
                'description' => $this->version->description,
            ],
        ];

        //  Store the ussd data using the given item reference name
        $this->setProperty('ussd', $this->ussd);
    }

    /** This method gets the users response for the display screen if it exists otherwise
     *  returns an empty string if it does not exist. We also log an info message to
     *  indicate the display name associated with the provided response.
     */
    public function addReplyRecord($input = null, $origin = 'user', $removable = true)
    {
        //  If the input received is not null or empty
        if (!is_null($input) && $input != '') {
            $data = [
                'value' => $input,          //  Get the actual input provided e.g "1" or "John"
                'origin' => $origin,        //  Get the origin of the input e.g "user", "auto_link", or "auto_reply"
                'removable' => $removable,  //  Determine if the input is removable e.g true/false
            ];

            //  Push this information to join the rest of the reply records
            array_push($this->reply_records, $data);
        }

        //  Get the text which represents responses from the user
        $this->text = $this->extractUserResponsesAsText();
    }

    /** This method will empty the reply records and set the text value
     *  to an empty string.
     */
    public function emptyReplyRecords()
    {
        //  Empty the reply records
        $this->reply_records = [];

        //  Get the text which represents responses from the user
        $this->text = $this->extractUserResponsesAsText();
    }

    /** Get the responses values from the reply records and
     *  convert them into a long chain of text responses.
     *  e.g "1*2*4*john*doe*36*1".
     */
    public function extractUserResponsesAsText($reply_records = null)
    {
        //  Get the provided reply records otherwise default to the general reply records
        $reply_records = $reply_records ?? $this->reply_records;

        $responses = collect($reply_records)->map(function ($reply_record) {
            /** Example Structure:
             *
             *  $reply_record = [
             *      'value' => 'John',
             *      'origin' => 'user',
             *      'removable' => true
             *  ];.
             */

            // If the value is not empty
            if (!empty($reply_record['value'])) {
                /* Use urldecode() to convert all encoded values to their decoded counterparts e.g
                 *
                 *  "%23" is an encoded value representing "#"
                 */
                return urldecode($reply_record['value']);
            }

            //  Return an empty reply
            return '';

            //  Filter to remove empty replies and convert to Array
        })->filter()->toArray();

        //  Example "1*2*4*john*doe*36*1"
        $text = implode('*', $responses);

        //  Return the responses as text separated using the "*" sybmbol
        return $text;
    }

    /** Return an Array of all the user responses of the current session
     *  e.g ['1', '2', '4', 'john', 'doe', '36', '1'].
     */
    public function getUserResponses($text = null)
    {
        /** Get the user responses from the reply records as a long chain of text responses.
         *  The "extractUserResponsesAsText()" returns responses separated using the "*" sybmbol.
         *  We need to explode the given responses to have access to each and every response e.g.
         *
         *  $text = "1*2*4*john*doe*36*1"
         *
         *  After we explode:
         *
         *  $responses = ['1', '2', '4', 'john', 'doe', '36', '1']
         *
         *  $responses[0] = Response from screen 1 (Landing Screen / First Screen)
         *  $responses[1] = Response from screen 2 (Second Screen)
         *
         *  e.t.c
         */
        $text = $text ?? $this->extractUserResponsesAsText();

        //  Extract responses to an Array
        $responses = explode('*', $text);

        //  Remove any null or empty responses from Array
        $responses = collect($responses)->filter(function($response){
                        return (!is_null($response) && trim($response) !== '');
                    })->toArray();

        return $responses;
    }

    /** Return the user response of a given Level. Assuming we have 3 responses:
     *  $responses = ['Johnathan', 'Miller', '25']. Then.
     *
     *  Level 1 response = 'Johnathan'   (Response to Screen 1)
     *  Level 2 response = 'Miller'   (Response to Screen 2)
     *  Level 3 response = '25'   (Response to Screen 3)
     */
    public function getResponseFromLevel($levelNumber = null)
    {
        //  If we have a level number provided
        if ($levelNumber) {
            //  Get all the user responses
            $user_responses = $this->getUserResponses();

            /* We want to say if we have "levelNumber = 1" we should get the landing screen response
             *  (since thats level 1) but technically "$user_responses[0] = landing screen response".
             *  This means to get the response for the level we want we must decrement by one unit.
             */

            return isset($user_responses[$levelNumber - 1]) ? $user_responses[$levelNumber - 1] : null;
        }
    }

    /** Return true or false whether the user has responded to a
     *  specific level e.g Return true if the user responded to
     *  a given Level.
     */
    public function completedLevel($levelNumber = null)
    {
        //  If we have a level number provided
        if ($levelNumber) {
            //  Check if we have a response for this level number
            $level = $this->getResponseFromLevel($levelNumber);

            //  If the level specified is completed (Has a response from the user)
            return isset($level) && $level != '';
        }
    }

    /*  Receives a variable name and value for storage as dynamic
     *  key/values that can be initialized as valid PHP variables
     *  with data properties
     */
    public function setProperty($name = null, $value = null, $log_status = true)
    {
        //  If the variable name is provided and is not empty
        if (isset($name) && !empty($name)) {
            //  If the variable name already exists among the stored values
            if (isset($this->dynamic_data_storage[$name])) {
                //  Set a warning log that we are overiding existing data
                if ($log_status) {
                    $this->logInfo('Found existing data already stored within the reference name '.$this->wrapAsSuccessHtml($name).', overiding the information.');
                }

                //  Get the old data type wrapped in html tags
                $dataType = $this->wrapAsSuccessHtml($this->getDataType($this->getDynamicData($name)));

                //  Set an info log of the old data stored
                if ($log_status) {
                    //  Use json_encode($dataType) to show $dataType data instead of getDataType($dataType)
                    $this->logInfo('Old value: ['.$dataType.']');
                }

                //  Replace the dynamic data within our dynamic data storage
                $this->dynamic_data_storage[$name] = $value;

                //  Get the new data type wrapped in html tags
                $dataType = $this->wrapAsSuccessHtml($this->getDataType($this->getDynamicData($name)));

                //  Set an info log of the new data stored
                if ($log_status) {
                    //  Use json_encode($dataType) to show $dataType data instead of getDataType($dataType)
                    $this->logInfo('New value: ['.$dataType.']');
                }

                //  If the variable name does not already exist among the stored values
            } else {
                //  Add the value as additional dynamic data to our dynamic data storage
                $this->dynamic_data_storage[$name] = $value;
            }
        }
    }

    public function getDynamicData($name = null, $default_value = null)
    {
        //  Get the entire dynamic data storage
        $result = $this->dynamic_data_storage;

        //  If the dynamic property name has not been provided
        if ($name != null) {
            /** Note that the given $name can either be a simple reference name e.g "ussd"
             *  or a more complex reference name e.g "ussd.text". The final result must
             *  convert into any of the following:.
             *
             *  If $name = "ussd" then return $this->dynamic_data_storage['ussd']
             *  If $name = "ussd.text" then return $this->dynamic_data_storage['ussd']['text']
             *  ... e.t.c
             */

            /** STEP 1
             *
             *  Convert $name = "ussd" into ['ussd'].
             *
             *  or
             *
             *  Convert $name = "ussd.text" into ['ussd', 'text']
             */
            $properties = explode('.', $name);

            /* STEP 2
             *
             *  Iterate over the properties
             */
            for ($i = 0; $i < count($properties); ++$i) {
                /** STEP 3
                 *
                 *  Foreach property e.g "ussd" or "text".
                 *
                 *  Get the $result then get the property value
                 *  from the $result e.g
                 *
                 *  $result = [ ... ]
                 *  $properties = ['ussd', 'text']
                 *  $i = 0, 1, 2, 3 ...
                 *
                 *  $properties[i] = 'ussd' or 'text'
                 *
                 *  $result[$properties[i]] is the same as:
                 *  $result['ussd'] or $result['text']
                 */

                //  Make sure that the given property exists
                if (isset($result[$properties[$i]])) {
                    /** Equate the $result to the property value. In the first loop $result is equal to the
                     *  data within $this->dynamic_data_storage. During this first loop we capture the value
                     *  of $result['text'] which is exactly the same as $this->dynamic_data_storage['ussd'],
                     *  and then make that value the new value for the $result property. On the second loop
                     *  we then capture the result of $result['text'] which will be exactly the same as
                     *  $this->dynamic_data_storage['ussd']['text']. This process keeps repeating over
                     *  and over until we get to the last property.
                     */
                    $result = $result[$properties[$i]];
                } else {
                    //  Set $result to the deafult value to indicate that the value of such a property does not exist
                    $result = $default_value;
                }
            }
        }

        return $result;
    }

    /** Return the given value data type e.g String, Array, Boolean, e.t.c */
    public function getDataType($value)
    {
        return ucwords(gettype($value));
    }

    /** Wrap in primary colored HTML Tags */
    public function wrapAsPrimaryHtml($value)
    {
        return $this->wrapWithinHtml('text-blue-500', $value);
    }

    /** Wrap in success colored HTML Tags */
    public function wrapAsSuccessHtml($value)
    {
        return $this->wrapWithinHtml('text-green-500', $value);
    }

    /** Wrap in warning colored HTML Tags */
    public function wrapAsWarningHtml($value)
    {
        return $this->wrapWithinHtml('text-yellow-500', $value);
    }

    /** Wrap in error colored HTML Tags */
    public function wrapAsErrorHtml($value)
    {
        return $this->wrapWithinHtml('text-red-500', $value);
    }

    /** Wrap in dynamic data HTML Tags */
    public function wrapAsDynamicDataHtml($value)
    {
        return $this->wrapWithinHtml('bg-blue-100 text-blue-900 shadow-sm rounded-md py-1 px-2 mx-1', $value);
    }

    /** Wrap within HTML Tags */
    public function wrapWithinHtml($type, $value)
    {
        return '<span class="'.$type.'">'.$value.'</span>';
    }

    /******************************************
     *  SCREEN METHODS                        *
     *****************************************/

    /** This method uses the application builder get all the ussd screens,
     *  locate the first screen and start building each screen to be
     *  returned.
     */
    public function startBuildingUssdScreens()
    {
        //  Check if the builder screens exist
        $doesNotExistResponse = $this->handleNonExistentScreens();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($doesNotExistResponse)) {
            return $doesNotExistResponse;
        }

        //  Get the first screen
        $this->getFirstScreen();

        //  Handle current screen
        $response = $this->handleCurrentScreen();

        /** Check if the display data returned is greater than 160 characters.
         *  If it is set a warning log. Subtract out the first four characters
         *  first to remove the "CON " and "END ".
         */
        $characters = (strlen($response) - 4);

        if ($characters > 160) {
            //  Set a warning log that the content received is too long
            $this->logWarning('The screen content exceeds the maximum allowed content length of 160 characters. Returned '.$this->wrapAsSuccessHtml($characters).' characters');
        } else {
            //  Set an info log of the content character length
            $this->logInfo('Content Characters: '.$this->wrapAsSuccessHtml($characters).' characters');
        }

        return $response;
    }

    /*  Validate the existence of the builder screens. If the screens do not exist then
     *  return the technical difficulties screen. This screen will also cause the
     *  end of the current session since its an ending screen.
     */
    public function handleNonExistentScreens()
    {
        //  Check if the screens exist
        if ($this->checkIfScreensExist() == false) {
            //  Set a warning log that we could not find the builder screens
            $this->logWarning($this->wrapAsPrimaryHtml($this->app->name).' App does not have any screens to show');

            //  Return a custom error (The showEndScreen will terminate the session)
            return $this->showEndScreen('The app "'.$this->app->name.'" does not have any screens to show');
        }

        //  Return null if we have screens
        return null;
    }

    /** This method checks if the builder screens exist. It will return true if
     *  we have screens to show and false if we don't have screens to show.
     */
    public function checkIfScreensExist()
    {
        //  Check if the builder has a non empty array of screens
        if (is_array($this->version->builder['screens']) && !empty($this->version->builder['screens'])) {
            //  Return true to indicate that the screens exist
            return true;
        }

        //  Return false to indicate that the screens do not exist
        return false;
    }

    /** This method gets the first screen that we should show. First we look
     *  for a screen indicated by the user. If we can't locate that screen,
     *  we then default to the first available screen that we can display.
     */
    public function getFirstScreen()
    {
        //  Set an info log that we are searching for the first screen
        $this->logInfo('Searching for the first screen', 'searching_first_screen');

        //  Get all the screens available
        $this->screens = $this->version->builder['screens'];

        //  If we are using condi
        if ($this->version->builder['conditional_screens']['active']) {
            $this->logInfo('Processing code to conditionally determine first screen to load');

            //  Get the PHP Code
            $code = $this->version->builder['conditional_screens']['code'];

            //  Process the PHP Code
            $outputResponse = $this->processPHPCode("$code", false);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the processed screen id
            $screen_id = $this->convertToString($outputResponse);

            if ($screen_id) {

                $this->logInfo('Searching for screen using the screen id: '.$this->wrapAsSuccessHtml($screen_id));

                //  Get the screen matching the given screen id
                $outputResponse = $this->searchScreenById($screen_id);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                $this->screen = $outputResponse;

            }
        } else {
            //  Get the first display screen (The one specified by the user)
            $this->screen = collect($this->screens)->where('first_display_screen', true)->first() ?? null;

            //  If we did not manage to get the first display screen specified by the user
            if (!$this->screen) {
                //  Set a warning log that the default starting screen was not found
                $this->logWarning('Default starting screen was not found');

                //  Set an info log that we will use the first available screen
                $this->logInfo('Selecting the first available screen as the default starting screen');

                //  Select the first screen on the ussd builder by default
                $this->screen = $this->version->builder['screens'][0];
            }
        }

        if ($this->screen) {
            //  Set an info log for the first selected screen
            $this->logInfo('Selected '.$this->wrapAsPrimaryHtml($this->screen['name']).' as the first screen', 'selected_screen');
        }
    }

    /** This method first checks if the screen we want to handle exists. This could be the
     *  first display screen or any linked screen. In either case if the screen does not
     *  exist we log a warning and display the technical difficulties screen. We then
     *  check if the given screen is a reapeating or non-repeating screen. If it is
     *  a repeating screen we handle the before repeating events, then call the
     *  repeat screen looping logic and finally call the after repeating events.
     *  If this is not a repeating screen we simply go ahead and start building
     *  the nested displays.
     */
    public function handleCurrentScreen()
    {
        //  Add the current screen to the list of chained screens
        array_push($this->chained_screens, array_merge($this->screen, [
            //  Add metadata related to this chained screen
            'metadata' => [
                /* This text value will allow us to know the order of responses that lead
                 *  up to this screen. This text can then be used whenever we want to
                 *  revisit this screen in the future. This can be done using screen
                 *  or display events such as the "Revisit Event".
                 */
                'text' => $this->chained_screen_metadata['text'],
            ],
        ]));

        //  Check if the current screen exists
        $doesNotExistResponse = $this->handleNonExistentScreen();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($doesNotExistResponse)) {
            return $doesNotExistResponse;
        }

        //  Handle on screen enter events
        $handleEventsResponse = $this->handleOnScreenEnterEvents();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($handleEventsResponse)) {
            return $handleEventsResponse;
        }

        $this->screen_repeats = $this->checkIfScreenRepeats();

        //  Check if the current screen repeats
        if ($this->screen_repeats) {

            //  Handle the repeat screen
            $handleScreenResponse = $this->handleRepeatScreen();

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($handleScreenResponse)) {
                return $handleScreenResponse;
            }

        } else {

            //  Start building the current screen displays
            return $this->startBuildingDisplays();

        }
    }

    /*  Validate the existence of the current screen. If the current screen does not exist
     *  then we return the technical difficulties screen. This screen will also cause the
     *  end of the current session since its an ending screen.
     */
    public function handleNonExistentScreen()
    {
        //  If the linked screen exists
        if (empty($this->screen)) {
            //  Set a warning log that the linked screen could not be found
            $this->logWarning('The linked screen could not be found');

            //  Show the technical difficulties error screen to notify the user of the issue
            return $this->showTechnicalDifficultiesErrorScreen();
        }

        return null;
    }

    /*  Check if the current screen repeats
     */
    public function checkIfScreenRepeats()
    {
        //  Set an info log that we are checking if the current screen repeats
        $this->logInfo('Checking if '.$this->wrapAsPrimaryHtml($this->screen['name']).' repeats');

        //  Get the active state value
        $activeState = $this->processActiveState($this->screen['repeat']['active']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($activeState)) {
            return $activeState;
        }

        //  If the screen is set to repeats
        if ($activeState === true) {
            //  Set an info log that the current screen does repeat
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' does repeat');

            //  Return true to indicate that the screen does repeat
            return true;
        }

        //  Set an info log that the current screen does not repeat
        $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' does not repeat');

        //  Return false to indicate that the screen does not repeat
        return false;
    }

    /*  Determine the type of repeating screen that has been indicated.
     *  e.g "Repeat On Items", "Repeat On Number", e.t.c
     */
    public function handleRepeatScreen()
    {
        //  Get the repeat type e.g "repeat_on_number" or "repeat_on_items"
        $repeatType = $this->screen['repeat']['selected_type'];

        //  If the screen is set to repeats
        if ($repeatType == 'repeat_on_number') {
            //  Set an info log that the current screen repeats on a given number
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' repeats on a given number');
        } elseif ($repeatType == 'repeat_on_items') {
            //  Set an info log that the current screen repeats on a set of items
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' repeats on a group of items');
        }

        //  Start the repeat screen process
        return $this->startRepeatScreen($repeatType);
    }

    /*  Start the screen repeat process based on the specified
     *  type of repeating strategy e.g "Repeat On Items",
     *  "Repeat On Number", e.t.c
     */
    public function startRepeatScreen($type)
    {
        if ($type == 'repeat_on_items') {
            $repeat_data = $this->screen['repeat']['repeat_on_items'];

            //  Get the group reference value e.g mustache tag or PHP Code
            $group_reference = $repeat_data['group_reference'];

            //  Get the current item reference name e.g "product"
            $item_reference_name = $repeat_data['item_reference_name'];

            //  Convert the group reference value into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($group_reference);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output e.g "An Array of products"
            $items = $outputResponse;
        } elseif ($type == 'repeat_on_number') {
            $repeat_data = $this->screen['repeat']['repeat_on_number'];

            $repeat_number = $repeat_data['value'];

            //  Convert the repeat number into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($repeat_number);

            //  Get the generated number otherwise default to zero (0)
            $repeat_number_value = $this->convertToInteger($outputResponse) ?? 0;

            //  If the number is equal to zero
            if ($repeat_number_value == 0) {
                //  Set a warning log that we are converting the dynamic property to its associated value
                $this->logWarning('The repeat number has a value = '.$this->wrapAsSuccessHtml('0').', therefore we won\'t be able to loop and repeat the screen');
            }

            /** Fill the $items with an array of values starting with Index = 0. Add items equal to the
             *  number of the $repeat_number_value. Example results:.
             *
             *  array_fill(0, 5, 'item') = ['item', 'item', 'item', 'item', 'item'];
             */
            $items = array_fill(0, $repeat_number_value, 'item');
        }

        //  Get the total items reference name e.g "total_products"
        $total_loops_reference_name = $repeat_data['total_loops_reference_name'];

        //  Get the current loop index reference name e.g "product_index"
        $loop_index_reference_name = $repeat_data['loop_index_reference_name'];

        //  Get the current loop number reference name e.g "product_number"
        $loop_number_reference_name = $repeat_data['loop_number_reference_name'];

        //  Get the reference name for confirming if the current item is the first item e.g "is_first_product"
        $is_first_loop_reference_name = $repeat_data['is_first_loop_reference_name'];

        //  Get the reference name for confirming if the current item is the last item e.g "is_last_product"
        $is_last_loop_reference_name = $repeat_data['is_last_loop_reference_name'];

        //  Check if the given items are of type Array
        if (is_array($items)) {
            //  Check if we have any items
            if (count($items) > 0) {
                //  Foreach item
                for ($x = 0; $x < count($items); ++$x) {
                    //  Set an info log of the current repeat instance
                    $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' repeat instance ['.$this->wrapAsPrimaryHtml($x + 1).']');

                    //  If we are repeating on a set of items
                    if ($type == 'repeat_on_items') {
                        //  If the item reference name is provided
                        if (!empty($item_reference_name)) {
                            //  Store the current item using the given item reference name
                            $this->setProperty($item_reference_name, $items[$x]);
                        }
                    }

                    //  If the total items reference name is provided
                    if (!empty($total_loops_reference_name)) {
                        //  Store the current total items using the given reference name
                        $this->setProperty($total_loops_reference_name, count($items));
                    }

                    //  If the item index reference name is provided
                    if (!empty($loop_index_reference_name)) {
                        $this->logInfo('Item Index: ['.$this->wrapAsPrimaryHtml($x).']');

                        //  Store the current item index using the given item reference name
                        $this->setProperty($loop_index_reference_name, $x);
                    }

                    //  If the item number reference name is provided
                    if (!empty($loop_number_reference_name)) {
                        $this->logInfo('Item Number: ['.$this->wrapAsPrimaryHtml($x + 1).']');

                        //  Store the current item number using the given item reference name
                        $this->setProperty($loop_number_reference_name, ($x + 1));
                    }

                    //  If the first item reference name is provided
                    if (!empty($is_first_loop_reference_name)) {
                        $this->logInfo('Item Is First: ['.$this->wrapAsPrimaryHtml(($x == 0)).']');

                        //  Store the true/false result for first item using the given item reference name
                        $this->setProperty($is_first_loop_reference_name, ($x == 0));
                    }

                    //  If the last item reference name is provided
                    if (!empty($is_last_loop_reference_name)) {
                        $this->logInfo('Item Is Last: ['.$this->wrapAsPrimaryHtml((($x + 1) == count($items))).']');

                        //  Store the true/false result for last item using the given item reference name
                        $this->setProperty($is_last_loop_reference_name, (($x + 1) == count($items)));
                    }

                    //  Start building the current screen displays
                    $buildResponse = $this->startBuildingDisplays();

                    /** If we must navigate forward / backward then we must determine where the navigation must occur.
                     *  Remember that it is possible to have multiple nested screens using the repeat logic e.g.
                     *
                     *  Screen 1 (Repeat logic 1)
                     *      Screen 2 (Repeat logic 2)
                     *          Screen 3 (Repeat logic 3)
                     *              ... e.t.c
                     *
                     *  It can happen that while we are using the repeat logic in "Screen 3" that the user indicates
                     *  that they want to navigate i.e (iterate forward/backward). In that instance we need to inspect
                     *  where exactly does the user want to perform the navigation i.e (At Screen 1, Screen 2 or at
                     *  Screen 3). We can use the specified screen link to determine the target screen e.g
                     *
                     *  $this->navigation_target_screen_id = "specified screen id"
                     *
                     *  The "$this->navigation_target_screen_id" represents the ID of the screen that must be targeted to
                     *  perform the navigation action. We must match each linked Screen using the repeat logic to determine
                     *  if it is the target screen.
                     */
                    if ($this->navigation_request_type == 'navigate-forward' || $this->navigation_request_type == 'navigate-backward') {
                        //  If the current screen id does not match the navigation target screen id
                        if ($this->screen['id'] != $this->navigation_target_screen_id) {
                            /* Remember that we run handleCurrentScreen() method on every screen. This method will
                             *  add the current screen being handled to the list of "chained screens". The "chained
                             *  screens" keeps track of every screen that we are processing. It works like an up to
                             *  date history of every screen being worked on. When we handle any screen, we first
                             *  store it in the list of "chained screens", then we start processing that screen,
                             *  for instance, we start checking if the given screen exists, if its a reapeating
                             *  or non-repeating screen, If it is a repeating screen we handle the looping logic
                             *  and so on. Each screen stored in the list of "chained screens" also contains
                             *  metadata with additional properties such as the "responses by the user to
                             *  reach that given screen".
                             *
                             *  Since the current screen does not match the navigation target, we need to go back to
                             *  the previous linked screen if any and run the same logic to see if it matches up as
                             *  the target screen. To do this we access the history of "chained screens". This is a
                             *  list of screens that were recorded each time we linked from one screen to another.
                             *  We must remove this current screen first from the list of "chained screens" in
                             *  order for us to only have a list of previous linked screens without the current
                             *  screen included. This will allow us to check if we have any previous chaining
                             *  screens.
                             */

                            /* Lets remove the current screen from the list of "chained screens". We should only be
                             *  left with a list of previous "chained screens" without the current screen included
                             */
                            array_pop($this->chained_screens);

                            /* Now that we have removed the current screen from the list of "chained screens".
                             *  We should only be left with a list of previous "chained screens" without the current
                             *  screen included. We can count if we have any "chained screens"
                             */
                            if (count($this->chained_screens)) {
                                /* Since we have a list of previous "chained screens", we can get the last chained
                                 *  screen and set this screen as the current screen.
                                 */
                                $this->screen = $this->chained_screens[count($this->chained_screens) - 1];
                            }

                            /* Return the build response to the previous screen for processing.
                             *  If the previous linked screen uses the repeat logic, then it will
                             *  also run this logic to determine if it should navigate forward or
                             *  backward otherwise it will also return the build response to its
                             *  previous linked screen.
                             */
                            return $buildResponse;
                        }

                        //  Continue navigation processs below
                    }

                    //  If we must navigate forward then proceed to next iteration otherwise continue
                    if ($this->navigation_request_type == 'navigate-forward') {
                        //  If this is not the last item then we can navigate forward
                        if (($x + 1) != count($items)) {
                            /** Use the forward navigation step number to decide which next iteration to target. For instance if
                             *  the number we receive equals 1 it means target the first next item. If the number we receive
                             *  equals 2 it means target the second next item. This is of course we assume the item in that
                             *  requested position exists. If it does not exist we work backwards to target the closest
                             *  available item. For instance lets assume we have items in position 1, 2, 3 and 4. We are
                             *  currently in position 1. If the step number equals "1" we target item in position "2".
                             *  If the step number equals "2" we target item in position "3" and so on. Now lets
                             *  assume we have number equals "4", this means we target item in position "5" but
                             *  such an item does not exist. This means we work backwards to target item in
                             *  position "4" instead.
                             *
                             *  $this->navigation_step_number = 1, 2, 3 ... e.t.c
                             */
                            $step = $this->navigation_step_number;

                            /** Assume $step = 5, this means we want to skip to every 5th item.
                             *
                             *  If $y = 0 ; This means we are currently targeting [Item 1].
                             *
                             *  If $step = 5; This means we want to target item of index number "5" [Item 6] (if it exists).
                             *  Note that item of index "5" is actually [Item 6]. A simple way to see this
                             *  is in this manner:
                             *
                             *  [Item 1] + 5 steps = [Item 6]
                             *
                             *  Visual example with $step = 5
                             *  --------------------------------------------------------
                             *  From    [1] 2  3  4  5  6  7  8  9  10  11  12 ...
                             *  To       1  2  3  4  5 [6] 7  8  9  10  11  12 ...
                             *  ...      1  2  3  4  5  6  7  8  9  10 [11] 12 ...
                             *           .  .  .  .  .  .  .  .  .   .   .   .
                             *           .  .  .  .  .  .  .  .  .   .   .   .
                             *  --------------------------------------------------------
                             *  Indexes: 0  1  2  3  4  5  6  7  8   9  10  11
                             *  --------------------------------------------------------
                             *
                             *  Translated into index format:
                             *
                             *  [Item Index 0] + 5 steps = [Item Index 5]
                             */
                            for ($y = $step; $y >= 1; --$y) {
                                // Example: For $y = 5 ... 4 ... 3 ... 2 ... 1

                                /** Note $items[$x] targets the current item and $items[$x + $y] targets the next item.
                                 *  If the item we want to target does not exist, then we attempt to target the item
                                 *  before it. We repeat this until we can get an existing item to target.
                                 *
                                 *  Example: If we wanted to target [item 6] but it does not exist, then we try to
                                 *  target [item 5], then [item 4] and so on... If we reach a point where no items
                                 *  after [item 1] can be found then we do not iterate anymore.
                                 */
                                if (isset($items[$x + $y])) {
                                    $this->logInfo('Navigating to '.$this->wrapAsPrimaryHtml('Item #'.($x + $y + 1)));

                                    /** If the item exists then we need to alter the parent for($x){ ... } method to target
                                     *  the item we want.
                                     *
                                     *  Lets assume [item 6] was found 5 steps after [item 1]. Since normally the for($x){ ... }
                                     *  would increment the $x value by only (1), we need to alter its bahaviour to increment
                                     *  based on the $y value we have. Basically to target the item we want we will use:
                                     *
                                     *  $items[index] where index = ($x + $y)
                                     *
                                     *  However on the next iteration the index value will be incremented by (1) and the result
                                     *  will be:
                                     *
                                     *  $items[index] where index = ($x + $y + 1)
                                     *
                                     *  To counteract this result we must make sure that the index value is decremented by (1)
                                     *  i.e index = ($x + $y - 1) so that on next iteration index = ($x + $y - 1 + 1) giving
                                     *  us the final output of index = ($x + $y) to target the item we want
                                     */
                                    $x = ($x + $y - 1);

                                    //  Stop the current loop
                                    break 1;
                                }
                            }
                        } else {
                            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' has reached the last item of the repeat loop');

                            //  Get the "After Last Loop Behaviour Type" e.g "do_nothing", "link"
                            $after_last_loop = $repeat_data['after_last_loop']['selected_type'];

                            //  Do nothing else
                            if ($after_last_loop == 'do_nothing') {
                                $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is defaulting to building and showing its first display');

                            //  Link to screen
                            } elseif ($after_last_loop == 'link') {
                                $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to link to another screen');

                                //  Hold reference to the current screen name
                                $current_screen_name = $this->screen['name'];

                                //  Get the provided link (The display or screen we must link to after the last loop of this screen)
                                $link = $repeat_data['after_last_loop']['link'];

                                //  Get the screen matching the given link
                                $outputResponse = $this->searchScreenById($link);

                                //  If we have a screen to show return the response otherwise continue
                                if ($this->shouldDisplayScreen($outputResponse)) {
                                    return $outputResponse;
                                }

                                $screen = $outputResponse;

                                //  If the screen to link to was found
                                if ($screen) {
                                    $this->screen = $screen;

                                    $this->logInfo($this->wrapAsPrimaryHtml($current_screen_name).' is linking to '.$this->wrapAsPrimaryHtml($this->screen['name']));

                                    //  Start building the current screen displays
                                    return $this->startBuildingDisplays();
                                }
                            }

                            return $buildResponse;
                        }

                        //  Do nothing else so that we iterate to the next specified item on the list
                    } elseif ($this->navigation_request_type == 'navigate-backward') {
                        /** Use the forward navigation step number to decide which next iteration to target. For instance if
                         *  the number we receive equals 1 it means target the first previous item. If the number we receive
                         *  equals 2 it means target the second previous item. This is of course we assume the item in that
                         *  requested position exists. If it does not exist we work forward to target the closest available
                         *  item. For instance lets assume we have items in position 1, 2, 3 and 4. We are currently in
                         *  position 4. If the step number equals "1" we target item in position "3". If the step number
                         *  equals "2" we target item in position "2" and so on. Now lets assume we have number equals "4",
                         *  this means we target item in position "0" but such an item does not exist. This means we work
                         *  forward to target item in position "1" instead.
                         *
                         *  $this->navigation_step_number = 1, 2, 3 ... e.t.c
                         */
                        $step = $this->navigation_step_number;

                        /** Assume $step = 5, this means we want to skip to every previous 5th item.
                         *
                         *  If $y = 10 ; This means we are currently targeting [Item 11].
                         *
                         *  If $step = 5; This means we want to target item of index number "5" [Item 6] (if it exists).
                         *  Note that item of index "5" is actually [Item 6]. A simple way to see this
                         *  is in this manner:
                         *
                         *  [Item 11] - 5 steps = [Item 6]
                         *
                         *  Visual example with $step = 5
                         *  --------------------------------------------------------
                         *  From     1  2  3  4  5  6  7  8  9  10 [11] 12 ...
                         *  To       1  2  3  4  5 [6] 7  8  9  10  11  12 ...
                         *  ...     [1] 2  3  4  5  6  7  8  9  10  11  12 ...
                         *           .  .  .  .  .  .  .  .  .   .   .   .
                         *           .  .  .  .  .  .  .  .  .   .   .   .
                         *  --------------------------------------------------------
                         *  Indexes: 0  1  2  3  4  5  6  7  8   9  10  11
                         *  --------------------------------------------------------
                         *
                         *  Translated into index format:
                         *
                         *  [Item Index 10] - 5 steps = [Item Index 5]
                         */
                        for ($y = $step; $y >= 0; --$y) {
                            // Example: For $y = 5 ... 4 ... 3 ... 2 ... 1 ... 0

                            /** Note $items[$x] targets the current item and $items[$x - $y] targets the previous item.
                             *  If the item we want to target does not exist, then we attempt to target the item
                             *  after it. We repeat this until we can get an existing item to target.
                             *
                             *  Example: If we wanted to target [item -1] but it does not exist, then we try to
                             *  target [item 0], then [item 1] and so on... If we reach a point where no items
                             *  after [item -1] can be found then we do not iterate anymore.
                             */
                            if (isset($items[$x - $y])) {
                                $this->logInfo('Navigating to '.$this->wrapAsPrimaryHtml('Item #'.($x - $y + 1)));

                                /** If the item exists then we need to alter the parent for($x){ ... } method to target
                                 *  the item we want.
                                 *
                                 *  Lets assume [item 6] was found 5 steps before [item 11]. Since normally the for($x){ ... }
                                 *  would increment the $x value by only (1), we need to alter its bahaviour to increment
                                 *  based on the $y value we have. Basically to target the item we want we will use:
                                 *
                                 *  $items[index] where index = ($x - $y)
                                 *
                                 *  However on the next iteration the index value will be incremented by (1) and the result
                                 *  will be:
                                 *
                                 *  $items[index] where index = ($x - $y + 1)
                                 *
                                 *  To counteract this result we must make sure that the index value is decremented by (1)
                                 *  i.e index = ($x - $y - 1) so that on next iteration index = ($x - $y - 1 + 1) giving
                                 *  us the final output of index = ($x - $y) to target the item we want
                                 */

                                //return 'CON $x = '.$x.' $y = '.$y;

                                $x = ($x - $y - 1);

                                //return 'CON Final $x = '.$x;

                                //  Stop the current loop
                                break 1;
                            }
                        }

                        //  If we reached this area, then we could not find any

                        //  Do nothing else so that we iterate to the next specified item on the list
                    } else {
                        return $buildResponse;
                    }
                }
            } else {
                $this->logWarning($this->wrapAsPrimaryHtml($this->screen['name']).' has '.$this->wrapAsPrimaryHtml('0').' loops. For this reason we cannot repeat over the screen displays');

                //  Get the "No Loop Behaviour Type" e.g "do_nothing", "link"
                $on_no_loop_type = $repeat_data['on_no_loop']['selected_type'];

                //  Do nothing
                if ($on_no_loop_type == 'do_nothing') {
                    $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is defaulting to building and showing its first display');

                //  Do nothing else
                } elseif ($on_no_loop_type == 'link') {
                    $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to link to another screen');

                    //  Hold reference to the current screen name
                    $current_screen_name = $this->screen['name'];

                    //  Get the provided link (The display or screen we must link to if we don't have loops for this screen)
                    $link = $repeat_data['on_no_loop']['link'];

                    //  Get the screen matching the given link
                    $outputResponse = $this->searchScreenById($link);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    $screen = $outputResponse;

                    //  If the screen to link to was found
                    if ($screen) {
                        $this->screen = $screen;

                        $this->logInfo($this->wrapAsPrimaryHtml($current_screen_name).' is linking to '.$this->wrapAsPrimaryHtml($this->screen['name']));
                    }
                }

                //  Start building the current screen displays
                return $this->startBuildingDisplays();
            }
        } else {
            //  Get the items type wrapped in html tags
            $dataType = $this->wrapAsSuccessHtml($this->getDataType($items));

            //  Set a warning log that the dynamic property is not an array
            $this->logWarning('The looping items provided must be of type ['.$this->wrapAsSuccessHtml('Array').'] however we received type of ['.$dataType.']. For this reason we cannot repeat the screen');
        }
    }

    /******************************************
     *  DISPLAY METHODS                        *
     *****************************************/

    /** This method uses the current screen get all the screen displays,
     *  locate the first display and start building each display to be
     *  returned.
     */
    public function startBuildingDisplays()
    {
        //  Check if the current screen displays exist
        $doesNotExistResponse = $this->handleNonExistentDisplays();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($doesNotExistResponse)) {
            return $doesNotExistResponse;
        }

        //  Get the first display
        $this->getFirstDisplay();

        //  Handle current display
        return $this->handleCurrentDisplay();
    }

    /*  Validate the existence of the screen displays. If the displays do not exist then
     *  return the technical difficulties screen. This screen will also cause the
     *  end of the current session since its an ending screen.
     */
    public function handleNonExistentDisplays()
    {
        //  Check if the displays exist
        if ($this->checkIfDisplaysExist() != true) {
            //  Set a warning log that we could not find the displays
            $this->logWarning($this->wrapAsPrimaryHtml($this->screen['name']).' does not have any displays to show');

            //  Return a custom error (The showEndScreen will terminate the session)
            return $this->showEndScreen('The app "'.$this->app->name.'" does not have any displays to show');
        }

        //  Return null if we have displays
        return null;
    }

    /** This method checks if the screen displays exist. It will return true if
     *  we have displays to show and false if we don't have displays to show.
     */
    public function checkIfDisplaysExist()
    {
        //  Check if the screen has a non empty array of displays
        if (is_array($this->screen['displays']) && !empty($this->screen['displays'])) {
            //  Return true to indicate that the displays exist
            return true;
        }

        //  Return false to indicate that the displays do not exist
        return false;
    }

    /** This method gets the first display that we should show. First we look
     *  for a display indicated by the user. If we can't locate that display,
     *  we then default to the first available display that we can display.
     */
    public function getFirstDisplay()
    {
        //  Set an info log that we are searching for the first display
        $this->logInfo('Searching for the first display', 'searching_first_display');

        //  Get all the displays available
        $this->displays = $this->screen['displays'];

        //  If we are using condi
        if ($this->screen['conditional_displays']['active']) {
            $this->logInfo('Processing code to conditionally determine first display to load');

            //  Get the PHP Code
            $code = $this->screen['conditional_displays']['code'];

            //  Process the PHP Code
            $outputResponse = $this->processPHPCode("$code", false);

            //  If we have a display to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the processed screen id
            $display_id = $this->convertToString($outputResponse);

            if ($display_id) {

                $this->logInfo('Searching for display using the display id: '.$this->wrapAsSuccessHtml($display_id));

                //  Get the display matching the given display id
                $outputResponse = $this->getDisplayById($display_id);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                $this->display = $outputResponse;

            }
        } else {
            //  Get the first display (The one specified by the user)
            $this->display = collect($this->displays)->where('first_display', true)->first() ?? null;

            //  If we did not manage to get the first display specified by the user
            if (!$this->display) {
                //  Set a warning log that the default starting display was not found
                $this->logWarning('Default starting display was not found');

                //  Set an info log that we will use the first available display
                $this->logInfo('Selecting the first available display as the default starting display');

                //  Select the first display on the available displays by default
                $this->display = $this->displays[0];
            }
        }

        if ($this->display) {
            //  Set an info log for the first selected display
            $this->logInfo('Selected '.$this->wrapAsPrimaryHtml($this->display['name']).' as the first display', 'selected_display');
        }
    }

    /** This method first checks if the display we want to handle exists. This could be the
     *  first display or any linked display. In either case if the display does not exist
     *  we log a warning and show the technical difficulties screen. We then check if the
     *  user has already responded to the current display. If (No) then we build and
     *  return the current display. If (Yes) then we need to validate, format and
     *  store the users response respectively if specified and handle any
     *  additional logic such as linking to respective displays/displays.
     */
    public function handleCurrentDisplay()
    {
        //  Add the current display to the list of chained displays
        array_push($this->chained_displays, array_merge($this->display, [
            //  Add metadata related to this chained display
            'metadata' => [
                /* This text value will allow us to know the order of responses that lead
                 *  up to this display. This text can then be used whenever we want to
                 *  revisit this display in the future. This can be done using screen
                 *  or display events such as the "Revisit Event".
                 */
                'text' => $this->chained_display_metadata['text'],
            ],
        ]));

        //  Reset pagination
        $this->resetPagination();

        //  Reset navigation
        $this->resetNavigation();

        //  Reset incorrect option selected
        $this->resetIncorrectOptionSelected();

        //  Check if the current display exists
        $doesNotExistResponse = $this->handleNonExistentDisplay();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($doesNotExistResponse)) {
            return $doesNotExistResponse;
        }

        //  Handle before display events
        $handleEventsResponse = $this->handleOnDisplayEnterEvents();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($handleEventsResponse)) {
            return $handleEventsResponse;
        }

        /************************************************
         *  CHECK IF ANY AUTO LINK EVENT WAS EXECUTED   *
         ************************************************/

        /** Handle linking to a specified screen via an "Auto Link" event
         *  that was executed before the user responds to this display.
         */
        $handleLinkingResponse = $this->handleLinkingToScreenOrDisplay();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($handleLinkingResponse)) {
            return $handleLinkingResponse;
        }

        /*****************************************
         *  RECORD THE TOTAL NUMBER OF RESPONSES *
         *  TO THE CURRENT SCREEN & DISPLAY      *
         ****************************************/

        /* Note that this must be done before we can build the current
         *  display otherwise we won't be able to get the latest updated
         *  totals to show on the current display. Basically we would
         *  need to link to another screen to show the update which
         *  is not a desirable outcome.
         */

        //  Check if the user has already responded to the current display screen
        if ($this->hasResponded()) {
            /** Record the number of times we have responded to the screen.
             *
             *  First check if we have a record matching the given screen id.
             *  Note that "$this->screen_total_responses" is an array of screen
             *  id's that linked to the total number of responses for a given
             *  screen e.g.
             *
             *  $this->screen_total_responses = [
             *      'screen_1603621400274' => 1,    //  This means we responded once to screen id "screen_1603621400274"
             *      'screen_1603621400275' => 2,    //  This means we responded twice to screen id "screen_1603621400275"
             *      'screen_1603621400276' => 1,    //  This means we responded once to screen id "screen_1603621400276"
             *      e.t.c ...                       //  and so on ...
             *  ];
             */
            if (isset($this->screen_total_responses[$this->screen['id']])) {
                /** Since the screen has already been recorded before, lets increment
                 *  the existing total number of responses and update the record.
                 */
                $total = ++$this->screen_total_responses[$this->screen['id']];
                Arr::set($this->screen_total_responses, $this->screen['id'], $total);
            } else {
                /* Since the screen has not already been recorded before, lets set the
                 *  total number of responses to 1.
                 *
                 *  Set the "Screen id" with a value equal to 1
                 */
                Arr::set($this->screen_total_responses, $this->screen['id'], 1);
            }

            /** Record the number of times we have responded to the display.
             *
             *  First check if we have a record matching the given display id.
             *  Note that "$this->display_total_responses" is an array of display
             *  id's that linked to the total number of responses for a given
             *  display e.g.
             *
             *  $this->display_total_responses = [
             *      'display_1603621400274' => 1,    //  This means we responded once to display id "display_1603621400274"
             *      'display_1603621400275' => 2,    //  This means we responded twice to display id "display_1603621400275"
             *      'display_1603621400276' => 1,    //  This means we responded once to display id "display_1603621400276"
             *      e.t.c ...                        //  and so on ...
             *  ];
             */
            if (isset($this->display_total_responses[$this->display['id']])) {
                /** Since the display has already been recorded before, lets increment
                 *  the existing total number of responses and update the record.
                 */
                $total = ++$this->display_total_responses[$this->display['id']];
                Arr::set($this->display_total_responses, $this->display['id'], $total);
            } else {
                /* Since the display has not already been recorded before, lets set the
                 *  total number of responses to 1.
                 *
                 *  Set the "Screen id" with a value equal to 1
                 */
                Arr::set($this->display_total_responses, $this->display['id'], 1);
            }
        }

        /************************
         *  BUILD THE DISPLAY   *
         ************************/

        //  Build the current screen display
        $builtDisplay = $this->buildCurrentDisplay();

        //  Check if the user has already responded to the current display screen
        if ($this->hasResponded()) {

            //  Get the user response (Input provided by the user) for the current display screen
            $this->setCurrentScreenUserResponse();

            //  Update the chained screen metadata
            $this->updateChainedScreenMetadata($this->current_user_response);

            //  Update the chained display metadata
            $this->updateChainedDisplayMetadata($this->current_user_response);

            //  Store the user response (Input provided by the user) as a named dynamic variable
            $storeInputResponse = $this->storeCurrentDisplayUserResponseAsDynamicVariable();

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($storeInputResponse)) {
                return $storeInputResponse;
            }

            //  Handle after screen response events
            $handleEventsResponse = $this->handleOnScreenResponseEvents();

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($handleEventsResponse)) {
                return $handleEventsResponse;
            }

            //  Handle after display response events
            $handleEventsResponse = $this->handleOnDisplayResponseEvents();

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($handleEventsResponse)) {
                return $handleEventsResponse;
            }

            //  Handle linking to screen or display
            $handleLinkingResponse = $this->handleLinkingToScreenOrDisplay();

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($handleLinkingResponse)) {
                return $handleLinkingResponse;
            }

            //  Handle forward navigation
            $handleForwardNavigationResponse = $this->handleNavigation('forward');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($storeInputResponse)) {
                return $storeInputResponse;
            }

            //  Handle backward navigation
            $handleBackwardNavigationResponse = $this->handleNavigation('backward');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($storeInputResponse)) {
                return $storeInputResponse;
            }

            /* If the current display intends to navigate or if the linked display intends to
             *  navigate then return the current builtDisplay. We return the current builtDisplay
             *  incase the navigation logic cannot find the screen to navigate, then we can atleast
             *  show the last build display information
             */
            if (($handleLinkingResponse || $this->navigation_request_type) == 'navigate-forward' ||
                 ($handleLinkingResponse || $this->navigation_request_type) == 'navigate-backward') {
                return $builtDisplay;
            }

            // If we have the "incorrect option selected message"
            if (!empty($this->incorrect_option_selected)) {
                /* Get the "incorrect option selected message" and return screen
                 *  (with go back option) to notify the user of the issue
                 */
                return $this->showCustomGoBackScreen($this->incorrect_option_selected);
            }
        }

        //  Determine whether to remove dynamic content highlighting
        if ($this->allow_dynamic_content_highlighting == false) {
            //  Remove any HTML or PHP tags
            $builtDisplay = strip_tags($builtDisplay);
        }

        return $builtDisplay;
    }

    /** Update the "text" of the chained screen metadata. This value is used to hold all
     *  the responses leading to a given chained screen. This allows us to know the exact
     *  order of user responses that were provided in order to trigger a sequence of events
     *  leading to the given "chained screen".
     */
    public function updateChainedScreenMetadata($reply)
    {
        if (empty($this->chained_screen_metadata['text'])) {
            $this->chained_screen_metadata['text'] = $reply;
        } else {
            $this->chained_screen_metadata['text'] .= '*'.$reply;
        }
    }

    /** Update the "text" of the chained display metadata. This value is used to hold all
     *  the responses leading to a given chained display. This allows us to know the exact
     *  order of user responses that were provided in order to trigger a sequence of events
     *  leading to the given "chained display".
     */
    public function updateChainedDisplayMetadata($reply)
    {
        if (empty($this->chained_display_metadata['text'])) {
            $this->chained_display_metadata['text'] = $reply;
        } else {
            $this->chained_display_metadata['text'] .= '*'.$reply;
        }
    }

    /*  Validate the existence of the current display. If the current display does not exist
     *  then we return the technical difficulties screen. This screen will also cause the
     *  end of the current session since its an ending screen.
     */
    public function handleNonExistentDisplay()
    {
        //  If the linked display exists
        if (empty($this->display)) {
            //  Set a warning log that the linked display could not be found
            $this->logWarning('The linked display could not be found');

            //  Show the technical difficulties error screen to notify the user of the issue
            return $this->showTechnicalDifficultiesErrorScreen();
        }

        return null;
    }

    /** Build the current display viewport. This means that we start
     *  building the display instruction and actions that are
     *  required to be shown on the screen.
     */
    public function buildCurrentDisplay()
    {
        //  Set an info log that we are building the display
        $this->logInfo('Building display: '.$this->wrapAsPrimaryHtml($this->display['name']));

        //  Build the display instruction
        $instructionsBuildResponse = $this->buildDisplayInstruction();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($instructionsBuildResponse)) {
            return $instructionsBuildResponse;
        }

        //  Set the instruction
        $this->display_instructions = $this->convertToString($instructionsBuildResponse);
        if($this->display['content']['enable_instruction_emoji'] == false) $this->display_instructions = $this->removeEmojis($this->display_instructions);

        //  Build the display actions (E.g Select options)
        $actionBuildResponse = $this->buildDisplayActions();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($actionBuildResponse)) {
            return $actionBuildResponse;
        }

        //  Set the action
        $this->display_actions = $this->convertToString($actionBuildResponse);
        if($this->display['content']['enable_action_emoji'] == false) $this->display_actions = $this->removeEmojis($this->display_actions);

        //  Combine the display instruction and action as the display content
        $this->display_content = $this->display_instructions.$this->display_actions;

        //  Handle the display pagination
        $outputResponse = $this->handlePagination();

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  If the display content is not empty
        if (!empty($this->display_content)) {
            //  Set an info log of the final result
            $this->logInfo(
                '<p>Final result: <br /><div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.$this->wrapAsSuccessHtml($this->display_content).'</div><p>'
            );
        }

        //  Return the display content
        return $this->showCustomScreen($this->display_content);
    }

    /** Build the current display instruction
     */
    public function buildDisplayInstruction()
    {
        //  Get the display instruction value
        $instruction = $this->display['content']['instruction'];

        //  Convert the instruction value into its associated dynamic value
        return $this->convertValueStructureIntoDynamicData($instruction);
    }

    /** Build the current display action e.g Static select option,
     *  dynamic select options or code select options. We first
     *  determine the type of action the display uses, then
     *  build accordinly.
     */
    public function buildDisplayActions()
    {
        //  Get the current display expected action type
        $displayActionType = $this->getDisplayActionType();

        //  If the action is to select an option e.g 1, 2 or 3
        if ($displayActionType == 'select_option') {
            //  Get the current display expected select action type e.g static_options
            $displaySelectOptionType = $this->getDisplaySelectOptionType();

            //  If the select options are basic static options
            if ($displaySelectOptionType == 'static_options') {
                return $this->getStaticSelectOptions('string');

            //  If the select option are dynamic options
            } elseif ($displaySelectOptionType == 'dynamic_options') {
                return $this->getDynamicSelectOptions('string');

            //  If the select option are generated via the code editor
            } elseif ($displaySelectOptionType == 'code_editor_options') {
                return $this->getCodeSelectOptions('string');
            }
        }
    }

    public function removeEmojis($string)
    {    // Match Enclosed Alphanumeric Supplement
        $regex_alphanumeric = '/[\x{1F100}-\x{1F1FF}]/u';
        $clear_string = preg_replace($regex_alphanumeric, '', $string);

        // Match Miscellaneous Symbols and Pictographs
        $regex_symbols = '/[\x{1F300}-\x{1F5FF}]/u';
        $clear_string = preg_replace($regex_symbols, '', $clear_string);

        // Match Emoticons
        $regex_emoticons = '/[\x{1F600}-\x{1F64F}]/u';
        $clear_string = preg_replace($regex_emoticons, '', $clear_string);

        // Match Transport And Map Symbols
        $regex_transport = '/[\x{1F680}-\x{1F6FF}]/u';
        $clear_string = preg_replace($regex_transport, '', $clear_string);

        // Match Supplemental Symbols and Pictographs
        $regex_supplemental = '/[\x{1F900}-\x{1F9FF}]/u';
        $clear_string = preg_replace($regex_supplemental, '', $clear_string);

        // Match Miscellaneous Symbols
        $regex_misc = '/[\x{2600}-\x{26FF}]/u';
        $clear_string = preg_replace($regex_misc, '', $clear_string);

        // Match Dingbats
        $regex_dingbats = '/[\x{2700}-\x{27BF}]/u';
        $clear_string = preg_replace($regex_dingbats, '', $clear_string);

        return $clear_string;
    }

    /** This method gets the type of action to build for the current display
     */
    public function getDisplayActionType()
    {
        //  Available type: "no_action", "input_value" and "select_option"
        return $this->display['content']['action']['selected_type'] ?? '';
    }

    /** This method gets the type of "Select Option" action to build for the current display
     */
    public function getDisplaySelectOptionType()
    {
        //  Available type: "static_options", "dynamic_options" and "code_editor_options"
        return $this->display['content']['action']['select_option']['selected_type'] ?? '';
    }

    /** This method gets the type of "Input" action to build for the current display
     */
    public function getDisplayInputType()
    {
        //  Available type: "single_value_input" and "multi_value_input"
        return $this->display['content']['action']['input_value']['selected_type'] ?? '';
    }

    /** This method builds the static select options
     */
    public function getStaticSelectOptions($returnType = 'array')
    {
        /** Get the available static options
         *
         *  Example Structure:.
         *
         *  [
         *      options => [
         */
        /**
         *          [
         *              name => [
         *                   text => '1. My Option',
         *                 code_editor_text => '',
         *                   code_editor_mode => false
         *               ],
         *               active => [
         *                   text => true,
         *                   code_editor_text => '',
         *                   code_editor_mode => false
         *               ],
         *               value => [
         *                   text => '',
         *                   code_editor_text => '',
         *                   code_editor_mode => false
         *               ],
         *               input => [
         *                   text => '1',
         *                   code_editor_text => '',
         *                   code_editor_mode => false
         *               ],
         *               separator => [
         *                   top => [
         *                       text => '',
         *                       code_editor_text => '',
         *                       code_editor_mode => false
         *                   ],
         *                   bottom => [
         *                       text => '',
         *                       code_editor_text => '',
         *                       code_editor_mode => false
         *                   ]
         *               ],
         *               link =>[
         *                   text => '',
         *                   code_editor_text => '',
         *                   code_editor_mode => false
         *               ],
         *               hexColor => '#CECECE',
         *               comment => ''
         *           ].
         */
        /**
         *      ],
         *      reference_name => '',
         *      no_results_message => [
         *           text => 'No options found',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *      ],
         *      incorrect_option_selected_message => [
         *           text => 'You selected an incorrect option. Go back and try again',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *      ]
         *  ].
         */
        /**
         *  Structure Definition.
         *
         *  name:   Represents the display name of the option (What the user will see)
         *  value:  Represents the actual value of the option (What will be stored)
         *  link:   The screen or display to link to when this option is selected
         *  separator: The top and bottom characters to use as a separator
         *  input:  What the user must input to select this option
         */
        $options = $this->display['content']['action']['select_option']['static_options']['options'] ?? [];

        //  Get the custom "no results message"
        $no_results_message = $this->display['content']['action']['select_option']['static_options']['no_results_message'] ?? null;

        $options = is_array($options) ? $options : [];

        //  Check if we have options to display
        $optionsExist = count($options) ? true : false;

        //  If we have options to display
        if ($optionsExist) {
            $text = "\n";
            $collection = [];

            //  Foreach option
            for ($x = 0; $x < count($options); ++$x) {
                //  Get the current option
                $curr_option = $options[$x];
                $curr_option_number = ($x + 1);
                $curr_option_name = $options[$x]['name'];
                $curr_option_link = $options[$x]['link'];
                $curr_option_value = $options[$x]['value'];
                $curr_option_input = $options[$x]['input'];
                $curr_option_active_state = $options[$x]['active'];
                $curr_option_top_separator = $options[$x]['separator']['top'];
                $curr_option_bottom_separator = $options[$x]['separator']['bottom'];

                //  Get the active state value
                $activeState = $this->processActiveState($curr_option_active_state);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($activeState)) {
                    return $activeState;
                }

                //  If the option is active
                if ($activeState === true) {
                    /*************************
                     * BUILD OPTION NAME     *
                     ************************/

                    //  Convert the "option name" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($curr_option_name);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $option_name = $this->convertToString($outputResponse);

                    //  Set an info log of the option name
                    $this->logInfo('Option name: '.$this->wrapAsSuccessHtml($option_name));

                    /*************************
                     * BUILD OPTION LINK     *
                     ************************/

                    //  Convert the "option link" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($curr_option_link);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $option_link = $this->convertToString($outputResponse);

                    //  Set an info log of the option link
                    $this->logInfo('Option link: '.$this->wrapAsSuccessHtml($option_link));

                    /*************************
                     * BUILD OPTION VALUE    *
                     ************************/

                    //  Convert the "option value" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($curr_option_value);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $option_value = $outputResponse;

                    //  Set an info log of the option value
                    $this->logInfo('Option value: '.$this->wrapAsSuccessHtml($this->convertToString($option_value)));

                    /*************************
                     * BUILD OPTION INPUT    *
                     ************************/

                    //  Convert the "option input" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($curr_option_input);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $option_input = $this->convertToString($outputResponse);

                    //  Set an info log of the option input
                    $this->logInfo('Option input: '.$this->wrapAsSuccessHtml($option_input));

                    /*********************************
                     * BUILD OPTION TOP SEPARATOR    *
                     ********************************/

                    //  Convert the "option top separator" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($curr_option_top_separator);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $option_top_separator = $this->convertToString($outputResponse);

                    //  Set an info log of the option top separator
                    $this->logInfo('Option top separator: '.$this->wrapAsSuccessHtml($option_top_separator));

                    /************************************
                     * BUILD OPTION BOTTOM SEPARATOR    *
                     ***********************************/

                    //  Convert the "option bottom separator" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($curr_option_bottom_separator);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $option_bottom_separator = $this->convertToString($outputResponse);

                    //  Set an info log of the option top separator
                    $this->logInfo('Option bottom separator: '.$this->wrapAsSuccessHtml($option_bottom_separator));

                    /*****************
                     * ADD OPTION    *
                     *****************/

                    //  If the return type is an array format
                    if ($returnType == 'array') {
                        //  Build the option as an array
                        $option = [
                            'name' => $option_name,
                            'input' => $option_input,
                            'value' => (is_null($option_value))
                                    //  Use the entire option data as the value
                                    ? $options[$x]
                                    //  Otherwise use the converted version of the value provided
                                    : $option_value,
                            'link' => $option_link,
                            'separator' => [
                                'top' => $option_top_separator,
                                'bottom' => $option_bottom_separator,
                            ],
                        ];

                        //  Add the option to the rest of our options
                        array_push($collection, $option);

                    //  If the return type is a string format
                    } elseif ($returnType == 'string') {
                        //  If we have a top separator
                        if (!empty($option_top_separator)) {
                            $text .= $option_top_separator."\n";
                        }

                        //  If we have the option name
                        if (!empty($option_name)) {
                            //  Build the option as a string
                            $text .= $option_name."\n";
                        }

                        //  If we have a bottom separator
                        if (!empty($option_bottom_separator)) {
                            $text .= $option_bottom_separator."\n";
                        }
                    }
                }
            }

            if ($returnType == 'array') {
                //  Return the collection of options as an array
                return $collection;
            } elseif ($returnType == 'string') {
                //  Return the options as text
                return $text;
            }

            //  If we don't have options to display
        } else {
            //  If we have instructions to be displayed then add break lines
            $text = (!empty($this->display_instructions) ? "\n\n" : '');

            //  Convert the "no results message" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($no_results_message);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output e.g "No options available"
            $no_results_message = $outputResponse;

            //  Get the custom "no results message" otherwise use the default message
            $text .= ($no_results_message ?? $this->default_no_select_options_message);

            //  Return the custom or default "No options available"
            return $text;
        }
    }

    /** This method builds the dynamic select options
     */
    public function getDynamicSelectOptions($returnType = 'array')
    {
        /** Get the dynamic select options data
         *
         *  Example Structure:.
         *
         *  [
         *        group_reference => [
         *           text => '{{}} items }}',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *       ],
         *       template_reference_name => 'item',
         *       template_display_name => [
         *           text => '',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *       ],
         *       template_value => [
         *           text => '',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *       ],
         *       reference_name => 'selected_item',
         *       no_results_message => [
         *           text => 'No items found',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *       ],
         *       incorrect_option_selected_message => [
         *           text => 'You selected an incorrect option. Go back and try again',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *       ],
         *       link =>[
         *           text => '',
         *           code_editor_text => '',
         *           code_editor_mode => false
         *       ]
         *  ]
         */

        /*********************************
         * BUILD DYNAMIC OPTIONS DATA    *
         *********************************/

        $data_structure = $this->display['content']['action']['select_option']['dynamic_options'] ?? null;
        $group_reference = $data_structure['group_reference'] ?? null;
        $template_reference_name = $data_structure['template_reference_name'] ?? null;
        $template_display_name = $data_structure['template_display_name'] ?? null;
        $template_value = $data_structure['template_value'] ?? null;
        $link = $data_structure['link'] ?? null;

        //  Get the custom "no results message"
        $no_results_message = $data_structure['no_results_message'] ?? null;

        /************************************
         * BUILD DYNAMIC GROUP REFERENCE    *
         ************************************/

        //  Convert the "group reference" value into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($group_reference);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output e.g "An Array of products"
        $options = $outputResponse;

        //  Check if the dynamic options is an array
        if (!is_array($options)) {
            //  Get the options type wrapped in html tags
            $dataType = $this->wrapAsSuccessHtml($this->getDataType($options));

            //  Set a warning log that the dynamic property is not an array
            $this->logWarning('The dynamic options must be of type ['.$this->wrapAsSuccessHtml('Array').'] however we received type of ['.$dataType.']. For this reason we cannot build the select options');

            //  Show the technical difficulties error screen to notify the user of the issue
            return $this->showTechnicalDifficultiesErrorScreen();
        }

        //  Set an info log that we are starting to build the dynamic options
        $this->logInfo('Building dynamic options');

        $options = is_array($options) ? $options : [];

        $optionsExist = count($options);

        //  If we have options to display
        if ($optionsExist == true) {
            $text = "\n";
            $collection = [];

            /*************************
             * BUILD OPTION LINK     *
             ************************/

            //  Convert the "template display link" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($link);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $option_link = $this->convertToString($outputResponse);

            //  Foreach option
            for ($x = 0; $x < count($options); ++$x) {
                //  Generate the option number
                $option_number = ($x + 1);

                /* Add the current item using our custom template reference name as additional
                    *  dynamic data to our dynamic data storage
                    */
                $this->setProperty($template_reference_name, $options[$x]);

                /*************************
                 * BUILD OPTION NAME     *
                 ************************/

                //  Convert the "template display name" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($template_display_name);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output
                $option_name = $this->convertToString($outputResponse);

                //  Set an info log of the option name
                $this->logInfo('Option name: '.$this->wrapAsSuccessHtml($option_name));

                /*************************
                 * BUILD OPTION VALUE     *
                 ************************/

                //  Convert the "template display value" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($template_value);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output
                $option_value = $outputResponse;

                //  Set an info log of the option value
                $this->logInfo('Option value: '.$this->wrapAsSuccessHtml($this->convertToString($option_value)));

                //  Set an info log of the option link
                $this->logInfo('Option Link: '.$this->wrapAsSuccessHtml($option_link));

                /*****************
                 * ADD OPTION    *
                 *****************/

                //  If the return type is an array format
                if ($returnType == 'array') {
                    //  Build the option as an array
                    $option = [
                        'name' => $option_name,
                        'input' => $option_number,
                        'value' => (is_null($option_value))
                                //  Use the entire option data as the value
                                ? $options[$x]
                                //  Otherwise use the converted version of the value provided
                                : $option_value,
                        'link' => $option_link,
                        'separator' => [
                            'top' => null,
                            'bottom' => null,
                        ],
                    ];

                    //  Add the option to the rest of our options
                    array_push($collection, $option);

                //  If the return type is a string format
                } elseif ($returnType == 'string') {
                    if ($option_name) {
                        //  Build the option as a string
                        $text .= $option_number.'. '.$option_name."\n";
                    }
                }
            }

            if ($returnType == 'array') {
                //  Return the collection of options as an array
                return $collection;
            } elseif ($returnType == 'string') {
                //  Return the options as text
                return $text;
            }

            //  If we don't have options to display
        } else {
            //  If we have instructions to be displayed then add break lines
            $text = (!empty($this->display_instructions) ? "\n\n" : '');

            //  Convert the "no results message" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($no_results_message);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output e.g "No options available"
            $no_results_message = $outputResponse;

            //  Get the custom "no results message" otherwise use the default message
            $text .= ($no_results_message ?? $this->default_no_select_options_message);

            //  Return the custom or default "No options available"
            return $text;
        }
    }

    /** This method builds the code select options
     */
    public function getCodeSelectOptions($returnType = 'array')
    {
        //  Get the PHP Code
        $code = $this->display['content']['action']['select_option']['code_editor_options']['code_editor_text'] ?? 'return null;';

        //  Get the custom "no results message"
        $no_results_message = $this->display['content']['action']['select_option']['code_editor_options']['no_results_message'] ?? null;

        //  Set an info log that we are starting to build the dynamic options
        $this->logInfo('Building code options');

        //  Process the PHP Code
        $outputResponse = $this->processPHPCode("$code");

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the options
        $options = $outputResponse;

        if (is_array($options)) {
            //  Check if we have options to display
            $optionsExist = count($options) ? true : false;

            //  If we have options to display
            if ($optionsExist) {
                $text = "\n";
                $collection = [];

                //  Foreach option
                for ($x = 0; $x < count($options); ++$x) {
                    //  Get the current option
                    $option = $options[$x];

                    //  If the option name was not provided
                    if (!isset($option['name']) || empty($option['name'])) {
                        //  Set a warning log that the option name was not provided
                        $this->logWarning('The '.$this->wrapAsSuccessHtml('Option name').' is not provided');

                    //  If the option name is not a type of [String]
                    } elseif (!is_string($option['name'])) {
                        //  Get the option name type wrapped in html tags
                        $dataType = $this->wrapAsSuccessHtml($option['name']);

                        //  Set a warning log that the option name must be of type [String].
                        $this->logWarning('The given '.$this->wrapAsSuccessHtml('Option name').' must return data of type ['.$this->wrapAsSuccessHtml('String').'] or ['.$this->wrapAsSuccessHtml('Integer').'] however we received a value of type ['.$dataType.']');

                    //  If the option input was not provided
                    } elseif (!isset($option['input']) || is_null($option['input'])) {
                        //  Set a warning log that the option input was not provided
                        $this->logWarning('The '.$this->wrapAsSuccessHtml('Option input').' is not provided');

                    //  If the option input is not a type of [String] or [Integer]
                    } elseif (!(is_string($option['input']) || is_integer($option['input']))) {
                        //  Get the option input type wrapped in html tags
                        $dataType = $this->wrapAsSuccessHtml($option['input']);

                        //  Set a warning log that the option name must be of type [String] or [Integer]
                        $this->logWarning('The given '.$this->wrapAsSuccessHtml('Option input').' must return data of type ['.$this->wrapAsSuccessHtml('String').'] or ['.$this->wrapAsSuccessHtml('Integer').'] however we received a value of type ['.$dataType.']');

                    //  If the option link was set but is not of type [Array]
                    } elseif (isset($option['link']) && !is_string($option['link'])) {
                        //  Get the option link type wrapped in html tags
                        $dataType = $this->wrapAsSuccessHtml($option['link']);

                        //  Set a warning log that the option name must be of type [String].
                        $this->logWarning('The given '.$this->wrapAsSuccessHtml('Option link').' must return data of type ['.$this->wrapAsSuccessHtml('String').'] however we received a value of type ['.$dataType.']');

                    //  If the option top separator was set but is not of type [String]
                    } elseif (isset($option['separator']['top']) && !is_string($option['separator']['top'])) {
                        //  Get the option link type wrapped in html tags
                        $dataType = $this->wrapAsSuccessHtml($option['separator']['top']);

                        //  Set a warning log that the option op separator must be of type [String].
                        $this->logWarning('The given '.$this->wrapAsSuccessHtml('Option top separator').' must return data of type ['.$this->wrapAsSuccessHtml('String').'] however we received a value of type ['.$dataType.']');

                    //  If the option bottom separator was set but is not of type [String]
                    } elseif (isset($option['separator']['bottom']) && !is_string($option['separator']['bottom'])) {
                        //  Get the option link type wrapped in html tags
                        $dataType = $this->wrapAsSuccessHtml($option['separator']['bottom']);

                        //  Set a warning log that the option op separator must be of type [String].
                        $this->logWarning('The given '.$this->wrapAsSuccessHtml('Option bottom separator').' must return data of type ['.$this->wrapAsSuccessHtml('String').'] however we received a value of type ['.$dataType.']');
                    }

                    //  Set the top separator
                    if (isset($option['separator']['top']) && !empty($option['separator']['top'])) {
                        $option_top_separator = $option['separator']['top'];
                    } else {
                        $option_top_separator = '';
                    }

                    //  Set the bottom separator
                    if (isset($option['separator']['bottom']) && !empty($option['separator']['bottom'])) {
                        $option_bottom_separator = $option['separator']['bottom'];
                    } else {
                        $option_bottom_separator = '';
                    }

                    //  If the return type is an array format
                    if ($returnType == 'array') {
                        //  Build the option as an array
                        $option = [
                            //  Get the option name
                            'name' => $this->convertToString($option['name']) ?? null,
                            //  Get the option input
                            'input' => $this->convertToString($option['input']) ?? null,
                            //  Get the option value
                            'value' => $option['value'] ?? null,
                            //  Get the option link
                            'link' => $this->convertToString($option['link']) ?? null,
                            'separator' => [
                                'top' => $this->convertToString($option_top_separator),
                                'bottom' => $this->convertToString($option_bottom_separator),
                            ],
                        ];

                        //  Add the option to the rest of our options
                        array_push($collection, $option);

                    //  If the return type is a string format
                    } elseif ($returnType == 'string') {
                        //  If we have a top separator
                        if (!empty($option_top_separator)) {
                            $text .= $option_top_separator."\n";
                        }

                        //  If we have the option name
                        if (!empty($option['name'])) {
                            //  Build the option as a string
                            $text .= $option['name']."\n";
                        }

                        //  If we have a bottom separator
                        if (!empty($option_bottom_separator)) {
                            $text .= $option_bottom_separator."\n";
                        }
                    }
                }

                if ($returnType == 'array') {
                    //  Return the options
                    return $collection;
                } elseif ($returnType == 'string') {
                    //  Return the options
                    return $text;
                }

                //  If we don't have options to display
            } else {
                //  If we have instructions to be displayed then add break lines
                $text = (!empty($this->display_instructions) ? "\n\n" : '');

                //  Convert the "no results message" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($no_results_message);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output e.g "No options available"
                $no_results_message = $outputResponse;

                //  Get the custom "no results message" otherwise use the default message
                $text .= ($no_results_message ?? $this->default_no_select_options_message);

                //  Return the custom or default "No options available"
                return $text;
            }
        } else {
            //  Get the options type wrapped in html tags
            $dataType = $this->wrapAsSuccessHtml($this->getDataType($options));

            //  Set a warning log that the dynamic property is not an array
            $this->logWarning('The given '.$this->wrapAsSuccessHtml('Code').' must return data of type ['.$this->wrapAsSuccessHtml('Array').'] however we received type of ['.$dataType.']. For this reason we cannot build the select options');

            //  Show the technical difficulties error screen to notify the user of the issue
            return $this->showTechnicalDifficultiesErrorScreen();
        }
    }

    /** This method collects the the current display content and
     *  splits it into chunks that can be viewed separately.
     */
    public function handlePagination()
    {
        //  Get the display pagination settings
        $displayPagination = $this->display['content']['pagination'];

        //  Get the global pagination settings
        $globalPagination = $this->version->builder['global_pagination'];

        //  Check if we want to use the display pagination settings or the global pagination settings
        $useGlobalPagination = $displayPagination['use_global_pagination'];

        //  Set the selected pagination settings (Display or Global)
        $pagination = $useGlobalPagination ? $globalPagination : $displayPagination;

        //  Get the active state value
        $activeState = $this->processActiveState($pagination['active']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($activeState)) {
            return $activeState;
        }

        //  If the pagination is active
        if ($activeState === true) {

            //  Set an info log that we are handling pagination
            $this->logInfo('Paginating display: '.$this->wrapAsPrimaryHtml($this->display['name']));

            //  Get the pagination content target
            $content_target = $pagination['content_target']['selected_type'];

            //  Determine whether to separate by line breaks or not
            $paginate_by_line_breaks = $pagination['paginate_by_line_breaks'];

            //  Get the pagination separation type e.g separate by "words" or "characters"
            $separation_type = $pagination['slice']['separation_type'];

            //  Get the pagination start slice
            $start_slice = $pagination['slice']['start'];

            //  Get the pagination end slice
            $end_slice = $pagination['slice']['end'];

            //  Get the pagination show more visibility
            $show_scroll_down_text = $pagination['scroll_down']['visible'];

            //  Get the pagination show more text
            $scroll_down_text = $pagination['scroll_down']['name'];

            //  Get the pagination scroll down input
            $scroll_down_input = $pagination['scroll_down']['input'];

            //  Get the pagination show more visibility
            $show_scroll_up_text = $pagination['scroll_up']['visible'];

            //  Get the pagination show more text
            $scroll_up_text = $pagination['scroll_up']['name'];

            //  Get the pagination scroll up input
            $scroll_up_input = $pagination['scroll_up']['input'];

            //  Get the trail for showing we have more content e.g "..."
            $trailing_characters = $pagination['trailing_end'];

            //  Get the break line before trail (Whether to add a line break before the trail)
            $break_line_before_trail = $pagination['break_line_before_trail'];

            //  Get the break line after trail (Whether to add a line break after the trail)
            $break_line_after_trail = $pagination['break_line_after_trail'];

            /*****************************
             * BUILD START SLICE VALUE   *
             ****************************/

            //  Convert the "start slice" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($start_slice);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $start_slice = $this->convertToInteger($outputResponse) ?? 0;

            //  Make sure the start slice is no less than 0
            $start_slice = ($start_slice < 0) ? 0 : $start_slice;

            //  Make sure the start slice is no greater than 155
            $start_slice = ($start_slice > 155) ? 155 : $start_slice;

            /***************************
             * BUILD END SLICE VALUE   *
             **************************/

            //  Convert the "end slice" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($end_slice);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $end_slice = $this->convertToInteger($outputResponse) ?? 160;

            //  Make sure the end slice is no greater than 160
            $end_slice = ($end_slice > 160) ? 160 : $end_slice;

            //  Make sure the end slice is greater than the start slice
            $end_slice = ($end_slice < $start_slice) ? 160 : $end_slice;

            /*****************************
             * BUILD SCROLL DOWN NAME   *
             ****************************/

            //  Convert the "scroll down name" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($scroll_down_text);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $scroll_down_text = $this->convertToString($outputResponse);

            /******************************
             * BUILD SCROLL DOWN INPUT   *
             *****************************/

            //  Convert the "scroll down input" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($scroll_down_input);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $scroll_down_input = $this->convertToString($outputResponse);

            /**************************
             * BUILD SCROLL UP NAME   *
             **************************/

            //  Convert the "scroll up name" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($scroll_up_text);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $scroll_up_text = $this->convertToString($outputResponse);

            /***************************
             * BUILD SCROLL UP INPUT   *
             ***************************/

            //  Convert the "scroll up input" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($scroll_up_input);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $scroll_up_input = $this->convertToString($outputResponse);

            /*******************************
             * BUILD TRAILING CHARACTERS   *
             *******************************/

            //  Convert the "trailing characters" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($trailing_characters);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $trailing_characters = $this->convertToString($outputResponse);

            /***************************************
             * DETERMINE THE CONTENT TO PAGINATE   *
             **************************************/

            // Paginate only the instruction
            if ($content_target == 'instruction') {
                $content = $this->display_instructions ?? '';

            // Paginate only the actions
            } elseif ($content_target == 'action') {
                $content = $this->display_actions ?? '';

            // Paginate both the instruction and actions
            } elseif ($content_target == 'both') {
                $content = $this->display_content ?? '';
            }

            /**
             *  Replace multiple spaces with one space e.g Consider the following content
             *
             *  -------------------------------------------------------------------------
             *
             *  Hello              guys              i              want              to              make              sure              that              we              can              always              hang              out              no              matter              what.
             *  1.              Send              Message
             *  2.              Edit              Message
             *  3.              Cancel              Message
             *
             *  -------------------------------------------------------------------------
             *
             *  Solution From: https://stackoverflow.com/questions/2368539/php-replacing-multiple-spaces-with-a-single-space
             *
             *  We need to replace the multiple spaces with a single space while also being
             *  careful that we do not remove the line breaks. Remove spaces but keep the
             *  line breaks. The result is as follows
             *  -------------------------------------------------------------------------
             *
             *  Hello guys i want to make sure that we can always hang out no matter what.
             *  1. Send Message
             *  2. Edit Message
             *  3. Cancel Message
             *
             *  -------------------------------------------------------------------------
             */
            $content = preg_replace('/[[:blank:]]+/', ' ', $content);

            /***************************************************
             * DETERMINE FIXED CONTENT AND PAGINATED CONTENT   *
             **************************************************/

            //  Get the content that must always be at the top
            $fixed_content = substr($content, 0, $start_slice);

            //  Get the rest of the content as the content to paginate
            $pagination_content = substr($content, $start_slice);

            /***********************************************
             * MERGE TRAILING CHARACTERS AND BREAK LINES   *
             **********************************************/

            //  If the break line before trail is set
            if ($break_line_before_trail) {
                //  Add a break line before the trailing characters
                $trailing_characters = "\n".$trailing_characters;
            }

            //  If the break line after trail is set
            if ($break_line_after_trail) {
                //  Add a break line after the trailing characters
                $trailing_characters = $trailing_characters."\n";
            }

            /**********************************
             * ADD SCROLL UP AND DOWN NAMES   *
             **********************************/

            //  If the show more text is set to be visible and its not empty
            if ($show_scroll_up_text == true && !empty($scroll_up_text)) {
                //  Combine the trail and the scroll up text e.g "..." and "88.Prev" separated by a line break
                $trailing_characters .= "\n".$scroll_up_text;
            }

            //  If the show scroll down text is set to be visible and its not empty
            if ($show_scroll_down_text == true && !empty($scroll_down_text)) {
                //  Combine the trail and the scroll down text e.g "..." and "99.Next" separated by a line break
                $trailing_characters .= "\n".$scroll_down_text;
            }

            /*
             *  Pagination by line breaks works as best as possible to avoid cutting words
             *  of select options or paragraphs of content separated by line breaks
             *  e.g If we have:
             *  ---------------------------------------
             *  Hello guys i want to make sure that we can always hang out no matter what.
             *  1. Send Message
             *  2. Edit Message
             *  3. Cancel Message
             *  ---------------------------------------
             *  Lets think about this message as one long line and use ~ as the line break character placeholder
             *
             *  Hello guys i want to make sure that we can always hang out no matter what.~1. Send Message~2. Edit Message~3. Cancel Message
             *
             *  This makes up 124 characters
             *  ---------------------------------------
             *
             *  Normally without pagination by line breaks, we would just slice the content without consideration of these line breaks.
             *  Note that the character limit in this example is 40 characters. This is what we would normally get if our separation
             *  type is based on words.
             *
             *  Slice 1:
             *  ---------------------------------------
             *  Hello guys i want to make sure that we c      = 39 characters (including line-break and trailing characters)
             *  ...
             *  ---------------------------------------
             *
             *
             *
             *  ---------------------------------------
             *
             *  This will slice the content without cutting the select options or any line break.
             *  Note that the character limit in this example is 40 characters
             *
             *  Slice 1:
             *  ---------------------------------------
             *  Hello guys i want to make sure that      = 39 characters (including line-break and trailing characters)
             *  ...
             *  ---------------------------------------
             *
             *  Slice 2:
             *  ---------------------------------------
             *  we can always hang out no matter         = 36 characters (including line-break and trailing characters)
             *  ...
             *  ---------------------------------------
             *
             *  Slice 3:
             *  ---------------------------------------
             *  what                                     = 40 characters (including line-break and trailing characters)
             *  1. Send Message
             *  2. Edit Message
             *  ...
             *  ---------------------------------------
             *
             *  Slice 4:
             *  ---------------------------------------
             *  3. Cancel Message                        = 17 characters (including line-break and trailing characters)
             *  ---------------------------------------
             */

            if ($paginate_by_line_breaks) {
                /** Separate the pagination content into individual paragraphs using the line break.
                 *  This helps separate the instruction content and each select option to stand alone.
                 */
                $pagination_content_paragraphs = explode("\n", $pagination_content);

                /*  Remove empty paragraphs  */
                $pagination_content_paragraphs = collect($pagination_content_paragraphs)->filter()->values()->toArray();

                $content_groups = [];

                foreach ($pagination_content_paragraphs as $index => $pagination_content_paragraph) {
                    //  If we have another paragraph after the current one, add the trailing characters to the current paragraph
                    if (isset($pagination_content_paragraphs[$index + 1])) {
                        $pagination_content_paragraph .= $trailing_characters;
                    }

                    //  Get the content slices
                    $slices = $this->getPaginationContentSlices($pagination_content_paragraph, $trailing_characters, $start_slice, $end_slice, $separation_type);

                    array_push($content_groups, $slices);
                }

                $content_slices = [];

                //  Get the trail character length e.g "..." = 3 while "... 99.More" = 11
                $trail_length = strlen($trailing_characters);

                foreach ($content_groups as $grouped_slices) {
                    foreach ($grouped_slices as $slice) {
                        $curr_slice_length = strlen($slice);

                        //  If we don't have any content slices yet
                        if (empty($content_slices)) {
                            //  Add the first slice
                            array_push($content_slices, $slice);

                        //  If we already have content slices
                        } else {
                            //  Get the total number of slices we have
                            $total_slices = count($content_slices);

                            $last_slice = $content_slices[$total_slices - 1];

                            $last_slice_length = strlen($last_slice);

                            /** Check if its possible to get the last slice, remove the trailing characters
                             *  and add the current slice with a line break (character = 1) without exceeding
                             *  the allowed character limit ($end_slice - $start_slice).
                             */
                            if ($last_slice_length - $trail_length + $curr_slice_length + 1 <= ($end_slice - $start_slice)) {
                                //  Remove the trailing characters from the last slice
                                $last_slice_without_trail = substr($last_slice, 0, ($last_slice_length - $trail_length));

                                //  Combine the last slice without the trail with the current slice
                                $last_slice_with_current_slice = $last_slice_without_trail."\n".$slice;

                                //  Update the stored last slice
                                $content_slices[$total_slices - 1] = $last_slice_with_current_slice;
                            } else {
                                /* Add the current slice as a new slice. This slice cannot be combined with
                                 *  the previous inserted slice without exceeeding the limit), therefore it
                                 *  must be added alone.
                                 */
                                array_push($content_slices, $slice);
                            }
                        }
                    }
                }
            } else {

                //  Get the content slices
                $content_slices = $this->getPaginationContentSlices($pagination_content, $trailing_characters, $start_slice, $end_slice, $separation_type);

            }

            //  If we have the input
            if (!empty($scroll_down_input) || !empty($scroll_up_input)) {

                //  Start slicing the content
                while ($this->hasResponded()) {

                    $userResponse = $this->getResponseFromLevel($this->level);      //  99

                    //  If the user response matches the pagination scroll up or scroll down input
                    if ($userResponse === $scroll_down_input || $userResponse === $scroll_up_input) {

                        if ($userResponse === $scroll_up_input) {

                            //  Set an info log that we are scrolling on the content
                            $this->logInfo('Scrolling up display: '.$this->wrapAsPrimaryHtml($this->display['name']));

                            if ($this->pagination_index > 0) {

                                //  Decrement the pagination index so that we target the previous pagination content slice
                                --$this->pagination_index;

                            }

                            // Increment the current level so that we target the next display response
                            ++$this->level;

                        } elseif ($userResponse === $scroll_down_input) {

                            /**
                             *  As long as we have more content that we can show, then we should allow the ability to paginate
                             *  through the content. Lets assume that we have the following message and we slice this into
                             *  4 content slices.
                             *
                             *  ---------------------------------------
                             *  Hello guys i want to make sure that we can always hang out no matter what
                             *  ---------------------------------------
                             *  (Page 1) Hello guys i want       <-  Reply "99"  -> increase pagination index from 0 to 1 to show "page 2"
                             *  (Page 2) to make sure that       <-  Reply "99"  -> increase pagination index from 1 to 2 to show "page 3"
                             *  (Page 3) we can always hang      <-  Reply "99"  -> increase pagination index from 2 to 3 to show "page 4"
                             *  (Page 4) out no matter what
                             *  ---------------------------------------
                             *
                             *  Now we know that the user would only need to scroll down "3" times before they reach the final content slice.
                             *  Any reply after this would not be a reply related to the pagination content so we can allow that reply to be
                             *  freed so that it can be used for other functionality other than pagination e.g The reply can be used to
                             *  trigger a "Forward Navigation". This is assuming that the same reply e.g "99" is used by both the
                             *  pagination (for veiwing the next content) and navigation for triggering a screen repeat. It can
                             *  also be used to perform an action e.g selecting an option. The point is that we need to free
                             *  the user reply if not needed for pagination so that it can be used to perform other actions.
                             */

                            //  If this is not the last page
                            if($this->pagination_index < (count($content_slices) - 1)) {

                                //  Set an info log that we are scrolling on the content
                                $this->logInfo('Scrolling down display: '.$this->wrapAsPrimaryHtml($this->display['name']));

                                //  Increment the pagination index so that next time we target the next pagination content slice
                                ++$this->pagination_index;

                                // Increment the current level so that we target the next display response
                                ++$this->level;

                            }else{

                                //  Set an info log that we are not scrolling on the content
                                $this->logInfo('No more content to scroll down on display: '.$this->wrapAsPrimaryHtml($this->display['name']));

                                //  Set an info log that we are freeing up the user response
                                $this->logInfo('The user response '.$this->wrapAsSuccessHtml($userResponse).' will not be used for pagination but will be freed for use elsewhere');

                                //  Stop the loop
                                break 1;

                            }

                        }

                    } else {

                        //  Stop the loop
                        break 1;

                    }

                }

            }

            //  Get the pagination content
            $paginated_content_slice = isset($content_slices[$this->pagination_index]) ? $content_slices[$this->pagination_index] : '';

            //  Set the current paginated content as the display content
            $this->display_content = $fixed_content.$paginated_content_slice;
        }
    }

    public function getPaginationContentSlices($pagination_content, $trailing_characters, $start_slice, $end_slice, $separation_type)
    {
        /**
         *  To stop any potential infinite loops, lets limit the cycles to 100 loops.
         *  This means we can only loop 100 times and also means that if we have
         *  long content we can only return 100 content slices. If each content
         *  slice is 160 characters then the maximum characters to return will
         *  be (100 cycles * 160 characters) = 16,000 characters. For now this
         *  seems like a good limit to stop if the content is either too long
         *  or we are stuck in an infinite loop.
         */
        $cycles = 0;

        //  Set an array to store all the content slices
        $content_slices = [];

        //  Start slicing the content
        while (!empty($pagination_content) && ($cycles <= 100)) {

            if ($cycles == 100) {

                //  Log a warning that its possible we have an infinite loop (since its rare to reach 100 cycles)
                $this->logWarning('Possible infinite loop detected while handling pagination.');

            }

            //  Increment the cycle
            $cycles = $cycles + 1;

            /**
             *  Get the trail character length e.g
             *
             *  "..." = 3
             *  "... 99.Next" = 11
             *  "... 88.Prev 99.Next" = 19
             */
            $trail_length = strlen($trailing_characters);

            /**
             *  Make sure that we don't have any spaces on the begining or end of the pagination content
             *  while we keep slicing it on each loop. Its possible that as we slice through the
             *  pagination content, that we are left with empty spaces or line breaks at the
             *  begining of the content e.g Assuming that:
             *
             *  $start_slice = 0;
             *  $end_slice = 5;
             *  $trailing = '';
             *  $separation_type = 'characters';
             *
             *  ----------------------------------------------------------------------------
             *  This means that we are a maximum of slicing 5 characters per loop
             *  ----------------------------------------------------------------------------
             *
             *  (Loop 1) $pagination_content = "Hello guys i want to make sure that we can always hang out no matter what";
             *  (Loop 2) $pagination_content = ' guys i want to make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = ' i want to make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = 'nt to make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = ' make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = ' sure that we can always hang out no matter what';
             *  ...e.t.c
             *
             *  ----------------------------------------------------------------------------
             *
             *  Notice that each loop slices 5 characters, but we end up with spaces on some instances.
             *  These spaces are unnecessary and must be removed on each loop so that we only have
             *  useful characters to slice. If we trim on each loop, we get the following outcome:
             *
             *  ----------------------------------------------------------------------------
             *
             *  (Loop 1) $pagination_content = "Hello guys i want to make sure that we can always hang out no matter what";
             *  (Loop 2) $pagination_content = 'guys i want to make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = 'i want to make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = 't to make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = 'make sure that we can always hang out no matter what';
             *  (Loop 2) $pagination_content = 'sure that we can always hang out no matter what';
             *  ...e.t.c
             *
             *  ----------------------------------------------------------------------------
             */
            $pagination_content = trim($pagination_content);

            /*
             *  If we are separating based on characters then this means we can cut the
             *  content at any point since the user does not mind word characters being
             *  separated
             */
            if ($separation_type == 'characters') {

                /*
                 *  We need to figure out whether this is the last slice of the content or if we
                 *  still have more content to go through. This can give us an idea of whether
                 *  we need to add the trailing characters or not as an indication of whether
                 *  we still have more content to go through.
                 *  ----------------------------------------------------------------------------
                 *
                 *  Suppose that we have the following settings and message:
                 *
                 *  $start_slice = 0;
                 *  $end_slice = 40;
                 *  $trailing = '';
                 *  $separation_type = 'characters';
                 *
                 *  ----------------------------------------------------------------------------
                 *
                 *  Hello guys i want to make sure that we can always hang out no matter what.
                 *  1. Send Message
                 *  2. Edit Message
                 *  3. Cancel Message
                 *
                 *  ----------------------------------------------------------------------------
                 *  Now Lets put everything one long line to visualise this better
                 *  ----------------------------------------------------------------------------
                 *
                 *  Hello guys i want to make sure that we can always hang out no matter what. 1. Send Message 2. Edit Message 3. Cancel Message
                 *
                 *  ---------------------------------------------------------------------------------------------------
                 *  Now Lets see the content slices (this assumes that we don't have any trailing characters e.g "...")
                 *  ---------------------------------------------------------------------------------------------------
                 *
                 *  Hello guys i want to make sure that we c
                 *                                          an always hang out no matter what. 1. Se
                 *                                                                                  nd Message 2. Edit Message 3. Cancel Mes
                 *                                                                                                                          sage
                 *
                 *  ----------------------------------------------------------------------------
                 *
                 *  Foreach each loop the "$nextRemainingContent" would return the following output:
                 *
                 *  (Loop 1) "an always hang out no matter what. 1. Send Message 2. Edit Message 3. Cancel Message"  <- We still have content
                 *  (Loop 2) "nd Message 2. Edit Message 3. Cancel Message"                                          <- We still have content
                 *  (Loop 3) "sage"                                                                                  <- We still have content
                 *  (Loop 4) ""                                                                                      <- We don't have content
                 *
                 *  Remember that the idea is to get the rest of the text after the end slice which represents
                 *  the next remaining content, so that we can determine if we have anymore content that must
                 *  be extracted. This allows us to know if we are showing the last slice or not so that we
                 *  know what actions to take.
                 */
                $nextRemainingContent = substr($pagination_content, $end_slice);
                $isShowingLastSlice = empty($nextRemainingContent);

                /*
                 *  If we slice the content and don't have any left overs (Remaining characters)
                 *  ----------------------------------------------------------------------------
                 *  This takes care of the last paginated content. On the last paginated content
                 *  We don't add any trailing content or the show more text. Suppose that we have
                 *  the following settings and message:
                 */
                if ($isShowingLastSlice) {

                    //  Get the content slice without the trail
                    $content_slice = substr($pagination_content, 0, $end_slice);

                    //  Update the pagination content left after slicing
                    $pagination_content = substr($pagination_content, $end_slice);

                /*
                 *  If we slice the content and we have left overs (Remaining characters)
                 *  ---------------------------------------------------------------------
                 *  This takes care of the first paginated content and any other content
                 *  after that except the last paginated content. We add any trailing
                 *  content and the show more text if its provided.
                 */
                } else {

                    /*
                     *  Lets consider the message example above and see how we would dissect it.
                     *  This assumes that we don't have any trailing characters e.g "..."
                     *  ----------------------------------------------------------------------------
                     *
                     *  $content_slice      -->  Hello guys i want to make sure that we c
                     *  $pagination_content -->                                          an always hang out no matter what. 1. Send Message 2. Edit Message 3. Cancel Message
                     *
                     *  ----------------------------------------------------------------------------
                     *
                     *  $content_slice      -->  an always hang out no matter what. 1. Se
                     *  $pagination_content -->                                          nd Message 2. Edit Message 3. Cancel Message
                     *
                     *  ----------------------------------------------------------------------------
                     *
                     *  $content_slice      -->  nd Message 2. Edit Message 3. Cancel Mes
                     *  $pagination_content -->                                          sage
                     *
                     *  ----------------------------------------------------------------------------
                     */

                    //  Get the content slice with the trail
                    $content_slice = substr($pagination_content, 0, $end_slice - $trail_length).$trailing_characters;

                    //  Update the pagination content left after slicing
                    $pagination_content = substr($pagination_content, $end_slice - $trail_length);

                }

                /*
                 *  If we are separating based on words then this means we cannot cut the
                 *  content at any point since the user does mind word characters being
                 *  separated
                 */
            } elseif ($separation_type == 'words') {

                //  If the character length of the content is less than or exactly the allowed maximum limit set
                if (strlen($pagination_content) <= ($end_slice - $start_slice)) {

                    //  Get the pagination content as the current slice
                    $content_slice = $pagination_content;

                    //  Set the paginated content to nothing
                    $pagination_content = '';

                } else {

                    $content_slice = '';
                    $words = explode(' ', $pagination_content);    // string to array

                    foreach ($words as $key => $word) {
                        /** If the current content and the current word and the trailing characters and the extra
                         *  joining space " " of string length = 1 can be added without exceeding the limit then add
                         *  the word. Note that the string length for the empty space " " does not apply for the first
                         *  word added. However every other word will have the " " character when appending to the content.
                         *
                         *  This means we can add this current word now, then on the next iteration if we can't add that
                         *  following word we can finish off by adding the trailing characters since we had made room for
                         *  them on the last word that was inserted. By adding the trailing characters we indicate the
                         *  end of the maximum content  we could get for the current content slice.
                         */

                        /** If this is the first word then we dont have an empty space to add so use 0 as the string length.
                         *  However if this is not the first word then we have an empty space to add so use 1 as the string
                         *  length.
                         */
                        $empty_space_length = ($key == 0) ? 0 : 1;

                        /* We need to first make sure that the given word is not longer than the allowed character limit e.g
                            *  if the word is 200 characters long but the allowed character limit is 160 then we need to figure
                            *  out how to handle this
                            */
                        if (!(strlen($word) <= ($end_slice - $start_slice))) {
                            /** Slice the word in this way:
                             *
                             *  Get the character limit allowed by calculating:.
                             *
                             *  $limit = ($end_slice - $start_slice)
                             *
                             *  After that we need to count the content we already have using strlen( $content_slice )
                             *  We need to subtract that from the character limit since the content slice already has
                             *  content occupying space.
                             *
                             *  $limit = ($end_slice - $start_slice) - strlen( $content_slice )
                             *
                             *  Now we need to add the trailing information. This means we need to subtract that from
                             *  the character limit so that we can fit the trailing information content
                             *
                             *  $limit = ($end_slice - $start_slice) - strlen( $content_slice ) - $trail_length
                             */
                            $existing_content_length = strlen($content_slice);

                            $limit = ($end_slice - $start_slice) - $existing_content_length - $trail_length;

                            /* If this is the first word don't add the empty space but
                                *  if this is not the first word then add the empty space.
                                */
                            if ($key != 0) {
                                $word = ' '.$word;
                            }

                            //  Trim the word and add it result to the content slice
                            $content_slice .= substr($word, 0, $limit);

                            //  Add the trailing characters at the end of the result
                            $content_slice .= $trailing_characters;

                            /* Stop getting content (We will continue again on the next While Loop Iteration)
                                *  That is when we will continue reducing the extremely long word if its still
                                *  too long
                                */
                            break 1;
                        } elseif ((strlen($content_slice) + strlen($word) + $trail_length + $empty_space_length) <= ($end_slice - $start_slice)) {
                            /* If this is the first word don't add the empty space but trim the word for left and right spaces.
                                *  If this is not the first word then add the empty space.
                                */
                            if ($key == 0) {
                                $content_slice .= $word;
                            } else {
                                $content_slice .= ' '.$word;
                            }
                        } else {
                            //  Add the trailing characters after the last inserted word
                            $content_slice .= $trailing_characters;

                            //  Stop adding content
                            break 1;
                        }
                    }

                    //  Update the pagination content left after slicing
                    $pagination_content = trim(substr($pagination_content, strlen($content_slice) - $trail_length));
                }
            }

            //  Add the slice to the content slices
            array_push($content_slices, $content_slice);
        }

        //  Return the content slices
        return $content_slices;
    }

    public function resetNavigation()
    {
        $this->navigation_request_type = null;
    }

    public function resetPagination()
    {
        $this->pagination_index = 0;
    }

    /** This method gets the users response for the display screen if it exists otherwise
     *  returns an empty string if it does not exist. We also log an info message to
     *  indicate the display name associated with the provided response.
     */
    public function setCurrentScreenUserResponse()
    {
        //  Set the current user response
        $this->current_user_response = $this->getResponseFromLevel($this->level) ?? '';   //  John Doe

        //  Update the ussd data
        $this->ussd['user_response'] = $this->current_user_response;

        //  Store the ussd data using the given item reference name
        $this->setProperty('ussd', $this->ussd, false);

        //  Set an info log that the user has responded to the current screen and show the input value
        $this->logInfo('User has responded to '.$this->wrapAsPrimaryHtml($this->display['name']).' with '.$this->wrapAsSuccessHtml($this->current_user_response));
    }

    /** This method gets the current display action details to determine the type of action that the
     *  display requested. We use the type of action e.g "Input a value" or "Select an option" to
     *  determine the approach we must use in order to get the value and reference name required
     *  to create dynamic data variables e.g.
     *
     *  1) Storing the input value into a variable referenced as "first_name"
     *
     *  $first_name = "John";
     *
     *  2) Storing the details of a selected option into a variable referenced as "product"
     *
     *  $product = [ "name" => "Product 1", "value" => "1", input => "1" ];
     *
     *  ... e.t.c
     *
     *  These dynamic data variables can then be reference by other displays using mustache tags
     *  e.g {{ first_name }} or {{ product.name }}
     */
    public function storeCurrentDisplayUserResponseAsDynamicVariable()
    {
        //  Get the current screen expected action type
        $screenActionType = $this->getDisplayActionType();

        //  If the action is to select an option e.g 1, 2 or 3
        if ($screenActionType == 'select_option') {
            //  Get the current screen expected select action type e.g static_options
            $screenSelectOptionType = $this->getDisplaySelectOptionType();

            //  If the select options are basic static options
            if ($screenSelectOptionType == 'static_options') {
                return $this->storeSelectedStaticOptionAsDynamicData();

            //  If the select option are dynamic options
            } elseif ($screenSelectOptionType == 'dynamic_options') {
                return $this->storeSelectedDynamicOptionAsDynamicData();

            //  If the select option are generated via the code editor
            } elseif ($screenSelectOptionType == 'code_editor_options') {
                return $this->storeSelectedCodeOptionAsDynamicData();
            }

            //  If the action is to input a value e.g John
        } elseif ($screenActionType == 'input_value') {
            //  Get the current screen expected input action type e.g input_value
            $screenInputType = $this->getDisplayInputType();

            /* If the input is a single value input e.g
             *  Q: Enter your first name
             *  Ans: John
            */
            if ($screenInputType == 'single_value_input') {
                return $this->storeSingleValueInputAsDynamicData();

            /* If the input is a multi-value input e.g
             *  Q: Enter your first name, last name and age separated by spaces
             *  Ans: John Doe 25
            */
            } elseif ($screenInputType == 'multi_value_input') {
                return $this->storeMultiValueInputAsDynamicData();
            }
        }
    }

    /** This method gets the value from the selected static option and stores it within the
     *  specified reference variable if provided. It also determines if the next display or
     *  screen link has been provided, if (yes) we fetch the specified display or screen
     *  and save it for linking in future methods.
     */
    public function storeSelectedStaticOptionAsDynamicData()
    {
        $outputResponse = $this->getStaticSelectOptions('array');

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the options
        $options = $outputResponse;

        $staticOptions = $this->display['content']['action']['select_option']['static_options'];

        //  Get the reference name (The name used to store the selected option value for ease of referencing)
        $reference_name = $staticOptions['reference_name'] ?? null;

        //  Get the custom "no results message"
        $no_results_message = $staticOptions['no_results_message'] ?? null;

        //  Get the custom "incorrect option selected message"
        $incorrect_option_selected_message = $staticOptions['incorrect_option_selected_message'] ?? null;

        return $this->storeSelectedOption($options, $reference_name, $no_results_message, $incorrect_option_selected_message);
    }

    /** This method gets the value from the selected dynamic option and stores it within the
     *  specified reference variable if provided. It also determines if the next display or
     *  screen link has been provided, if (yes) we fetch the specified display or screen
     *  and save it for linking in future methods.
     */
    public function storeSelectedDynamicOptionAsDynamicData()
    {
        $outputResponse = $this->getDynamicSelectOptions('array');

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the options
        $options = $outputResponse;

        $dynamicOptions = $this->display['content']['action']['select_option']['dynamic_options'];

        //  Get the reference name (The name used to store the selected option value for ease of referencing)
        $reference_name = $dynamicOptions['reference_name'] ?? null;

        //  Get the custom "no results message"
        $no_results_message = $dynamicOptions['no_results_message'] ?? null;

        //  Get the custom "incorrect option selected message"
        $incorrect_option_selected_message = $dynamicOptions['incorrect_option_selected_message'] ?? null;

        return $this->storeSelectedOption($options, $reference_name, $no_results_message, $incorrect_option_selected_message);
    }

    /** This method gets the value from the selected code option and stores it within the
     *  specified reference variable if provided. It also determines if the next display or
     *  screen link has been provided, if (yes) we fetch the specified display or screen
     *  and save it for linking in future methods.
     */
    public function storeSelectedCodeOptionAsDynamicData()
    {
        $outputResponse = $this->getCodeSelectOptions('array');

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the options
        $options = $outputResponse;

        $codeOptions = $this->display['content']['action']['select_option']['code_editor_options'];

        //  Get the reference name (The name used to store the selected option value for ease of referencing)
        $reference_name = $codeOptions['reference_name'] ?? null;

        //  Get the custom "no results message"
        $no_results_message = $codeOptions['no_results_message'] ?? null;

        //  Get the custom "incorrect option selected message"
        $incorrect_option_selected_message = $codeOptions['incorrect_option_selected_message'] ?? null;

        return $this->storeSelectedOption($options, $reference_name, $no_results_message, $incorrect_option_selected_message);
    }

    public function storeSelectedOption($options = [], $reference_name = null, $no_results_message = null, $incorrect_option_selected_message = null)
    {
        /** $options represents a set of action options
         *
         *  Example Structure:.
         *
         *  [
         *      [
         *          "name": "1. My Messages ({{ messages.total }})",
         *          "value" => [ ... ],
         *          "input" => "1"
         *          "link" => "screen_1592486781723"
         *      ],
         *      ...
         *  ]
         *
         *  Structure Definition
         *
         *  name:   Represents the display name of the option (What the user will see)
         *  value:  Represents the actual value of the option (What will be stored)
         *  link:   The screen or display to link to when this option is selected
         *  input:  What the user must input to select this option
         */
        $options = is_array($options) ? $options : [];

        //  Check if we have options to display
        $optionsExist = count($options) ? true : false;

        //  Get option matching user response
        $selectedOption = collect(array_filter($options, function ($option) {
            //  If the user response matches the option's input
            return $this->current_user_response == $option['input'];
        }))->first() ?? null;

        //  If we have options to display
        if ($optionsExist) {
            //  If the user selected an option that exists
            if (!empty($selectedOption)) {
                //  Get the selected option link (The display or screen we must link to after the user selects this option)
                $link = $selectedOption['link'] ?? null;

                //  Setup the link for the next display or screen
                $this->setupLink($link);

                //  If we have the reference name provided
                if (!empty($reference_name)) {
                    //  Get the option value only
                    $dynamic_data = $selectedOption['value'];

                    //  Store the select option as dynamic data
                    $this->setProperty($reference_name, $dynamic_data);
                }

                //  If the user did not select an option that exists
            } else {
                //  Convert the "incorrect option selected message" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($incorrect_option_selected_message);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output e.g "You selected an incorrect option" otherwise use the default message
                $this->incorrect_option_selected = $outputResponse ?? $this->default_incorrect_option_selected_message;
            }

            //  If we don't have options to display
        } else {
            //  If we have instructions to be displayed then add break lines
            $text = (!empty($this->display_instructions) ? "\n\n" : '');

            //  Convert the "no results message" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($no_results_message);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output e.g "No options available"
            $no_results_message = $outputResponse;

            //  Get the custom "no results message" otherwise use the default message
            $text .= ($no_results_message ?? $this->default_no_select_options_message);

            //  Return the custom or default "No options available"
            return $text;
        }
    }

    /** This method gets the single value from the input and stores it within the specified
     *  reference variable if provided. It also determines if the next screen has been
     *  provided, if (yes) we fetch the specified screen and save it as a screen that
     *  we must link to in future.
     */
    public function storeSingleValueInputAsDynamicData()
    {
        //  Get the users current response
        $user_response = $this->current_user_response;

        //  Get the reference name (The name used to store the input value for ease of referencing)
        $reference_name = $this->display['content']['action']['input_value']['single_value_input']['reference_name'] ?? null;

        //  Get the single input link (The display or screen we must link to after the user inputs a value)
        $link = $this->display['content']['action']['input_value']['single_value_input']['link'] ?? null;

        /******************
         * SETUP LINK     *
         ******************/

        //  Setup the link for the next display or screen
        $this->setupLink($link);

        //  If we have the reference name provided
        if (!empty($reference_name)) {
            //  Store the input value as dynamic data
            $this->setProperty($reference_name, $user_response);
        }
    }

    /** This method gets the multiple values from the input and stores them within the specified
     *  reference variables if provided. It also determines if the next screen has been provided,
     *  if (yes) we fetch the specified screen and save it as a screen that we must link to in
     *  future.
     */
    public function storeMultiValueInputAsDynamicData()
    {
        /** Get the users current response. This represents a string of multiple inputs
         *
         *  Example: "John Doe 24".
         */
        //  Get the users current response
        $user_response = $this->current_user_response;

        /** Get the reference names (The names used to store the input values for ease of referencing) e.g
         *
         *  Example: ['first_name', 'last_name', 'age'].
         */
        $reference_names = $this->display['content']['action']['input_value']['multi_value_input']['reference_names'] ?? [];

        /** Get the separator (The character used to separate the user input values).
         *  Default to spaces if not set.
         *
         *  Example: ","
         *
         *  Default: " "
         */
        $separator = $this->display['content']['action']['input_value']['multi_value_input']['separator'] ?? ' ';
        $separator = 'spaces' ? ' ' : $separator;

        //  Get the multi input link (The display or screen we must link to after the user inputs a value)
        $link = $this->display['content']['action']['input_value']['multi_value_input']['link'] ?? null;

        /******************
         * SETUP LINK     *
         ******************/

        //  Setup the link for the next display or screen
        $this->setupLink($link);

        //  If we have the reference names provided
        if (!empty($reference_names)) {
            //  Separate the multiple user responses using the separator
            $user_responses = explode($separator, $user_response);

            // Foreach ['first_name', 'last_name', 'age']
            foreach ($reference_names as $key => $reference_name) {
                // Check if the current reference name has a corresponding user response value
                if (isset($user_responses[$key])) {
                    //  Get the provided response value e.g John
                    $user_response = $user_responses[$key];
                } else {
                    //  Default to an empty string
                    $user_response = '';
                }

                //  Store the input value as dynamic data
                $this->setProperty($reference_name, $user_response);
            }
        }
    }

    /** This method will find the screen or display that matches the
     *  link given and sets it for later access.
     */
    public function setupLink($link = null)
    {
        //  If the link provided is in Array format
        if (is_array($link)) {
            //  Convert the "step" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($link);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the processed link value - Convert to [String] - Default to empty string if anything goes wrong
            $link = $this->convertToString($outputResponse) ?? '';
        }

        //  If we have a link
        if (!empty($link)) {
            //  Return True/False if the first characters match the value "screen"
            $isScreen = (substr($link, 0, 6) == 'screen') ? true : false;

            //  Return True/False if the first characters match the value "display"
            $isDisplay = (substr($link, 0, 7) == 'display') ? true : false;

            //  If we should link to a display
            if ($isDisplay) {

                //  Get the display matching the given link
                $outputResponse = $this->getDisplayById($link);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                $this->linked_display = $outputResponse;

            //  If we should link to a screen
            } elseif ($isScreen) {

                //  Get the screen matching the given link
                $outputResponse = $this->searchScreenById($link);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                $this->linked_screen = $outputResponse;

            }
        }
    }

    /** This method returns a display if it exists by searching based on
     *  the display name provided.
     */
    public function getDisplayById($link = null)
    {
        //  If the link provided is in Array format
        if (is_array($link)) {
            //  Convert the "step" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($link);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the processed link value - Convert to [String] - Default to empty string if anything goes wrong
            $link = $this->convertToString($outputResponse) ?? '';
        }

        //  If the display name has been provided
        if (!empty($link)) {
            //  Get the first display that matches the given link
            return collect($this->screen['displays'])->where('id', $link)->first() ?? null;
        }
    }

    /** This method returns a screen if it exists by searching based on
     *  the screen name provided.
     */
    public function searchScreenById($link = null)
    {
        //  If the link provided is in Array format
        if (is_array($link)) {

            //  Convert the "step" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($link);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the processed link value - Convert to [String] - Default to null if anything goes wrong
            $link = $this->convertToString($outputResponse) ?? null;

        }

        //  If the screen name has been provided
        if ($link) {

            //  Get the first screen that matches the given link
            return collect($this->screens)->where('id', $link)->first() ?? null;

        }
    }

    /** This method returns a screen if it exists by searching based on
     *  the screen marker provided.
     */
    public function getScreenByMarker($marker = null)
    {
        //  If the marker provided is in Array format
        if ( !empty($marker)) {

            return collect($this->chained_screens)->filter(function($screen) use ($marker) {

                return collect($screen['markers'])->filter(function($screen_marker) use ($marker) {

                    return $screen_marker == $marker;

                })->count() ? true : false;

            })->first();

        }
    }

    /**
     *  This method checks if a screen exists by searching based on
     *  the screen marker provided.
     */
    public function hasScreenByMarker($marker = null)
    {
        return !empty($this->getScreenByMarker($marker)) ? true : false;
    }

    /** This method returns a display if it exists by searching based on
     *  the display marker provided.
     */
    public function getDisplayByMarker($marker = null)
    {
        //  If the marker provided is in Array format
        if ( !empty($marker)) {

            return collect($this->chained_displays)->filter(function($display) use ($marker) {

                return collect($display['content']['markers'])->filter(function($display_marker) use ($marker) {

                    return $display_marker == $marker;

                })->count() ? true : false;

            })->first();

        }
    }

    /**
     *  This method checks if a display exists by searching based on
     *  the display marker provided.
     */
    public function hasDisplayByMarker($marker = null)
    {
        return !empty($this->getDisplayByMarker($marker)) ? true : false;
    }

    public function handleNavigation($type)
    {
        //  If the screen is set to repeats
        if ($this->screen_repeats === true) {
            //  Set an info log that we are checking if the display can navigate forward
            $this->logInfo('Checking if '.$this->wrapAsPrimaryHtml($this->display['name']).' can navigate '.$type);

            if ($type == 'forward') {
                $navigations = $this->display['content']['screen_repeat_navigation']['forward_navigation'];
            } elseif ($type == 'backward') {
                $navigations = $this->display['content']['screen_repeat_navigation']['backward_navigation'];
            }

            foreach ($navigations as $navigation) {
                //  Get the navigation step settings
                $step = $navigation['custom']['step'];

                /******************
                 * BUILD STEP     *
                 ******************/

                //  Convert the "step" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($step);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the processed step value (Convert from [String] to [Number]) - Default to 1 if anything goes wrong
                $step_number = $this->convertToInteger($outputResponse) ?? 1;

                //  If the processed navigation step number is not an integer or a number greater than 1
                if (!is_integer($step_number) || !($step_number >= 1)) {
                    //  Set an warning log that the step number must be of type array.
                    if (!is_integer($step_number)) {
                        //  Get the step type wrapped in html tags
                        $dataType = $this->wrapAsSuccessHtml($this->getDataType($step_number));

                        //  Set a warning log that the dynamic property is not an array
                        $this->logWarning('The given '.$type.' navigation step number must be of type ['.$this->wrapAsSuccessHtml('Array').'] however we received type of ['.$dataType.'].');
                    }

                    if (!($step_number >= 1)) {
                        $this->logWarning('The given '.$type.' navigation step number equals ['.$this->wrapAsSuccessHtml($step_number).']. The expected value must equal ['.$this->wrapAsSuccessHtml('1').'] or an integer greater than ['.$this->wrapAsSuccessHtml('1').'].For this reason we will use the default value of ['.$this->wrapAsSuccessHtml('1').']');
                    }

                    //  Default the navigation step number to 1
                    $this->navigation_step_number = 1;
                } else {
                    $this->navigation_step_number = $step_number;
                }

                if ($navigation['selected_type'] == 'custom') {
                    //  Set an info log that we are checking if the display can navigate
                    $this->logInfo($this->wrapAsSuccessHtml($this->display['name']).' supports custom '.$type.' navigation');

                    //  Get the custom inputs e.g "1, 2, 3"
                    $inputs = $navigation['custom']['inputs'];

                    /********************
                     * BUILD INPUTS     *
                     *******************/

                    //  Convert the "inputs" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($inputs);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the processed step value (Convert from [String] to [Number]) - Default to 1 if anything goes wrong
                    $inputs = $this->convertToString($outputResponse);

                    //  If we have inputs
                    if (!empty($inputs)) {
                        //  Seprate the inputs by comma ","
                        $valid_inputs = explode(',', $inputs);

                        foreach ($valid_inputs as $key => $input) {
                            //  Make sure each input has no left and right spaces
                            $valid_inputs[$key] = trim($input);
                        }

                        if (count($valid_inputs) == 1) {
                            $this->logInfo('The user input must match the following value '.$this->wrapAsPrimaryHtml(implode(', ', $valid_inputs)).' to navigate '.$type);
                        } else {
                            $this->logInfo('The user input must match any of the the following values '.$this->wrapAsPrimaryHtml(implode(', ', $valid_inputs)).' to navigate '.$type);
                        }

                        //  If the user response matches any valid navigation input
                        if (in_array($this->current_user_response, $valid_inputs)) {
                            if (count($valid_inputs) == 1) {
                                $this->logInfo('The user input '.$this->wrapAsPrimaryHtml($this->current_user_response).' matched the following value '.$this->wrapAsPrimaryHtml(implode(', ', $valid_inputs)));
                            } else {
                                $this->logInfo('The user input '.$this->wrapAsPrimaryHtml($this->current_user_response).' matched one of the following values '.$this->wrapAsPrimaryHtml(implode(', ', $valid_inputs)));
                            }

                            //  Set an info log that user response has been allowed for navigation
                            $this->logInfo($this->wrapAsSuccessHtml($this->display['name']).' user response allowed for '.$type.' navigation');

                            /***************************************
                             * SET NAVIGAITON TARGET SCREEN ID     *
                             **************************************/
                            $link = $navigation['custom']['link'];

                            //  Get the screen matching the given link
                            $outputResponse = $this->searchScreenById($link);

                            //  If we have a screen to show return the response otherwise continue
                            if ($this->shouldDisplayScreen($outputResponse)) {
                                return $outputResponse;
                            }

                            $this->navigation_target_screen_id = ($outputResponse['id'] ?? null);

                            /* Increment the current level so that we target the next repeat display
                             *  (This means we are targeting the same display but different instance)
                             */
                            ++$this->level;

                            if ($type == 'forward') {
                                /* Return an indication that we want to navigate forward (i.e Go to the next iteration)
                                 *
                                 *  Refer to: startRepeatScreen()
                                 *
                                 */
                                $this->navigation_request_type = 'navigate-forward';
                            } elseif ($type == 'backward') {
                                /* Return an indication that we want to navigate backward (i.e Go to the previous iteration)
                                 *
                                 *  Refer to: startRepeatScreen()
                                 *
                                 */
                                $this->navigation_request_type = 'navigate-backward';
                            }
                        } else {
                            if (count($valid_inputs) == 1) {
                                $this->logInfo('Cannot navigate '.$type.' since the user input '.$this->wrapAsPrimaryHtml($this->current_user_response).' does not match the following value '.$this->wrapAsPrimaryHtml(implode(', ', $valid_inputs)));
                            } else {
                                $this->logInfo('Cannot navigate '.$type.' since the user input '.$this->wrapAsPrimaryHtml($this->current_user_response).' does not match any of the following values '.$this->wrapAsPrimaryHtml(implode(', ', $valid_inputs)));
                            }
                        }
                    }
                }
            }
        }
    }

    public function resetIncorrectOptionSelected()
    {
        $this->incorrect_option_selected = null;
    }

    public function handleLinkingToScreenOrDisplay()
    {
        //  Check if the current display must link to another display or screen
        if ($this->checkIfDisplayMustLink()) {
            /* Increment the current level so that we target the next screen or display
             * (This means we are targeting the linked screen)
             */
            ++$this->level;

            //  If we have a display we can link to
            if (!empty($this->linked_display)) {

                //  Handle on display leave events
                $handleEventsResponse = $this->handleOnDisplayLeaveEvents();

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($handleEventsResponse)) {
                    return $handleEventsResponse;
                }

                //  Set the linked display as the current display
                $this->display = $this->linked_display;

                //  Reset the linked display to nothing
                $this->linked_display = null;

                //  Handle the current display (This means we are handling the linked display)
                $response = $this->handleCurrentDisplay();

                return $response;

            //  If we have a screen we can link to
            } elseif (!empty($this->linked_screen)) {

                //  Handle on screen leave events
                $handleEventsResponse = $this->handleOnScreenLeaveEvents();

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($handleEventsResponse)) {
                    return $handleEventsResponse;
                }

                //  Set the linked screen as the current screen
                $this->screen = $this->linked_screen;

                //  Reset the linked screen to nothing
                $this->linked_screen = null;

                //  Handle the current screen (This means we are handling the linked screen)
                $response = $this->handleCurrentScreen();

                return $response;

            }
        }
    }

    /** This method checks if the current display has a screen or display
     *  it can link to. If (yes) we return true, if (no) we return false.
     */
    public function checkIfDisplayMustLink()
    {
        //  If we have a display or screen we can link to
        if (!empty($this->linked_display) || !empty($this->linked_screen)) {
            //  Return true to indicate that we must link to another display or screen
            return true;
        }

        //  Return false to indicate that we must not link to another screen
        return false;
    }

    /******************************************
     *  REPEAT EVENT METHODS                *
     *****************************************/

     /**
      *    These events fire before we start building the screen and its nested displays
      */
    public function handleOnScreenEnterEvents()
    {
        //  Check if the screen has on_enter events
        if (count($this->screen['events']['on_enter']['collection'])) {

            $this->event_type = 'screen_on_enter';

            //  Get the events to handle
            $events = $this->screen['events']['on_enter']['collection'];

            //  Set an info log that the current screen has on enter events
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' has '.$this->wrapAsSuccessHtml(count($events)).') on screen enter events');

            //  Start handling the given events
            return $this->handleEvents($events, 'screen');

        } else {

            //  Set an info log that the current screen does not have on enter events
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' does not have on screen enter events.');

            return null;

        }
    }

    public function handleOnScreenLeaveEvents()
    {
        //  Check if the screen has on_leave events
        if (count($this->screen['events']['on_leave']['collection'])) {

            $this->event_type = 'screen_on_leave';

            //  Get the events to handle
            $events = $this->screen['events']['on_leave']['collection'];

            //  Set an info log that the current screen has on_leave events
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' has '.$this->wrapAsSuccessHtml(count($events)).') on screen leave events');

            //  Start handling the given events
            return $this->handleEvents($events, 'screen');

        } else {

            //  Set an info log that the current screen does not have has on_leave events
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' does not have on screen leave events.');

            return null;

        }
    }

    public function handleOnScreenResponseEvents()
    {
        //  Check if the screen has on_response events
        if (count($this->screen['events']['on_response']['collection'])) {

            $this->event_type = 'screen_on_response';

            //  Get the events to handle
            $events = $this->screen['events']['on_response']['collection'];

            //  Set an info log that the current screen has on_response events
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' has '.$this->wrapAsSuccessHtml(count($events)).') on screen response events');

            //  Start handling the given events
            return $this->handleEvents($events, 'screen');

        } else {

            //  Set an info log that the current screen does not have has on_response events
            $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' does not have on screen response events.');

            return null;

        }
    }

    /******************************************
     *  DISPLAY EVENT METHODS                *
     *****************************************/

    public function handleOnDisplayEnterEvents()
    {
        //  Check if the display has on enter events
        if (count($this->display['content']['events']['on_enter']['collection'])) {

            $this->event_type = 'before_reply';

            //  Get the events to handle
            $events = $this->display['content']['events']['on_enter']['collection'];

            //  Set an info log that the current screen has on enter events
            $this->logInfo('Display '.$this->wrapAsPrimaryHtml($this->display['name']).' has ('.$this->wrapAsSuccessHtml(count($events)).') on enter events.');

            //  Start handling the given events
            return $this->handleEvents($events, 'display');

        } else {

            //  Set an info log that the current display does not have on enter events
            $this->logInfo('Display '.$this->wrapAsPrimaryHtml($this->display['name']).' does not have on enter events');

            return null;

        }
    }

    public function handleOnDisplayLeaveEvents()
    {
        //  Check if the display has on leave events
        if (count($this->display['content']['events']['on_leave']['collection'])) {

            $this->event_type = 'before_reply';

            //  Get the events to handle
            $events = $this->display['content']['events']['on_leave']['collection'];

            //  Set an info log that the current screen has on leave events
            $this->logInfo('Display '.$this->wrapAsPrimaryHtml($this->display['name']).' has ('.$this->wrapAsSuccessHtml(count($events)).') on leave events.');

            //  Start handling the given events
            return $this->handleEvents($events, 'display');

        } else {

            //  Set an info log that the current display does not have on leave events
            $this->logInfo('Display '.$this->wrapAsPrimaryHtml($this->display['name']).' does not have on leave events.');

            return null;

        }
    }

    public function handleOnDisplayResponseEvents()
    {
        //  Check if the display has on response events
        if (count($this->display['content']['events']['on_response']['collection'])) {

            $this->event_type = 'on_display_response';

            //  Get the events to handle
            $events = $this->display['content']['events']['on_response']['collection'];

            //  Set an info log that the current screen has on response events
            $this->logInfo('Display '.$this->wrapAsPrimaryHtml($this->display['name']).' has (<span class="text-green-500">'.count($events).'</span>) on response events.');

            //  Start handling the given events
            return $this->handleEvents($events, 'display');

        } else {

            //  Set an info log that the current display does not have on response events
            $this->logInfo('Display '.$this->wrapAsPrimaryHtml($this->display['name']).' does not have on response events.');

            return null;

        }
    }

    /******************************************
     *  EVENT METHODS                         *
     *****************************************/

    public function handleEvents($events = [], $origin = null)
    {
        //  If we have events to handle
        if (count($events)) {

            //  Foreach event
            foreach ($events as $event) {

                //  Handle the current event
                $handleEventResponse = $this->handleEvent($event, $origin);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($handleEventResponse)) {

                    //  Set an info log that the current event wants to display information
                    $this->logInfo('Event: '.$this->wrapAsSuccessHtml($event['name']).', wants to display information, we are not running any other events or processes, instead we will return information to display.');

                    //  Return the screen information
                    return $handleEventResponse;

                }

                //  Check if we can run any other events after this event has been executed
                if (isset($event['run_next_events'])) {

                    //  Set an info log that we are checking if we can run any other events after the current event
                    $this->logInfo('Checking if we can run any other events after the '.$this->wrapAsSuccessHtml($event['name']).' event.');

                    //  Get the active state value
                    $activeState = $this->processActiveState($event['active']);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($activeState)) {
                        return $activeState;
                    }

                    //  If we should run the next events if this event is active
                    if($event['run_next_events']['selected_type'] === 'if_active' && $activeState === true){

                        //  Run the next events if this event is active
                        $activeState = true;

                    }elseif($event['run_next_events']['selected_type'] === 'if_inactive' && $activeState === false){

                        //  Run the next events if this event is inactive
                        $activeState = true;

                    }else{

                        //  Get the active state value of the "run_next_events"
                        $activeState = $this->processActiveState($event['run_next_events']);

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($activeState)) {
                            return $activeState;
                        }

                    }

                    //  If the pagination is active
                    if ($activeState === true) {
                        //  Set an info log that we can run any events after this event
                        $this->logInfo($this->wrapAsSuccessHtml('Continue Event Execution: ').' Yes, we can run any other events after the '.$this->wrapAsSuccessHtml($event['name']).' event.');
                    } else {
                        //  Set an info log that we are not running anymore events after this event
                        $this->logInfo($this->wrapAsWarningHtml('Stop Event Execution: ').' We are not running any other events after the '.$this->wrapAsSuccessHtml($event['name']).' event.');

                        //  Return null to stop the foreach loop so that we don't execute any other events
                        return null;
                    }
                }
            }
        }
    }

    public function handleEvent($event = null, $origin = null)
    {
        //  Get the active state value
        $activeState = $this->processActiveState($event['active']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($activeState)) {
            return $activeState;
        }

        //  If we can run this event
        if ($activeState === true) {

            //  Get the time before processing the request
            $start_event_time = microtime(true);

            if( $origin == 'app' ){

                //  Set an info log that we are preparing to handle the given event
                $this->logInfo('Application preparing to handle the '.$this->wrapAsSuccessHtml($event['name']).' event');

            }elseif( $origin == 'screen' ){

                //  Set an info log that we are preparing to handle the given event
                $this->logInfo('Screen: '.$this->wrapAsPrimaryHtml($this->screen['name']).' preparing to handle the '.$this->wrapAsSuccessHtml($event['name']).' event');


            }elseif( $origin == 'display' ){

                //  Set an info log that we are preparing to handle the given event
                $this->logInfo('Display: '.$this->wrapAsPrimaryHtml($this->display['name']).' preparing to handle the '.$this->wrapAsSuccessHtml($event['name']).' event');

            }else {

                //  Set an info log that we are preparing to handle the given event
                $this->logInfo('Preparing to handle the '.$this->wrapAsSuccessHtml($event['name']).' event');

            }

            //  Get the current event
            $this->event = $event;

            if ($event['type'] == 'REST API') {
                $response = $this->handle_REST_API_Event();
            } elseif ($event['type'] == 'SMS API') {
                $response = $this->handle_SMS_API_Event();
            } elseif ($event['type'] == 'Email API') {
                $response = $this->handle_Email_API_Event();
            } elseif ($event['type'] == 'Airtime Billing API') {
                $response = $this->handle_Artime_Billing_API_Event();
            } elseif ($event['type'] == 'Orange Money API') {
                $response = $this->handle_Orange_Money_API_Event();
            }elseif ($event['type'] == 'Validation') {
                $response = $this->handle_Validation_Event();
            } elseif ($event['type'] == 'Formatting') {
                $response = $this->handle_Formatting_Event();
            } elseif ($event['type'] == 'Set Property') {
                $response = $this->handle_Set_Property_Event();
            } elseif ($event['type'] == 'Custom Code') {
                $response = $this->handle_Custom_Code_Event();
            } elseif ($event['type'] == 'Auto Reply') {
                $response = $this->handle_Auto_Reply_Event();
            } elseif ($event['type'] == 'Auto Link') {
                $response = $this->handle_Auto_Link_Event();
            } elseif ($event['type'] == 'Revisit') {
                $response = $this->handle_Revisit_Event();
            } elseif ($event['type'] == 'Redirect') {
                $response = $this->handle_Redirect_Event();
            } elseif ($event['type'] == 'Notification') {
                $response = $this->handle_Notification_Event();
            } elseif ($event['type'] == 'Event Collection') {
                $response = $this->handle_Event_Collection_Event();
            } elseif ($event['type'] == 'Terminate Session') {
                $response = $this->handle_Terminate_Session_Event();
            } elseif ($event['type'] == 'Database') {
                $response = $this->handle_Database_Event();
            } elseif ($event['type'] == 'AppWrite Connection') {
                $response = $this->handle_AppWriteConnection_Event();
            }else{
                throw new Exception('The event '.$event['type'].' is deprecated and no longer supported. Consider saving the version to pull the latest updates.');
            }

            //  Get the time after processing the request
            $end_event_time = microtime(true);

            //  Get the difference in seconds between the start and end request time
            $event_time_in_seconds = round(($end_event_time - $start_event_time), 2);

            $this->logInfo('Execution time for '.$this->wrapAsSuccessHtml($event['name']).' event: '.$this->wrapAsSuccessHtml($event_time_in_seconds.($event_time_in_seconds == 1 ? ' second' : ' seconds')));

            return $response;

        } else {

            //  Set an info log that the current event is not activated
            $this->logInfo('Event: '.$this->wrapAsSuccessHtml($event['name']).' is '.$this->wrapAsWarningHtml('not activated').', therefore will not be executed.');

        }
    }

    /******************************************
     *  REST API EVENT METHODS                *
     *****************************************/
    public function handle_REST_API_Event()
    {
        if ($this->event) {
            /** Run the REST API Call. This will render as: $this->get_REST_Api_URL()
             *  while being called within a try/catch handler.
             */
            $apiCallResponse = $this->tryCatch('run_REST_Api_Call');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($apiCallResponse)) {
                return $apiCallResponse;
            }

            return $this->handle_REST_Api_Response($apiCallResponse);
        }
    }

    public function run_REST_Api_Call($method = null, $url = null, $request_options = [])
    {
        //  Check if we provided the API method and url manually
        if( empty($method) && empty($url) ){

            /** Set the REST API URL. This will render as: $this->get_REST_Api_URL()
             *  while being called within a try/catch handler.
             */
            $url = $this->tryCatch('get_REST_Api_URL');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($url)) {
                return $url;
            }

            /** Set the REST API METHOD. This will render as: $this->get_REST_Api_Method()
             *  while being called within a try/catch handler.
             */
            $method = $this->tryCatch('get_REST_Api_Method');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($method)) {
                return $method;
            }

            /** Set the REST API HEADERS. This will render as: $this->get_REST_Api_Headers()
             *  while being called within a try/catch handler.
             */
            $headers = $this->tryCatch('get_REST_Api_Headers');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($headers)) {
                return $headers;
            }

            /** Set the REST API FORM DATA. This will render as: $this->get_REST_Api_Form_Data()
             *  while being called within a try/catch handler.
             */
            $form_data = $this->tryCatch('get_REST_Api_Form_Data');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($form_data)) {
                return $form_data;
            }

            /** Set the REST API QUERY PARAMS. This will render as: $this->get_REST_Api_Query_Params()
             *  while being called within a try/catch handler.
             */
            $query_params = $this->tryCatch('get_REST_Api_Query_Params');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($query_params)) {
                return $query_params;
            }

        }

        //  Check if the REST Url and Method has been provided
        if (empty($url) || !is_string($url) || empty($method)) {

            //  Check if the REST Url has been provided
            if (empty($url)) {
                //  Set a warning log that the REST API Url was not provided
                $this->logWarning('API Url was not provided');

                //  Show the technical difficulties error screen to notify the user of the issue
                return $this->showTechnicalDifficultiesErrorScreen();
            }

            //  Check if the REST Url is a String
            if (!is_string($url)) {
                //  Set a warning log that the REST API Url is not a string
                $this->logWarning('API Url must be a string e.g http://www.example.com/api');

                //  Show the technical difficulties error screen to notify the user of the issue
                return $this->showTechnicalDifficultiesErrorScreen();
            }

            //  Check if the REST Method has been provided
            if (empty($method)) {
                //  Set a warning log that the REST API Method was not provided
                $this->logWarning('API Method was not provided');

                //  Show the technical difficulties error screen to notify the user of the issue
                return $this->showTechnicalDifficultiesErrorScreen();
            }

        } else {
            //  Set an info log of the REST API Url provided
            $this->logInfo('API Url: '.$this->wrapAsSuccessHtml($url));

            //  Set an info log of the REST API Method provided
            $this->logInfo('API Method: '.$this->wrapAsSuccessHtml(strtoupper($method)));
        }

        //  Check if the provided url is correct
        if (!$this->isValidUrl($url)) {
            //  Set a warning log that the REST API Url provided is incorrect
            $this->logWarning('API Url provided is incorrect ('.$this->wrapAsSuccessHtml($url).')');

            //  Show the technical difficulties error screen to notify the user of the issue
            return $this->showTechnicalDifficultiesErrorScreen();
        }

        //  If we have the headers
        if (!empty($headers) && is_array($headers)) {
            //  Add the headers to the headers attribute of our API options
            $request_options['headers'] = $headers;

            foreach ($headers as $key => $value) {
                //  Set an info log of the REST API header attribute
                $this->logInfo('Headers: '.$this->wrapAsSuccessHtml($key).' = '.$this->wrapAsSuccessHtml($value));
            }
        }

        //  If we have the query params
        if (!empty($query_params) && is_array($query_params)) {
            //  Add the query params to the query attribute of our API options
            $request_options['query'] = $query_params;

            foreach ($query_params as $key => $value) {
                //  Set an info log of the REST API query param attribute
                $this->logInfo('Query Params: '.$this->wrapAsSuccessHtml($key).' = '.$this->wrapAsSuccessHtml($value));
            }
        }

        //  If we have the form data
        if (!empty($form_data)) {

            $convert_to_json_object = $this->event['event_data']['form_data']['convert_to_json'];

            //  If we should convert the data to a JSON Object
            if ($convert_to_json_object) {
                //  Add the form data to the json attribute of our API options
                $request_options['json'] = $form_data;
            } else {
                //  Add the form data to the form_params attribute of our API options
                $request_options['form_params'] = $form_data;
            }

            //  Set an info log of the REST API form data attribute
            $this->logInfo('Form Data: '.$this->wrapAsSuccessHtml($this->convertToString($form_data)));

        }

        $request_options['http_errors'] = false;

        //  Disable SSL certificate validation
        $request_options['verify'] = false;

        //  Call Guzzle
        $response = $this->callGuzzleHttp($method, $url, $request_options);

        //  Return the response of the successful API call
        return $response;
    }

    public function callGuzzleHttp($method, $url, $request_options)
    {
        //  Create a new Http Guzzle Client
        $httpClient = new Client();

        //  Set an info log that we are performing REST API call
        $this->logInfo('Run API call to: '.$this->wrapAsSuccessHtml($url));

        //  Perform and return the Http request
        $response = $httpClient->request($method, $url, $request_options);

        //  Get the response body as a String
        $body = (string) $response->getBody();

        //  Get the response body and convert the JSON Object to an Array e.g [ "products" => [ ... ] ]
        //  $body = $this->convertObjectToArray(json_decode($response->getBody()));

        //  Get the response body as an Associative Array
        $array_body = json_decode($body, true);

        //  Get the response body as a JSON Object
        $json_body = json_decode($body, false);

        //  Get the response status code e.g "200"
        $status_code = (int) $response->getStatusCode();

        //  Get the response status phrase e.g "OK"
        $status_phrase = $response->getReasonPhrase() ?? '';

        //  Check if the is an "OK" status
        $ok = ($status_code == 200);

        //  Check if the is a "Success" response
        $successful = ($status_code >= 200 && $status_code < 300);

        //  Check if the is a "Redirect" response
        $redirect = ($status_code >= 300 && $status_code < 400);

        //  Check if the is a "Client Error" response
        $clientError = ($status_code >= 400 && $status_code < 500);

        //  Check if the is a "Server Error" response
        $serverError = $status_code >= 500;

        //  Check if the is a "Server/Client Error" response
        $failed = ($clientError || $serverError);

        //  Set the API Response Global Variable
        $this->api_response = [
            'body' => $body,
            'array' => $array_body,
            'json' => $json_body,
            'status' => $status_code,
            'ok' => $ok,
            'successful' => $successful,
            'redirect' => $redirect,
            'clientError' => $clientError,
            'serverError' => $serverError,
            'failed' => $failed,
        ];

        //  END TESTING HERE

        //  Check if this is not a good status code e.g "100", "200", "301" e.t.c
        if (!$this->checkIfGoodStatusCode($status_code)) {

            //  Set a warning log that the Api call failed
            $this->logWarning('Api call to '.$this->wrapAsErrorHtml($url).' failed.');

            //  Set a warning log of the status phrase
            $this->logWarning('Status Code: '.$this->wrapAsErrorHtml($status_code));

            //  Set a warning log of the status phrase
            $this->logWarning('Status Phase: '.$this->wrapAsErrorHtml($status_phrase));

            //  Set a warning log of the response body (Usually contain)
            $this->logWarning('Response: '.$this->wrapAsErrorHtml($response->getBody(true)));

            //  Set a warning log of the response body (Usually contain)
            $this->logWarning('Response: '.$this->wrapAsErrorHtml(json_encode(json_decode($body))));

        } else {

            //  Set a warning log that the Api call failed
            $this->logInfo('Api call to '.$this->wrapAsSuccessHtml($url).' was '.$this->wrapAsSuccessHtml('successful').'.');

            //  Set a warning log of the status phrase
            $this->logInfo('Status Code: '.$this->wrapAsSuccessHtml($status_code));

            //  Set a warning log of the status phrase
            $this->logInfo('Status Phase: '.$this->wrapAsSuccessHtml($status_phrase));

        }

        return $response;
    }

    public function get_REST_Api_URL()
    {
        $url = $this->event['event_data']['url'] ?? null;

        if ($url) {
            //  Convert the "url" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($url);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $url = $this->convertToString($outputResponse);

            /** Extract the query params from the URL. The Http Guzzle Client
             *  does not work when we pass literal query params as within the
             *  url string e.g.
             *
             *  http://wwww.example.com?field_1=value_1&field_2=value_2
             *
             *  This above url query params will not be detected (everything after
             *  ? will be ignored). The Http Guzzle Client will only see the URL
             *  without the query params e.g
             *
             *  http://wwww.example.com
             *
             *
             *  This is because he Http Guzzle Client expects us to pass any query
             *  params as a key-value on the options of the Guzzle method e.g
             *
             *  $response = $httpClient->request($method, $url, [
             *      'query' => [
             *          'field_1' => 'value_1',
             *          'field_2' => 'value_2',
             *      ]
             *  ]);
             *
             *  For this reason we must extract the query params from the URL string.
             *  We can then properly assign the query params to the "query" array
             *  as seen in the example above.
             */
            $url = $this->extractQueryParamsFromURL($url);
        }

        return $url;
    }

    public function extractQueryParamsFromURL($url)
    {
        /** If we have the following URL
         *
         *  http://wwww.example.com?field_1=value_1&field_2=value_2.
         *
         *  Explode the URL using the "?" symbol
         *
         *  $exploded_url = [0 => 'http://wwww.example.com', 1 => 'field_1=value_1&field_2=value_2'];
         *
         *  Check if the second key has been set i.e Does key "1" exist
         *
         *  If we have the second key set, then explode the query params using "&" symbol
         *
         *  $exploded_query_params = [0 => 'field_1=value_1', 1 => 'field_2=value_2'];
         *
         *  Foreach $exploded_query_param, explode the result using the '=' symbol
         *
         *  $exploded_query_param = [0 => 'field_1', 1 => 'value_1'];
         */

        //  $exploded_url = [0 => 'http://wwww.example.com', 1 => 'field_1=value_1&field_2=value_2'];
        $exploded_url = explode('?', $url);

        //  Check if we have any query params
        if (isset($exploded_url[1])) {
            //  $exploded_query_params = [0 => 'field_1=value_1', 1 => 'field_2=value_2'];
            $exploded_query_params = explode('&', $exploded_url[1]);

            foreach ($exploded_query_params as $exploded_query_param) {
                //  $exploded_query_param = [0 => 'field_1', 1 => 'value_1'];
                $exploded_query_param = explode('=', $exploded_query_param);

                //  If the query param name and value have been set
                if (isset($exploded_query_param[0]) && isset($exploded_query_param[1])) {
                    //  $name = ['field_1'];
                    $name = $exploded_query_param[0];

                    //  $value = ['value_1'];
                    $value = $exploded_query_param[1];

                    //  Convert the "query_param value" into its associated dynamic value
                    $outputResponse = $this->handleEmbeddedDynamicContentConversion($value);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output
                    $value = $this->convertToString($outputResponse);

                    //  $this->url_query_params['field_1'] = 'value_1';
                    $this->url_query_params[$name] = $value;
                }
            }
        }

        //  Return the URL without the query params string e.g "http://wwww.example.com"
        return $exploded_url[0];
    }

    public function get_REST_Api_Method()
    {
        $method = $this->event['event_data']['method'] ?? null;

        return $method;
    }

    public function get_REST_Api_Headers()
    {
        $headers = array_merge(
            $this->version->builder['global_headers'],
            $this->event['event_data']['headers']
        );

        $data = [];

        foreach ($headers as $header) {
            if (!empty($header['name'])) {
                //  Convert the "header value" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($header['value']);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output
                $value = $this->convertToString($outputResponse);

                $data[$header['name']] = $value;
            }
        }

        return $data;
    }

    public function get_REST_Api_Form_Data()
    {
        $use_code = $this->event['event_data']['form_data']['use_custom_code'];
        $convert_to_json_object = $this->event['event_data']['form_data']['convert_to_json'];

        if ($use_code) {
            $code = $this->event['event_data']['form_data']['code'];

            //  Process the PHP Code
            $outputResponse = $this->processPHPCode("$code");

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $data = $outputResponse;
        } else {
            $data = [];

            $form_data_params = $this->event['event_data']['form_data']['params'] ?? [];

            if (count($form_data_params)) {
                foreach ($form_data_params as $form_item) {
                    if (!empty($form_item['name'])) {
                        //  Convert the "form_item value" into its associated dynamic value
                        $outputResponse = $this->convertValueStructureIntoDynamicData($form_item['value']);

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($outputResponse)) {
                            return $outputResponse;
                        }

                        //  Get the generated output
                        $value = $outputResponse;

                        $data[$form_item['name']] = $value;
                    }
                }
            }
        }

        return $data;
    }

    public function get_REST_Api_Query_Params()
    {
        $query_params = $this->event['event_data']['query_params'] ?? [];

        $data = [];

        foreach ($query_params as $query_param) {
            if (!empty($query_param['name'])) {
                //  Convert the "query_param value" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($query_param['value']);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output
                $value = $this->convertToString($outputResponse);

                /**
                 *  Remove any url encoded values like "%20" for spaces " " e.g "https://example.com?filter=team%20members".
                 *  Without using urldecode(), these values will be captured as literal values. This means that we convert:
                 *
                 *  https://example.com?filter=team%20members
                 *
                 *  Into:
                 *
                 *  https://example.com?filter=team members
                 *
                 *  Then Guzzle will run url encode itself to convert this back into:
                 *
                 *  https://example.com?filter=team%20members
                 */
                $value = urldecode($value);

                $data[$query_param['name']] = $value;
            }
        }

        /** Note that $this->url_query_params represents the field-value
         *  query params that have been directly extracted from the URL
         *  e.g.
         *
         *  http://wwww.example.com?field_1=value_1&field_2=value_2
         *
         *  If we had the above url, then $this->url_query_params would
         *  be an array of the query params e.g
         *
         *  $this->url_query_params = [
         *      'field_1' => 'value_1',
         *      'field_2' => 'value_2'
         *  ];
         *
         *  Now we want to merge these query params with the compilled
         *  query params of the $data so that we have a single
         *  collection.
         */
        $data = array_merge($this->url_query_params, $data);

        /* Reset $this->url_query_params to an empty array. We need to
         *  reset to an empty array so that the next REST EVENT does not
         *  use these old query params for its own request.
         */
        $this->url_query_params = [];

        return $data;
    }

    public function get_REST_Api_Status_Handles()
    {
        $response_status_handles = $this->event['event_data']['response']['manual']['response_status_handles'] ?? [];

        return $response_status_handles;
    }

    public function isValidUrl($url = '')
    {
        return filter_var($url, FILTER_VALIDATE_URL) ? true : false;
    }

    public function handle_REST_Api_Response($response = null)
    {
        if ($response) {
            /** Get the REST API return type. We use the return type to determine how we
             *  want to handle the response of the API Call. Our options are as follows:.
             *
             *  Automatic : Automatically display the default success/error message depending on the API success
             *  Manual    : Manually display the provided custom information or message
             *
             *  Default is "automatic" if no value is provided
             */
            $return_type = $this->event['event_data']['response']['selected_type'] ?? 'automatic';

            //  Set an info log that we are starting to handle the REST API response
            $this->logInfo('Start handling REST Api Response');

            if ($return_type == 'manual') {
                return $this->handle_REST_Api_Manual_Response($response);
            } elseif ($return_type == 'automatic') {
                return $this->handle_REST_Api_Automatic_Response($response);
            }
        }
    }

    public function handle_REST_Api_Automatic_Response($response = null)
    {
        //  Set an info log that the REST API will be handled automatically
        $this->logInfo('Handle response '.$this->wrapAsSuccessHtml('Automatically'));

        //  Get the response status code e.g "200"
        $status_code = $response->getStatusCode();

        //  Get the response status phrase e.g "OK"
        $status_phrase = $response->getReasonPhrase() ?? '';

        /************************************
         * BUILD DEFAULT SUCCESS MESSAGE    *
         ***********************************/

        //  Get the default success message
        $default_success_message = $this->event['event_data']['response']['general']['default_success_message'];

        //  Convert the "step" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($default_success_message);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the processed link value - Convert to [String]
        $default_success_message = $this->convertToString($outputResponse) ?? 'Completed successfully';

        /**********************************
         * BUILD DEFAULT ERROR MESSAGE    *
         *********************************/

        //  Get the default error message
        $default_error_message = $this->event['event_data']['response']['general']['default_error_message'];

        //  Convert the "step" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($default_error_message);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the processed link value - Convert to [String]
        $default_error_message = $this->convertToString($outputResponse) ?? null;

        /*******************
         * HANDLE TYPES    *
         *******************/

        $on_success_handle_type = $this->event['event_data']['response']['automatic']['on_handle_success'] ?? 'use_default_success_msg';
        $on_error_handle_type = $this->event['event_data']['response']['automatic']['on_handle_error'] ?? 'use_default_error_msg';

        //  Check if this is a good status code e.g "100", "200", "301" e.t.c
        if ($this->checkIfGoodStatusCode($status_code)) {
            //  Set an info log of the response status code received
            $this->logInfo('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') Status text: '.$this->wrapAsSuccessHtml($status_phrase));

            //  Since this is a successful response, check if we should display a default success message or do nothing
            if ($on_success_handle_type == 'use_default_success_msg') {
                //  Set an info log that we are displaying the custom success message
                $this->logInfo('Display default success message: '.$this->wrapAsSuccessHtml($default_success_message));

                //  This is a good response - Display the custom succcess message
                return $this->showCustomScreen($default_success_message, ['continue' => false]);
            } elseif ($on_success_handle_type == 'do_nothing') {
                //  Return nothing
                return null;
            }

            //  If this is a bad status code e.g "400", "401", "500" e.t.c
        } else {
            //  Set an info log of the response status code received
            $this->logWarning('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') <br/> Status text: '.$this->wrapAsSuccessHtml($status_phrase));

            //  Since this is a failed response, check if we should display a default error message or do nothing
            if ($on_error_handle_type == 'use_default_error_msg') {
                //  If the default error message was provided
                if (!empty($default_error_message)) {
                    //  Set an info log that we are displaying the custom error message
                    $this->logInfo('Display default error message: '.$this->wrapAsSuccessHtml($default_error_message));

                    //  This is a bad response - Display the custom error message (The showEndScreen will terminate the session)
                    return $this->showEndScreen($default_error_message);

                //  If the default error message was not provided
                } else {
                    //  Set an warning log that the default error message was not provided
                    $this->logWarning('The default error message was not provided, using the default '.$this->wrapAsSuccessHtml('technical difficulties message').' instead');

                    //  Show the technical difficulties error screen to notify the user of the issue
                    return $this->showTechnicalDifficultiesErrorScreen();
                }
            } elseif ($on_error_handle_type == 'do_nothing') {
                //  Return nothing
                return null;
            }
        }
    }

    public function handle_REST_Api_Manual_Response($response = null)
    {
        //  Set an info log that the REST API will be handled manually
        $this->logInfo('Handle response '.$this->wrapAsSuccessHtml('Manually'));

        //  Get the response status code e.g "200"
        $status_code = $response->getStatusCode();

        //  Get the response status phrase e.g "OK"
        $status_phrase = $response->getReasonPhrase() ?? '';

        //  Get the response body and convert the JSON Object to an Array e.g [ "products" => [ ... ] ]
        $response_body = $this->convertObjectToArray(json_decode($response->getBody()));

        //  Get the response status handles
        $response_status_handles = $this->event['event_data']['response']['manual']['response_status_handles'] ?? [];

        if (!empty($response_status_handles)) {
            //  Get the request status handle that matches the given status
            $selected_handle = collect(array_filter($response_status_handles, function ($request_status_handle) use ($status_code) {
                return $request_status_handle['status'] == $status_code;
            }))->first() ?? null;

            //  If a matching response status handle was found
            if ($selected_handle) {
                //  Get the response reference name
                $response_reference_name = $selected_handle['reference_name'] ?? 'response';

                //  If the response reference name was provided
                if (!empty($response_reference_name)) {
                    //  Get the response attributes
                    $response_attributes = $selected_handle['attributes'];

                    //  Get the response handle type e.g "use_custom_msg" or "do_nothing"
                    $on_handle_type = $selected_handle['on_handle']['selected_type'];

                    //  Set an info log that we are storing the attributes of the custom API response
                    $this->logInfo('Start processing and storing the response attributes');

                    //  Set an info log of the number of response attributes found
                    $this->logInfo('Found ('.$this->wrapAsSuccessHtml(count($response_attributes)).') response attributes');

                    //  Add the current response body to the dynamic data storage
                    $this->setProperty($response_reference_name, $response_body, false);

                    //  Set an info log of the number of response attributes found
                    $this->logInfo('Setting '.$this->wrapAsSuccessHtml($response_reference_name).' as response variable');

                    //  Foreach attribute
                    foreach ($response_attributes as $response_attribute) {
                        //  Get the attribute name
                        $name = trim($response_attribute['name']);

                        //  If the attribute name and value exists
                        if (!empty($name)) {

                            //  Get the attribute value
                            $value = $response_attribute['value'];

                            //  Convert the "value" into its associated dynamic value
                            $outputResponse = $this->convertValueStructureIntoDynamicData($value);

                            //  If we have a screen to show return the response otherwise continue
                            if ($this->shouldDisplayScreen($outputResponse)) {
                                return $outputResponse;
                            }

                            //  Get the generated output
                            $value = $outputResponse;

                            //  Set an info log of the attribute name
                            $this->logInfo('Attribute: '.$this->wrapAsSuccessHtml($this->convertToString($name)).' = '.$this->wrapAsSuccessHtml($this->convertToString($value)));

                            //  Store the attribute data as dynamic data
                            $this->setProperty($name, $value);

                        }
                    }
                }

                if ($on_handle_type == 'use_custom_msg') {
                    //  Check if this is a good status code e.g "100", "200", "301" e.t.c
                    if ($this->checkIfGoodStatusCode($status_code)) {
                        //  Set an info log that we are displaying the custom message
                        $this->logInfo('Start processing the custom message to display for status code '.$this->wrapAsSuccessHtml($status_code));
                    } else {
                        //  Set an info log that we are displaying the custom message
                        $this->logInfo('Start processing the custom message to display for status code '.$this->wrapAsErrorHtml($status_code));
                    }

                    /*****************************
                     * BUILD CUSTOM MESSAGE      *
                     ****************************/

                    //  Get the custom message
                    $custom_message = $selected_handle['on_handle']['use_custom_msg'];

                    //  Convert the "custom message value" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($custom_message);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Get the generated output - Convert to [String]
                    $custom_message = $this->convertToString($outputResponse);

                    //  Set an info log of the final result
                    $this->logInfo(
                        '<p>Final result: <br /><div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.$this->wrapAsSuccessHtml($custom_message).'</div><p>'
                    );

                    //  Return the processed custom message display
                    return $this->showCustomScreen($custom_message);
                } elseif ($on_handle_type == 'do_nothing') {
                    //  Return nothing
                    return null;
                }
            } else {
                //  Check if this is a good status code e.g "100", "200", "301" e.t.c
                if ($this->checkIfGoodStatusCode($status_code)) {
                    //  Set a warning log that the custom API does not have a matching response status handle
                    $this->logWarning('No matching status handle to process the current response of status '.$this->wrapAsSuccessHtml($status_code));
                } else {
                    //  Set a warning log that the custom API does not have a matching response status handle
                    $this->logWarning('No matching status handle to process the current response of status '.$this->wrapAsErrorHtml($status_code));
                }
            }
        } else {
            //  Check if this is a good status code e.g "100", "200", "301" e.t.c
            if ($this->checkIfGoodStatusCode($status_code)) {
                //  Set a warning log that the custom API does not have response status handles
                $this->logWarning('No response status handles to process the current response of status '.$this->wrapAsSuccessHtml($status_code));
            } else {
                //  Set a warning log that the custom API does not have response status handles
                $this->logWarning('No response status handles to process the current response of status '.$this->wrapAsErrorHtml($status_code));
            }
        }

        //  Set a warning log that the custom API cannot be handled manually
        $this->logWarning('Could not handle the response '.$this->wrapAsSuccessHtml('Manually').', attempt to handle response '.$this->wrapAsSuccessHtml('Automatically'));

        //  Handle the request automatically
        return $this->handle_REST_Api_Automatic_Response($response);
    }

    public function checkIfGoodStatusCode($status_code = '')
    {
        /** About Status Codes:
         *
         *  1xx informational response – the request was received, continuing process
         *  2xx successful – the request was successfully received, understood, and accepted
         *  3xx redirection – further action needs to be taken in order to complete the request
         *  4xx client error – the request contains bad syntax or cannot be fulfilled
         *  5xx server error – the server failed to fulfil an apparently valid request.
         */
        $digit = substr($status_code, 0, 1);

        //  If the status code starts with "1", "2" or "3" e.g "100", "200", "301" e.t.c
        if (in_array($digit, ['1', '2', '3'])) {
            //  Return true for good status code
            return true;
        }

        //  Return false for bad status code
        return false;
    }

    /**
     *  This method sends an SMS to the subscriber
     */
    public function handle_SMS_API_Event()
    {
        if ($this->event) {

            /***************************
             * Set Sender Name         *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['sender_name']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $senderName = $outputResponse;

            if(empty($senderName)) $this->logWarning('The sender name must be provided to send the sms');

            if(strlen($senderName) > 20) $this->logWarning('The sender name must have 20 or less characters');

            /***************************
             * Set Sender Number       *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['sender_number']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $senderNumber = $outputResponse;

            if(empty($senderNumber)) $this->logWarning('The sender mobile number must be provided to send the sms');

            if(strlen($senderNumber) != 11) $this->logWarning('The sender mobile number must have 11 characters e.g 26772000001');

            /***************************
             * Set Recipient           *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['recipient_number']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $recipientNumber = $outputResponse;

            if(empty($recipientNumber)) $this->logWarning('The recipient mobile number be provided to send the sms');

            if(strlen($recipientNumber) != 11) $this->logWarning('The recipient mobile number must have 11 characters e.g 26772000001');

            /***************************
             * Set Message             *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['message']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $message = $outputResponse;

            /***************************
             * Client Credentials      *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['sms_connection']['client_credentials']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $clientCredentials = $outputResponse;

            if(empty($clientCredentials)) $this->logWarning('The SMS client credentials must be provided to send the sms');

            if(
                !empty($senderName) && !(strlen($senderName) > 20) &&
                !empty($senderNumber) && (strlen($senderNumber) == 11) &&
                !empty($recipientNumber) && (strlen($recipientNumber) == 11) &&
                !empty($clientCredentials) &&
                !empty($message)
            ){

                $this->sendSms($senderName, $senderNumber, $recipientNumber, $message, $clientCredentials);

            }else{

                $this->logWarning('SMS could not be sent due to missing values');

            }

        }
    }

    public function sendSms($senderName, $senderNumber, $recipientNumber, $message, $clientCredentials) {
        /**
         *  Send the SMS:
         *
         *  Because we can have issues trying to send the SMS, try atleast 20 times before
         *  we stop. Also make sure that we never take longer than 20 seconds so that we
         *  do not keep the subscriber waiting to long.
         *
         *  Additionally it would be great that we set the SMS on a queued job that can
         *  be handled by the queue worker at a later time.
         */
        $x = 0;

        $then = now();

        $smsSentStatus = false;

        /**
         *  Attempt to send the SMS if
         *
         *  (1) Its the first attempt
         *  (2) Its another attempt less than 20 total attempts
         *  (3) If the total time passed is less than 20 seconds
         */
        while( $x == 0 || ( !$smsSentStatus && $x < 20 && now()->diffInSeconds($then) < 20 ) ) {

            //  Increment the attempt number
            $x++;

            //  Capture the response (If any)
            $response = $this->sendSmsViaOrangeUsingREST($senderName, $senderNumber, $recipientNumber, $message, $clientCredentials, $x);

            break;

            //  $response will return "true" for successful attempt or "false" for unsuccessful attempt
            if( $response ) {

                $smsSentStatus = true;

            }

        }

        //  If we succeeded to send the SMS
        if( $smsSentStatus ) {

            $this->logInfo($this->wrapAsSuccessHtml('💬 SMS sent successfully after '. $x . ($x == 1 ? ' attempt' : ' attempts')));

        }

    }

    public function sendSmsViaOrangeUsingREST($senderName, $senderNumber, $recipientNumber, $message, $clientCredentials, $attemptNumber)
    {
        try {

            /// Log the SMS Attempts
            $this->logInfo('SMS Attempt '.$this->wrapAsPrimaryHtml('#'.$attemptNumber));

            //////////////////////////
            /// GENERATE SMS TOKEN ///
            //////////////////////////

            $tokenEndpoint = 'https://aas-bw.com.intraorange:443/token';

            /**
             *  Sample Response:
             *
             *  {
             *      "access_token": "eyJ4NXQiOiJOalUzWWpJeE5qRTVObU0wWVRkbE1XRmhNVFEyWWpkaU1tUXdNemMwTmpreFkyTmlaRE0xTlRrMk9EaGxaVFkwT0RFNU9EZzBNREkwWlRreU9HRmxOZyIsImtpZCI6Ik5qVTNZakl4TmpFNU5tTTBZVGRsTVdGaE1UUTJZamRpTW1Rd016YzBOamt4WTJOaVpETTFOVGsyT0RobFpUWTBPREU1T0RnME1ESTBaVGt5T0dGbE5nX1JTMjU2IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJPQldfSU5URUdSQVRJT05AY2FyYm9uLnN1cGVyIiwiYXV0IjoiQVBQTElDQVRJT04iLCJhdWQiOiJST2VHNFUxMXBhOUI4ZWludGVPUk5Mcjh1RWdhIiwibmJmIjoxNjkwNDY1MzY5LCJhenAiOiJST2VHNFUxMXBhOUI4ZWludGVPUk5Mcjh1RWdhIiwic2NvcGUiOiJhbV9hcHBsaWNhdGlvbl9zY29wZSBkZWZhdWx0IiwiaXNzIjoiaHR0cHM6XC9cL2Fhcy1idy1ndy5jb20uaW50cmFvcmFuZ2U6NDQzXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNjkwNDY4OTY5LCJpYXQiOjE2OTA0NjUzNjksImp0aSI6Ijg1ZDk2ZGJmLTNjYTAtNGEyMS05NzAwLWFlNGNlMTYzMDRjNiJ9.fFSjVkPWfxdLpYAmF86tGZInSI65Wtwz1sDYuQ_9QxHilqU2hUi5bJHB6Iw3cQepayJeY4899RLQ10H27YV9-P1zcVO_DJsiKA1itMZqcdwI5zMjmtOyJ7hbbACWLNXui4wYkuhWP2PhV3YgenB3wcNHIHtt-6dz4p4OIEkL22dmr_g5d6T-eBR3JLqGtP2ijyAfxxuS0brF6clEF04m2XzzE_RH4YoFzLvQPA56cuD45uMsNodhsK7D4f4xLOKyDiLjzXxwrnPuEgzsLp8LrZYmFgNRasLvdbazJFeOmZY9DrPk0vtYD93Bjb3nEmH5Mdgv4PsxoN_medTJdJ6Efw",
             *      "scope": "am_application_scope default",
             *      "token_type": "Bearer",
             *      "expires_in": 3600
             *  }
             *
             */
            $response = $this->callGuzzleHttp('POST', $tokenEndpoint, [
                'headers' => [
                    'Authorization' => 'Basic '.$clientCredentials,
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ],
                'form_params' => [
                    'grant_type' => 'client_credentials'
                ],
                'verify' => false,  // Disable SSL certificate verification
            ]);

            $jsonString = $response->getBody();
            $statusCode = $response->getStatusCode();
            $responseData = json_decode($jsonString, true);

            // Handle the response as needed
            if ($statusCode === 200) {

                /// Get the access token
                $accessToken = $responseData['access_token'];

                /// Log the SMS Access Token
                $this->logInfo('SMS access token: ' . $this->wrapAsSuccessHtml($accessToken));

                /// Log the SMS Access Token
                $this->logInfo('Attempting to send message: ' .$this->wrapAsSuccessHtml($message). ' to ' .$this->wrapAsSuccessHtml($recipientNumber). ' from '.$this->wrapAsSuccessHtml($senderNumber). ' (+'.$senderNumber.')');

                /////////////////////
                /// SEND THE SMS ///
                ////////////////////

                /**
                 *  Note the following:
                 *
                 *  To test sending sms using POSTMAN then replace "https://aas-bw.com.intraorange:443" with "https://aas.orange.co.bw:443".
                 *  The "https://aas-bw.com.intraorange:443" domain is used to send SMS while the application is hosted on the Orange Server
                 *  The "https://aas.orange.co.bw:443" domain is used to send SMS while the application is hosted outside the Orange Server
                 *  such as on a local machine (Macbook, e.t.c) or POSTMAN. Since this application will be hosted on the Orange Server, we
                 *  will use the "https://aas-bw.com.intraorange:443" domain
                 *
                 *  Note that "tel:+" converts to "tel%3A%2B" after being encoded
                 *
                 */
                $smsEndpoint = 'https://aas-bw.com.intraorange:443/smsmessaging/v1/outbound/tel%3A%2B'.$senderNumber.'/requests';

                /**
                 *  Sample Response:
                 *
                 * {
                 *      "outboundSMSMessageRequest": {
                 *      "address": [
                 *           "tel:+26772882239"
                 *      ],
                 *      "senderAddress": "tel:+26772882239",
                 *      "senderName": "Bonako",
                 *      "outboundSMSTextMessage": {
                 *          "message": "Welcome to Bonako Dial2Buy"
                 *      },
                 *      "clientCorrelator": "cf9d467d-2131-4280-b996-dddc5eb70eb2",
                 *      "resourceURL": "/smsmessaging/v1/outbound/tel:+26772882239/requests/req64c2c5261bc1c442747dd2ff",
                 *      "link": [
                 *          {
                 *               "rel": "Date",
                 *               "href": "2023-07-27T19:27:34.612Z"
                 *          }
                 *      ],
                 *      "deliveryInfoList": {
                 *          "resourceURL": "/smsmessaging/v1/outbound/tel:+26772882239/requests/req64c2c5261bc1c442747dd2ff/deliveryInfos",
                 *          "link": [],
                 *          "deliveryInfo": [
                 *              {
                 *                  "address": "tel:+26772882239",
                 *                  "deliveryStatus": "MessageWaiting",
                 *                  "link": []
                 *              }
                 *          ]
                 *      }
                 *  }
                 * }
                 */
                $response = $this->callGuzzleHttp('POST', $smsEndpoint, [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $accessToken,
                        'Content-Type' => 'application/json',
                        'accept' => 'application/json'
                    ],
                    'json' => [
                        'outboundSMSMessageRequest' => [
                            'address' => ['tel:+'.$recipientNumber],        //  Recepient number to send the SMS message
                            'senderAddress' => 'tel:+'.$senderNumber,       //  Sender number that will be displayed if senderName is not included
                            'senderName' => $senderName,                    //  Sender name e.g "Company XYZ"
                            'outboundSMSTextMessage' => [
                                'message' => $message
                            ],
                            'clientCorrelator' => $this->session_id.'-'.Str::random(40)     // A unique id to identify this SMS
                        ]
                    ],
                    'verify' => false,  // Disable SSL certificate verification
                ]);

                $jsonString = $response->getBody();
                $statusCode = $response->getStatusCode();
                $responseData = json_decode($jsonString, true);

                // Handle the response as needed
                if ($statusCode === 201) {

                    /// Return true that we succeeded to send the SMS
                    return true;

                } else {

                    // Handle the error
                    $this->logError('Failed to send SMS');
                    $this->logError('Response Body: '.$jsonString);
                    $this->logError('Status Code: '.$statusCode);

                }


            } else {

                // Handle the error
                $this->logError('Failed to acquire SMS Accesss Token');
                $this->logError('Response Body: '.$jsonString);
                $this->logError('Status Code: '.$statusCode);

            }

            /// Return false that we failed to send the SMS
            return false;

        } catch (\GuzzleHttp\Exception\GuzzleException $e) {

            // Handle any exceptions that occurred during the API call
            $this->logError('Failed to acquire token - Error Message: '.$e->getMessage());

            /// Return false that we failed to send the SMS
            return false;

        }
    }

    /**
     *  This method sends an Email to the recipient
     */
    public function handle_Email_API_Event()
    {
        if ($this->event) {

            /***************************
             * Set Sender Name         *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['sender_name']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $sender_name = $outputResponse;

            if(empty($sender_name)) $this->logWarning('The sender name must be provided to send the email');

            /***************************
             * Set Sender Email        *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['sender_email']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $sender_email = $outputResponse;

            if(empty($sender_email)) $this->logWarning('The sender email must be provided to send the email');

            /***************************
             * Set Recipient Email     *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['recipient_email']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $recipient_email = $outputResponse;

            if(empty($recipient_email)) $this->logWarning('The recipient email must be provided to send the email');

            /***************************
             * Subject                 *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['subject']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $subject = $outputResponse;

            if(empty($subject)) $this->logWarning('The subject must be provided to send the email');

            /***************************
             * Message             *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['message']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $message = $outputResponse;

            if(empty($message)) $this->logWarning('The message must be provided to send the sms');


            if( !empty($sender_name) && !empty($sender_email) && !empty($recipient_email) && !empty($subject) && !empty($message) ){

                $response = Mail::to($recipient_email)->send(new \App\Mail\UssdSessionEmail(
                    $sender_name, $sender_email, $subject, $message
                ));

                if($response) $this->logInfo($this->wrapAsSuccessHtml('Email sent successfully'));

            }else{

                $this->logWarning('Email could not be sent due to missing values');

            }

        }
    }

    /**
     *  This method connects to the AppWrite service
     */
    public function handle_AppWriteConnection_Event()
    {
        if ($this->event) {

            $code = $this->event['event_data']['code'];

            $referenceName = $this->event['event_data']['reference_name'];

            $onRequestSuccessEvents = $this->event['event_data']['events']['on_request_success']['collection'];
            $onRequestFailEvents = $this->event['event_data']['events']['on_request_fail']['collection'];

            /***************************
             * Set Endpoint            *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['appwrite_connection']['endpoint']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $endpoint = $outputResponse;

            if(empty($endpoint)) $this->logWarning('The Appwrite endpoint must be provided to send the sms');

            /***************************
             * Set Project ID          *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['appwrite_connection']['project_id']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $projectId = $outputResponse;

            if(empty($projectId)) $this->logWarning('The Appwrite project id must be provided to send the sms');

            /***************************
             * Set API Key             *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['appwrite_connection']['api_key']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $apiKey = $outputResponse;

            if(empty($apiKey)) $this->logWarning('The Appwrite API Key must be provided to send the sms');

            if( !empty($endpoint) && !empty($projectId) && !empty($apiKey) ){

                $client = new AppWriteClient();

                $client->setEndpoint($endpoint)     // Your API Endpoint
                        ->setProject($projectId)    // Your project ID
                        ->setKey($apiKey);          // Your API key

                /**
                 *  Set the AppWrite services as dynamic properties
                 *
                 *  How to use AppWrite queries in php: https://github.com/appwrite/sdk-for-php/issues/12
                 */
                $this->setProperty('appWriteID', new AppWriteID(), false);
                $this->setProperty('appWriteQuery', new AppWriteQuery(), false);
                $this->setProperty('appWriteUsers', new AppWriteUsers($client), false);
                $this->setProperty('appWriteTeams', new AppwriteTeams($client), false);
                $this->setProperty('appWriteStorage', new AppwriteStorage($client), false);
                $this->setProperty('AppwriteDatabases', new AppwriteDatabases($client), false);
                $this->setProperty('appWriteFunctions', new AppwriteFunctions($client), false);

                try {

                    //  Process the PHP Code to consume the AppWrite service above
                    $outputResponse = $this->processPHPCode("$code");

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  If the output reference name is provided
                    if( !empty($referenceName) ) {

                        //  Capture the output into the reference name provided
                        $this->setProperty($referenceName, $outputResponse);

                    }

                    //  If we have on success events
                    if( count($onRequestSuccessEvents) ) {

                        //  Set an info log that the current event has on success events
                        $this->logInfo($this->wrapAsPrimaryHtml('AppWrite event has ('.$this->wrapAsSuccessHtml(count($onRequestSuccessEvents)).') on request success events'));

                        //  Start handling the given events
                        return $this->handleEvents($onRequestSuccessEvents);

                    }

                } catch (AppwriteException $e) {

                    //  Handle the AppwriteException
                    $this->logWarning('AppWrite request failed');
                    $this->logError('Message: ' . $e->getMessage());
                    $this->logError('Type: ' . $e->getType());
                    $this->logError('Code: ' . $e->getCode());

                    //  If the output reference name is provided
                    if( !empty($referenceName) ) {

                        //  Capture the error output into the reference name provided
                        $this->setProperty($referenceName, $e);

                    }

                    //  If we have on fail events
                    if( count($onRequestFailEvents) ) {

                        //  Set an info log that the current event has on fail events
                        $this->logInfo($this->wrapAsPrimaryHtml('AppWrite event has ('.$this->wrapAsSuccessHtml(count($onRequestFailEvents)).') on request fail events'));

                        //  Start handling the given events
                        return $this->handleEvents($onRequestFailEvents);

                    }else{

                        //  Show the technical difficulties error screen to notify the user of the issue
                        return $this->showTechnicalDifficultiesErrorScreen();

                    }

                }

            }else{

                $this->logWarning('The Appwrite connection was aborted due to missing values');

            }

        }
    }

    /**
     *  This method bills the subscriber on their main artime balance
     */
    public function handle_Artime_Billing_API_Event()
    {
        if ($this->event) {

            /**
             *  Set the REQUIRED fields
             */

            /***************************************
             * Set The Airtime Billing Action      *
             **************************************/
            $airtime_billing_action = $this->event['event_data']['airtime_billing_action'];

            /***************************************
             * Set Msisdn (Account to be billed)   *
             **************************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['msisdn']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $msisdn = $outputResponse;

            if(empty($msisdn)) $this->logWarning('The msisdn must be provided to bill subscriber using Airtime');

            /***************************
             * Set Amount              *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['amount']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            if( is_string($outputResponse) ){

                //  Capture the "one" or "many" amounts
                $amounts = collect( explode("|", $outputResponse) )->map(function($amount){

                    //  Convert to money format (Convert to float with 2 decimal places)
                    return $this->convertToMoneyFormatFromAmount($amount);

                })->toArray();

            }elseif( is_array($outputResponse) ){

                //  Capture the "one" or "many" amounts from the response Array
                $amounts = collect( $outputResponse )->map(function($amount){

                    //  Convert to money format (Convert to float with 2 decimal places)
                    return $this->convertToMoneyFormatFromAmount($amount);

                })->toArray();

            }else{

                $amounts = [];

            }

            $validAmounts = collect($amounts)->filter(function($amount){

                if( empty($amount) ){

                    if(empty($amount)) $this->logWarning('The Airtime Billing amount must be provided to bill subscriber');

                }elseif( $amount <= 0 ){

                    $this->logWarning('The Airtime Billing amount provided must be greater than 0');

                }else{

                    //  Return false for invalid amount
                    return true;

                }

                //  Return false for invalid amount
                return false;

            })->toArray();

            $hasValidAmounts = collect($validAmounts)->count() > 0;
            $hasAllValidAmounts = collect($validAmounts)->count() == collect($amounts)->count();

            if( $hasValidAmounts == false ){

                $this->logWarning('The Airtime Billing amount must be provided to bill subscriber using Airtime');

            }

            if( $hasAllValidAmounts == false ){

                $this->logWarning('Some of the Airtime Billing amounts provided where rejected for use in billing the subscriber');

            }

            /***************************
             * Set Currency            *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['currency']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $currency = $outputResponse;

            if(empty($currency)) $this->logWarning('The currency must be provided to bill subscriber using Airtime');

            /***************************
             * Set Description         *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['description']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $description = $outputResponse;

            if(empty($description)) $this->logWarning('The description must be provided to bill subscriber using Airtime');

            /**
             *  Set the OPTIONAL fields
             */

            /***************************
             * Set Product ID          *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['product_id']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $product_id = $outputResponse;

            /***************************
             * Set Service ID          *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['service_id']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $service_id = $outputResponse;

            /***************************
             * Set On Behalf Of        *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['on_behalf_of']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $on_behalf_of = $outputResponse;

            /*************************************
             * Set Purchase Category Code        *
             ************************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['purchase_category_code']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $purchase_category_code = $outputResponse;

            /***************************************************
             * Set The Airtime Billing Request Response Name   *
             **************************************************/
            $response_reference_name = $this->event['event_data']['response_reference_name'];

            if( !empty($msisdn) ){

                /**
                 *  Get the Airtime Billing access token
                 */
                $apiCallResponse = $this->getAirtimeBillingAccessToken($msisdn);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($apiCallResponse)) {

                    $this->logWarning('The Airtime Billing access bearer token could not be generated to bill the subscriber');

                    return $apiCallResponse;
                }

                $access_token = $apiCallResponse;

                if( !empty($access_token) ){

                    if( $airtime_billing_action == 'deduct_fee' ){

                        if( $hasValidAmounts  ){

                            return $this->billUsingAirtime(

                                //  Required fields
                                $msisdn, $amounts, $currency, $description,

                                //  Optional fields
                                $product_id, $service_id, $on_behalf_of, $purchase_category_code, $response_reference_name,

                                //  Access token
                                $access_token

                            );

                        }

                    }elseif( $airtime_billing_action == 'get_product_inventory_data' ){

                        if( !empty($response_reference_name) ){

                            /*************************************
                             * Get Product Inventory Data        *
                             *************************************/

                            /**
                             *  Get the product inventory data. The response will return "null"
                             *  or the usage consumption data payload.
                             */
                            $apiCallResponse = $this->requestAirtimeBillingProductInventory($msisdn, $access_token);

                            //  If we have a screen to show return the response otherwise continue
                            if ($this->shouldDisplayScreen($apiCallResponse)) {
                                return $apiCallResponse;
                            }

                            //  If the response is null then return nothing
                            if( $apiCallResponse == null ){

                                $this->logWarning('Could not get the product inventory data via API Request');

                                return $apiCallResponse;

                            }

                            /**
                             *  This returns an Array, only get the first item
                             */
                            $product_inventory = $apiCallResponse[0];

                            //  Store the value data using the given item reference name
                            $this->setProperty($response_reference_name, $product_inventory);

                            //  Stop here
                            return;

                        }else{

                            $this->logWarning('Could not get the product inventory data because the request response name is not set');

                        }

                    }elseif( $airtime_billing_action == 'get_usage_consumption_data' ){

                        if( !empty($response_reference_name) ){

                            /*************************************
                             * Get Usage Consumption Data        *
                             *************************************/

                            /**
                             *  Get the usage consumption data. The response will return "null"
                             *  or the usage consumption data payload.
                             */
                            $apiCallResponse = $this->requestAirtimeBillingUsageConsumption($msisdn, $access_token);

                            //  If we have a screen to show return the response otherwise continue
                            if ($this->shouldDisplayScreen($apiCallResponse)) {
                                return $apiCallResponse;
                            }

                            //  If the response is null then return nothing
                            if( $apiCallResponse == null ){

                                $this->logWarning('Could not get the usage consumption data via API Request');

                                return $apiCallResponse;

                            }

                            $usage_consumption = $apiCallResponse;

                            //  Store the value data using the given item reference name
                            $this->setProperty($response_reference_name, $usage_consumption);

                            //  Stop here
                            return;

                        }else{

                            $this->logWarning('Could not get the usage consumption data because the request response name is not set');

                        }

                    }

                }else{

                    $this->logWarning('The Airtime Billing access bearer token could not be generated to bill the subscriber');

                }

            }else{

                $this->logWarning('The Msisdn value is required to bill the subscriber using Airtime Billing');

            }

        }
    }

    public function convertToMoneyFormatFromAmount($value)
    {
        //  Convert the value to a trimmed string
        $valueToString = trim( $this->convertToString($value) );

        $this->logInfo('Converting '.$this->wrapAsSuccessHtml($valueToString).' to money format');

        /**
         *  Only extract numbers and dot e.g
         *  "3. 00" to "3.00"
         *  "a3.00" to "3.00"
         *  "a3.0a0s" to "3.00"
         */
        $string = preg_replace('/[^0-9\.]+/', '', $valueToString);

        //  Check if the value can convert to a valid float or integer number
        if( is_float((float) $string) || is_integer((float) $string) ){

            //  Check if the value can convert to a valid float number
            if( is_float((float) $string) ){

                $money_format = (float) $string;

            //  Check if the value can convert to a valid integer number
            }elseif( is_integer((int) $string) ){

                $money_format = (int) $string;

            }

            //  Make sure to convert to a float with strictly 2 decimal places
            $money_format = number_format($money_format, 2);

            $this->logInfo('The value '.$this->wrapAsSuccessHtml($valueToString).' was converted to '.$this->wrapAsSuccessHtml($money_format).' as money format');

            return $money_format;

        //  If we fail to convert to any of the above formats
        }else{

            $money_format = '0.00';

            $this->logWarning('The value '.$this->wrapAsSuccessHtml($valueToString).' could not be converted to money format because it is an invalid amount. Returning '.$this->wrapAsSuccessHtml($money_format).' as a replacement value');

            return $money_format;

        }

    }

    public function getAirtimeBillingAccessToken($msisdn)
    {
        $this->logInfo('Attempt to get the Airtime Billing access bearer token');

        //  Get subscriber airtime billing access token matching the given MSISDN
        $access_token_from_db = DB::table('airtime_billing_tokens')->where('msisdn', $msisdn)->first();

        //  Make sure the airtime billing access token is set and not expired
        if( empty($access_token_from_db) || empty($access_token_from_db->access_token) ||
            empty($access_token_from_db->expiry_date) || \Carbon\Carbon::parse($access_token_from_db->expiry_date)->isPast()){

            /**
             *  Create a new token. The response will return "null"
             *  on a failed request or the following structure:
             *
             *  [
             *      'access_token' => "11e17a32-bc6c-37e2-8df1-e26df6551b7f"
             *      'expires_in' => 2600       //  Time to expiry in seconds
             *  ]
             */
            $apiCallResponse = $this->requestNewAirtimeBillingAccessToken();

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($apiCallResponse)) {
                return $apiCallResponse;
            }

            //  If the response is null then return nothing
            if( $apiCallResponse == null ){

                $this->logWarning('Could not generate a new access token via API Request');

                return $apiCallResponse;

            }

            //  Capture access token
            $access_token = $apiCallResponse['access_token'];

            //  Capture expiry date and convert to carbon datetime
            $expires_in = now()->addSeconds($apiCallResponse['expires_in']);

            //  Save the airtime billing access token on a new access token from the database
            if( empty($access_token_from_db) == true && isset($access_token) && isset($expires_in) ){

                $this->logInfo('Generated a new Airtime Billing access token, saving to database against a new record');

            }

            //  Save the airtime billing access token on the already existing access token from the database
            if( empty($access_token_from_db) == false && isset($access_token) && isset($expires_in) ){

                $this->logInfo('Generated a new Airtime Billing access token, saving to database against an existing record');

            }

            DB::table('airtime_billing_tokens')->updateOrInsert(
                //  Conditions to find the record to update (If it exists)
                [
                    'msisdn' => $msisdn
                ],
                //  Columns to update
                [
                    'access_token' => $access_token,
                    'expiry_date' => $expires_in,
                ]
            );

        }else{

            //  Capture access token valid token store in the database
            $access_token = $access_token_from_db->access_token;

        }

        return $access_token;
    }

    public function billUsingAirtime($msisdn, $amounts, $currency, $description, $product_id = null, $service_id = null, $on_behalf_of = null, $purchase_category_code = null, $response_reference_name = null, $access_token = null)
    {
        if( !empty($msisdn) && !empty($amounts) && !empty($currency) && !empty($description) && !empty($access_token) ){

            //  Assume we don't have enough funds
            $has_enough_funds = false;

            //  Typically we set the first amount as the amount to bill unless the airtime is not enough on Prepaid
            $amount_to_bill = $amounts[0];

            /*********************************************
             * Set Do Not Charge On Insufficient Funds   *
             ********************************************/
            $cancel_on_insufficient_funds = $this->event['event_data']['cancel_on_insufficient_funds'];

            /*************************************
             * Get Product Inventory Data        *
             *************************************/

            /**
             *  Get the product inventory data. The response will return "null"
             *  or the usage consumption data payload.
             */
            $apiCallResponse = $this->requestAirtimeBillingProductInventory($msisdn, $access_token);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($apiCallResponse)) {
                return $apiCallResponse;
            }

            //  If the response is null then return nothing
            if( $apiCallResponse == null ){

                $this->logWarning('Could not get the product inventory data via API Request');

                return $apiCallResponse;

            }

            /**
             *  This returns an Array, only get the first item
             */
            $product_inventory = $apiCallResponse[0];

            /*************************************
             * Get Usage Consumption Data        *
             *************************************/

            /**
             *  Get the usage consumption data. The response will return "null"
             *  or the usage consumption data payload.
             */
            $apiCallResponse = $this->requestAirtimeBillingUsageConsumption($msisdn, $access_token);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($apiCallResponse)) {
                return $apiCallResponse;
            }

            //  If the response is null then return nothing
            if( $apiCallResponse == null ){

                $this->logWarning('Could not get the usage consumption data via API Request');

                return $apiCallResponse;

            }

            $usage_consumption = $apiCallResponse;

            //  If the account status is not "Active"
            if( $product_inventory['status'] != 'Active'){

                $this->logWarning('The mobile number '.$this->wrapAsSuccessHtml($msisdn).' can\'t be billed because the number is not active');

                //  Stop
                return;
            }

            //  If the account rating type is "Prepaid"
            if( $product_inventory['ratingType'] == 'Prepaid'){

                //  Indicate that we need to check the account balance
                $check_account_balance = true;

            }else{

                //  Indicate that we do not need to check the account balance
                $check_account_balance = false;

            }

            $this->logInfo('The mobile number '.$this->wrapAsSuccessHtml($msisdn).' is billed on a '.$this->wrapAsSuccessHtml($product_inventory['ratingType']).' account');

            //  If we are billing a Prepaid account and must check the account balance
            if( $check_account_balance ){

                //  Get the bucket with the id of "OCS-0" as it holds information about the "Main Balance"
                $account_main_balance_bucket = collect($usage_consumption['bucket'])->firstWhere('id', 'OCS-0');

                if( $account_main_balance_bucket ){

                    //  Get the bucket balance
                    $bucket_balance_array = $account_main_balance_bucket['bucketBalance'];

                    //  Get the remaining value (The Airtime left that we can bill from the bucket balance)
                    $remainingValue = collect($bucket_balance_array)->sum('remainingValue');

                    $this->logInfo('The mobile number '.$this->wrapAsSuccessHtml($msisdn).' has a remaining balance of '.$this->wrapAsSuccessHtml($this->convertToString($remainingValue)));

                    if( $remainingValue > 0){

                        //  Foreach amount, check if the amount is less that the remaining airtime
                        foreach($amounts as $amount){

                            //  If the amount is sufficient
                            if($remainingValue >= $amount){

                                $this->logInfo('The amount of '.$this->wrapAsSuccessHtml($amount).' will be billed since its equal to or less than the remaining Airtime balance of '.$this->wrapAsSuccessHtml($this->convertToString($remainingValue)));

                                //  Set as the amount to Bill
                                $amount_to_bill = $amount;

                                //  Update that we do have enough funds
                                $has_enough_funds = true;

                                //  Stop the loop
                                break;

                            }else{

                                $this->logInfo('The amount of '.$this->wrapAsSuccessHtml($amount).' cannot be billed since its greater than the remaining Airtime balance of '.$this->wrapAsSuccessHtml($this->convertToString($remainingValue)));

                            }

                        }

                    }else{

                    }

                    if($has_enough_funds == false){

                        $this->logWarning('The mobile number '.$this->wrapAsSuccessHtml($msisdn).' does not have enough funds to pay for this transaction. The transaction requires an amount of '.$this->wrapAsSuccessHtml($this->convertToString($amount_to_bill)).' to be paid but the current balance is '.$this->wrapAsSuccessHtml($this->convertToMoneyFormatFromAmount($remainingValue)));

                        //  If we should stop this transaction due to insufficient funds
                        if( $cancel_on_insufficient_funds == true ) {

                            /************************************
                             * Set Insufficient funds message   *
                             ************************************/
                            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['insufficient_funds_message']);

                            //  If we have a screen to show return the response otherwise continue
                            if ($this->shouldDisplayScreen($outputResponse)) {
                                return $outputResponse;
                            }

                            $insufficient_funds_message = !empty($outputResponse) ? $outputResponse : 'You do not have enough funds to complete this payment';

                            //  Return insufficient funds screen (The showEndScreen will terminate the session)
                            return $this->showEndScreen($insufficient_funds_message);

                        }

                    }

                }else{

                    $this->logWarning('The mobile number '.$this->wrapAsSuccessHtml($msisdn).' does not have the Main Balance bucket required to check for funds');

                    return null;

                }

            }

            $airtime_billing_payment_payload = [
                'created_at' => now(),
                'updated_at' => now(),
                'app_id' => $this->app->id,
                'version_id' => $this->version->id,
                'project_id' => $this->app->project_id,
                'ussd_session_id' => $this->session_id,
                'ussd_account_id' => $this->ussd_account->id,

                'msisdn_to_bill' => $msisdn,
                'amount_to_bill' => $amount_to_bill,
                'is_prepaid_account' => $check_account_balance,
                'has_enough_funds' => $has_enough_funds,
                'funds_before_deduction' => $check_account_balance ? $remainingValue : null,                    //  NULL indicates unlimited funds (Postpaid Account)
                'funds_after_deduction' => $check_account_balance ? $remainingValue - $amount_to_bill : null,   //  NULL indicates unlimited funds (Postpaid Account)

                'currency' => $currency,
                'product_id' => $product_id,
                'service_id' => $service_id,
                'description' => $description,
                'on_behalf_of' => $on_behalf_of,
                'purchase_category_code' => $purchase_category_code,
                'response_reference_name' => $response_reference_name,
            ];

            /**
             *  If we don't need to check the account balance or we
             *  have enough funds then continue to bill the customer
             */
            if( $check_account_balance == false || $has_enough_funds == true ){

                /*************************************
                 * Attempt To Bill Account           *
                 *************************************/

                $this->logInfo('Attempt to bill the mobile number '.$this->wrapAsSuccessHtml($msisdn).', since we have sufficient funds for this transaction');

                /**
                 *  Attempt to bill the msisdn. The response will return "null"
                 *  or the airtime billing data payload.
                 */
                $apiCallResponse = $this->requestAirtimeBillingDeductFee($msisdn, $amount_to_bill, $currency, $description, $product_id, $service_id, $on_behalf_of, $purchase_category_code, $access_token);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($apiCallResponse)) {

                    $this->logWarning('Failed to bill the subscriber on their mobile number '.$this->wrapAsSuccessHtml($msisdn));

                    return $apiCallResponse;

                }

                //  Capture the payment response as successful / failed
                $airtime_billing_payment_payload['success_status'] = $apiCallResponse !== null;
                DB::table('airtime_billing_payments')->insert($airtime_billing_payment_payload);

                //  If the response is null then return nothing
                if( $apiCallResponse == null ){

                    $this->logWarning('Failed to bill the subscriber on their mobile number '.$this->wrapAsSuccessHtml($msisdn));

                    return $apiCallResponse;

                }

                $billing_response = $apiCallResponse;

                if( !empty($response_reference_name) ){

                    //  Store the billing response data as dynamic data
                    $this->setProperty($response_reference_name, $billing_response);

                }

                /**
                 *  Determine Next Step After Payment
                 */

                /*************************************
                 * Show Successful Payment Message   *
                 ************************************/
                $show_successful_payment_message = $this->event['event_data']['show_successful_payment_message'];    //  yes_then_terminate, yes_then_do_not_terminate, no_then_terminate, no_then_do_not_terminate

                //  If we must show a success message
                if( in_array($show_successful_payment_message, ['yes_then_terminate', 'yes_then_do_not_terminate']) ){

                    $this->logInfo('Show the payment success message');

                    /********************************
                     * Successful Payment Message   *
                     *******************************/
                    $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['successful_payment_message']);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    $successful_payment_message = !empty($outputResponse) ? $outputResponse : 'Payment successful. Thank you';

                    //  Create the notification message using the error message
                    $this->create_notification_message($successful_payment_message);

                }

                //  If we must terminate the session
                if( in_array($show_successful_payment_message, ['yes_then_terminate', 'no_then_terminate']) ){

                    //  Set the request type to terminate the session
                    $this->terminate_session();

                }

            }else{

                //  Capture the payment response as failed
                $airtime_billing_payment_payload['success_status'] = false;
                DB::table('airtime_billing_payments')->insert($airtime_billing_payment_payload);

            }

        }else{

            if( empty($msisdn) ){

                $this->logWarning('Could not bill subscriber using Airtime Billing because the '.$this->wrapAsSuccessHtml('Msisdn').' value is not provided');

            }elseif( empty($amount) || $amount <= 0 ){

                $this->logWarning('Could not bill subscriber using Airtime Billing because the '.$this->wrapAsSuccessHtml('Amount').' value is not provided or is equal to or less than 0');

            }elseif( empty($currency) ){

                $this->logWarning('Could not bill subscriber using Airtime Billing because the '.$this->wrapAsSuccessHtml('Currency').' value is not provided');

            }elseif( empty($description) ){

                $this->logWarning('Could not bill subscriber using Airtime Billing because the '.$this->wrapAsSuccessHtml('Description').' value is not provided');

            }elseif( empty($access_token) ){

                $this->logWarning('Could not bill subscriber using Airtime Billing because the '.$this->wrapAsSuccessHtml('Access Token').' value is not provided');

            }

        }

    }

    /**
     *  This method requests a new airtime billing access token
     */
    public function requestNewAirtimeBillingAccessToken()
    {
        /***************************
         * Set Client ID            *
         **************************/
        $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['airtime_billing_connection']['client_id']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        $client_id = $outputResponse;

        if(empty($client_id)) $this->logWarning('The Airtime Billing Client ID must be provided (Provide your Airtime Billing client id)');

        /***************************
         * Set Client Secret       *
         **************************/
        $outputResponse = $this->convertValueStructureIntoDynamicData($this->version->builder['airtime_billing_connection']['client_secret']);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        $client_secret = $outputResponse;

        if(empty($client_secret)) $this->logWarning('The Airtime Billing Client Secret must be provided (Provide your Airtime Billing client Secret)');

        if( !empty($client_id) && !empty($client_secret) ){

            $url = 'https://aas-bw.api.intraorange:443/token';
            $method = 'post';

            $form_params = [
                "grant_type" => "client_credentials",
                "client_id" => trim($client_id),
                "client_secret" => trim($client_secret),
            ];

            $headers = [
                'Content-type' => 'application/x-www-form-urlencoded',
                'Accept' => 'application/json'
            ];

            $request_options = [
                'headers' => $headers,
                'form_params' => $form_params,
            ];

            /** Run the REST API Call. This will render as: $this->get_REST_Api_URL()
             *  while being called within a try/catch handler. We will also pass the
             *  request options.
             */
            $apiCallResponse = $this->tryCatch('run_REST_Api_Call', [ $method, $url, $request_options ]);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($apiCallResponse)) {
                return $apiCallResponse;
            }

            //  Get the response status code e.g "200"
            $status_code = $apiCallResponse->getStatusCode();

            //  Get the response status phrase e.g "OK"
            $status_phrase = $apiCallResponse->getReasonPhrase() ?? '';

            //  Get the response body and convert the JSON Object to an Array e.g [ "access_token" => ..., "expires_in" => ... ]
            $response_body = $this->convertObjectToArray(json_decode($apiCallResponse->getBody()));

            //  Check if this is a good status code e.g "100", "200", "301" e.t.c
            if ($this->checkIfGoodStatusCode($status_code)) {

                //  Set an info log of the response status code received
                $this->logInfo('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') Status text: '.$this->wrapAsSuccessHtml($status_phrase));

                //  Since this is a successful response, check if we have the access token
                if( isset($response_body['access_token']) && !empty($response_body['access_token']) ){

                    //  Return the access token and expiry time
                    return [
                        'access_token' => $response_body['access_token'],   //  Access token e.g "11e17a32-bc6c-37e2-8df1-e26df6551b7f"
                        'expires_in' => $response_body['expires_in'],       //  Expiry time in seconds e.g 2600
                    ];

                }else{

                    //  Set a warning log for no access token found
                    $this->logWarning('Airtime billing ('.$this->wrapAsSuccessHtml('access token').') was not found in the response payload');

                }

            //  If this is a bad status code e.g "400", "401", "500" e.t.c
            } else {

                //  Set an info log of the response status code received
                $this->logWarning('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') <br/> Status text: '.$this->wrapAsSuccessHtml($status_phrase));

                //  Check if the payload contains the error message from the server
                if( isset($response_body['requestError']) && !empty($response_body['requestError']) ){

                    if( isset($response_body['requestError']['serviceException']) && !empty($response_body['requestError']['serviceException']) ){


                        if( isset($response_body['requestError']['serviceException']['messageId']) && !empty($response_body['requestError']['serviceException']['messageId']) ){

                            //  Set an warning log
                            $this->logWarning('Airtime Billing Request Error Message ID: '.$this->wrapAsWarningHtml( $response_body['requestError']['serviceException']['messageId'] ));

                        }

                        if( isset($response_body['requestError']['serviceException']['text']) && !empty($response_body['requestError']['serviceException']['text']) ){

                            //  Set an warning log
                            $this->logWarning('Airtime Billing Request Error Message Text: '.$this->wrapAsWarningHtml( $response_body['requestError']['serviceException']['text'] ));

                        }

                        if( isset($response_body['requestError']['serviceException']['variables']) && !empty($response_body['requestError']['serviceException']['variables']) ){

                            //  Set an warning log
                            $this->logWarning('Airtime Billing Request Error Variables: '.$this->wrapAsWarningHtml( $response_body['requestError']['serviceException']['variables'][0] ));

                        }
                    }

                }
            }

        }else{

            $this->logWarning('Airtime Billing access token could not be generated due to missing values (Missing account client id or client secret)');

        }

        //  Return null (If we do not have an Access Token generated)
        return null;
    }

    /**
     *  This method requests a airtime billing account information,
     *  whether the account is Active and whether the account is
     *  Prepaid or Postpaid
     */
    public function requestAirtimeBillingProductInventory($msisdn, $access_token)
    {
        $url = 'https://aas-bw.api.intraorange:443/customer/productInventory/v1/product?publicKey='
                .$msisdn;

        $method = 'get';

        $headers = [
            'Authorization' => 'Bearer '.$access_token,
            'Content-type' => 'application/json',
            'Accept' => 'application/json',
        ];

        $request_options = [
            'headers' => $headers
        ];

        /** Run the REST API Call. This will render as: $this->get_REST_Api_URL()
         *  while being called within a try/catch handler. We will also pass the
         *  request options.
         */
        $apiCallResponse = $this->tryCatch('run_REST_Api_Call', [ $method, $url, $request_options ]);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($apiCallResponse)) {
            return $apiCallResponse;
        }

        //  Get the response status code e.g "200"
        $status_code = $apiCallResponse->getStatusCode();

        //  Get the response status phrase e.g "OK"
        $status_phrase = $apiCallResponse->getReasonPhrase() ?? '';

        //  Get the response body and convert the JSON Object to an Array e.g [ "access_token" => ..., "expires_in" => ... ]
        $response_body = $this->convertObjectToArray(json_decode($apiCallResponse->getBody()));

        //  Check if this is a good status code e.g "100", "200", "301" e.t.c
        if ($this->checkIfGoodStatusCode($status_code)) {

            //  Set an info log of the response status code received
            $this->logInfo('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') Status text: '.$this->wrapAsSuccessHtml($status_phrase));

            //  Since this is a successful response, check if we have the response payload
            if( !empty($response_body) ){

                /**
                 *  Return the reponse body, the structure is as follows:
                 *
                 *   [
                 *       {
                 *           "id": "19770df5-ad72-415a-8c5f-1a717f1ba981",
                 *           "ratingType": "Prepaid",
                 *           "status": "Active",
                 *           "isBundle": true,
                 *           "startDate": "2019-10-03T00:00:00+0000",
                 *           "terminationDate": "2023-01-06T00:00:00+0000",
                 *           "productOffering": {
                 *               "id": "2",
                 *               "name": "2"
                 *            }
                 *       }
                 *   ]
                 */
                return $response_body;

            }else{

                //  Set a warning log for no access token found
                $this->logWarning('Airtime billing ('.$this->wrapAsSuccessHtml('product inventory data').') was not found in the response payload');

            }

        //  If this is a bad status code e.g "400", "401", "500" e.t.c
        } else {

            //  Set an info log of the response status code received
            $this->logWarning('API response returned a status ('.$this->wrapAsWarningHtml($status_code).') <br/> Status text: '.$this->wrapAsSuccessHtml($status_phrase));

        }

        //  Return null (If we do not have an Access Token generated)
        return null;
    }

    /**
     *  This method requests a airtime billing usage consumption data.
     *  Helps us learn how much does the msisdn account have that can
     *  be consumed e.g Return information about the airtime balance,
     *  sms and mobile data left that can be consumed.
     */
    public function requestAirtimeBillingUsageConsumption($msisdn, $access_token)
    {
        $url = 'https://aas-bw.api.intraorange:443/customer/usageConsumption/v1/usageConsumptionReport?publicKey='
                .$msisdn;

        $method = 'get';

        $headers = [
            'Authorization' => 'Bearer '.$access_token,
            'Content-type' => 'application/json',
            'Accept' => 'application/json',
        ];

        $request_options = [
            'headers' => $headers
        ];

        /** Run the REST API Call. This will render as: $this->get_REST_Api_URL()
         *  while being called within a try/catch handler. We will also pass the
         *  request options.
         */
        $apiCallResponse = $this->tryCatch('run_REST_Api_Call', [ $method, $url, $request_options ]);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($apiCallResponse)) {
            return $apiCallResponse;
        }

        //  Get the response status code e.g "200"
        $status_code = $apiCallResponse->getStatusCode();

        //  Get the response status phrase e.g "OK"
        $status_phrase = $apiCallResponse->getReasonPhrase() ?? '';

        //  Get the response body and convert the JSON Object to an Array e.g [ "access_token" => ..., "expires_in" => ... ]
        $response_body = $this->convertObjectToArray(json_decode($apiCallResponse->getBody()));

        //  Check if this is a good status code e.g "100", "200", "301" e.t.c
        if ($this->checkIfGoodStatusCode($status_code)) {

            //  Set an info log of the response status code received
            $this->logInfo('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') Status text: '.$this->wrapAsSuccessHtml($status_phrase));

            //  Since this is a successful response, check if we have the response payload
            if( !empty($response_body) ){

                /**
                 *  Return the reponse body, the structure is as follows:
                 *
                 *  {
                 *      "id": "2b778311-ab1b-4f9b-bdb7-e8f3632a6ca9",
                 *      "effectiveDate": "2022-01-21T13:24:33+0000",
                 *      "bucket": [
                 *          {
                 *              "id": "OCS-0",
                 *              "name": "Main Balance",
                 *              "usageType": "accountBalance",
                 *              "bucketBalance": [
                 *                  {
                 *                      "unit": "BWP",
                 *                      "remainingValue": 0,
                 *                      "validFor": {
                 *                           "startDateTime": "2019-04-04T00:00:00+0000",
                 *                           "endDateTime": "2023-01-06T00:00:00+0000"
                 *                       }
                 *                   }
                 *                ]
                 *              },
                 *          {
                 *              "id": "OCS-2",
                 *              "name": "On-Net",
                 *              "usageType": "accountBalance",
                 *              "bucketBalance": [
                 *                  {
                 *                      "unit": "BWP",
                 *                      "remainingValue": 0,
                 *                      "validFor": {
                 *                           "startDateTime": "2022-01-02T12:54:34+0000",
                 *                           "endDateTime": "2022-01-20T17:51:06+0000"
                 *                          }
                 *                      }
                 *                  ]
                 *              },
                 *              {
                 *              "id": "OCS-5",
                 *              "name": "National SMS",
                 *              "usageType": "sms",
                 *              "bucketBalance": [
                 *                  {
                 *                      "unit": "SMS",
                 *                      "remainingValue": 11,
                 *                      "validFor": {
                 *                           "startDateTime": "2019-04-07T00:00:00+0000",
                 *                           "endDateTime": "2032-01-04T00:00:00+0000"
                 *                          }
                 *                      }
                 *                  ]
                 *              },
                 *       ]
                 *  }
                 */
                return $response_body;

            }else{

                //  Set a warning log for no access token found
                $this->logWarning('Airtime billing ('.$this->wrapAsSuccessHtml('consumption usage data').') was not found in the response payload');

            }

        //  If this is a bad status code e.g "400", "401", "500" e.t.c
        } else {

            //  Set an info log of the response status code received
            $this->logWarning('API response returned a status ('.$this->wrapAsWarningHtml($status_code).') <br/> Status text: '.$this->wrapAsSuccessHtml($status_phrase));

        }

        //  Return null (If we do not have an Access Token generated)
        return null;
    }

    /**
     *  This method performs a request to bill the subscriber
     *  on the given amount
     */
    public function requestAirtimeBillingDeductFee($msisdn, $amount, $currency, $description, $product_id, $service_id, $on_behalf_of, $purchase_category_code, $access_token)
    {
        $url = 'https://aas-bw.api.intraorange:443/payment/v1/tel%3A%2B'.$msisdn.'/transactions/amount';

        $method = 'post';

        $headers = [
            'Authorization' => 'Bearer '.$access_token,
            'Content-type' => 'application/json',
            'Accept' => 'application/json',
        ];

        $form_data = [
            'amountTransaction' => [
                'endUserId' => 'tel:+'.$msisdn,
                'paymentAmount' => [
                'chargingInformation' => [
                    'amount' => (float) $amount,
                    'currency' => $currency,
                    'description' => [
                    0 => $description,
                    ],
                ],
                'chargingMetaData' => [
                    'productId' => (isset($product_id) && !empty($product_id)) ? $product_id : null,
                    'serviceId' => (isset($service_id) && !empty($service_id)) ? $service_id : null,
                    'purchaseCategoryCode' => (isset($purchase_category_code) && !empty($purchase_category_code)) ? $purchase_category_code : null,
                ],
                ],
                'clientCorrelator' => $this->session_id.'-'.now(),  //	'unique-technical-id',
                'referenceCode' => 'referenceCode-'.now(),          //	'Service_provider_payment_reference',
                'transactionOperationStatus' => 'Charged',
            ],
            ];

        $request_options = [
            'headers' => $headers,
            'json' => $form_data,
        ];

        /** Run the REST API Call. This will render as: $this->get_REST_Api_URL()
         *  while being called within a try/catch handler. We will also pass the
         *  request options.
         */
        $apiCallResponse = $this->tryCatch('run_REST_Api_Call', [ $method, $url, $request_options ]);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($apiCallResponse)) {
            return $apiCallResponse;
        }

        //  Get the response status code e.g "200"
        $status_code = $apiCallResponse->getStatusCode();

        //  Get the response status phrase e.g "OK"
        $status_phrase = $apiCallResponse->getReasonPhrase() ?? '';

        //  Get the response body and convert the JSON Object to an Array e.g [ "access_token" => ..., "expires_in" => ... ]
        $response_body = $this->convertObjectToArray(json_decode($apiCallResponse->getBody()));

        //  Check if this is a good status code e.g "100", "200", "301" e.t.c
        if ($this->checkIfGoodStatusCode($status_code)) {

            //  Set an info log of the response status code received
            $this->logInfo('API response returned a status ('.$this->wrapAsSuccessHtml($status_code).') Status text: '.$this->wrapAsSuccessHtml($status_phrase));

            //  Since this is a successful response, return response payload
            return $response_body;

        //  If this is a bad status code e.g "400", "401", "500" e.t.c
        } else {

            //  Set an info log of the response status code received
            $this->logWarning('API response returned a status ('.$this->wrapAsWarningHtml($status_code).') <br/> Status text: '.$this->wrapAsSuccessHtml($status_phrase));

        }

        //  Return null (If we do not have an Access Token generated)
        return null;
    }

    /** This method terminates the current session and triggers the
     *  Orange Money Push Payments API
     */
    public function handle_Orange_Money_API_Event()
    {
        if ($this->event) {

            /***************************
             * Set MSISDN              *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['msisdn']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $msisdn = $outputResponse;

            if(empty($msisdn)) $this->logWarning('The Orange Money msisdn value is not provided');

            /***************************
             * Set Amount              *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['amount']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Convert to money format (Convert to float with 2 decimal places)
            $amount = $this->convertToMoneyFormatFromAmount($outputResponse);

            if(empty($amount)) $this->logWarning('The Orange Money amount must be provided to bill subscriber using Airtime');

            if($amount <= 0) $this->logWarning('The Orange Money amount must not be less than 0');

            /***************************
             * Set Payment Reference   *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['payment_reference']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $payment_reference = $outputResponse;

            if(empty($payment_reference)) $this->logWarning('The Orange Money payment reference value is not provided');

            /***************************
             * Set Merchant Code       *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['merchant_code']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $merchant_code = $outputResponse;

            if(empty($merchant_code)) $this->logWarning('The Orange Money merchant code value is not provided');

            /***************************
             * Set Endpoint            *
             **************************/
            $outputResponse = $this->convertValueStructureIntoDynamicData($this->event['event_data']['endpoint']);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $endpoint = $outputResponse;

            if(empty($endpoint)) $this->logWarning('The Orange Money endpoint value is not provided');

            //  If the API values are provided
            if( !empty($msisdn) && !empty($amount) && ($amount > 0) && !empty($payment_reference) && !empty($merchant_code) && !empty($endpoint) ){

                //  Set the event request type to terminate the session
                $this->terminate_session();

                $this->logInfo('Terminated session to perform Orange Money payment request');

                $url = 'http://192.168.22.87/STK/test/stkpush.php';
                $method = 'post';

                $query_params = [
                    'method' => 'pushPayment'
                ];

                $form_data = [
                    'msisdn' => $msisdn,
                    'amount' => $amount,
                    'payerRef' => $payment_reference,
                    'merchantCode' => $merchant_code,
                ];

                $request_options = [
                    'query' => $query_params,
                    'json' => $form_data,
                ];

                /**
                 *  Use the dispatch method provides a closure that allows us to execute a function.
                 *  We can chain the afterResponse method onto the dispatch helper to execute the
                 *  code within the closure after the HTTP response has been sent to the browser.
                 *  This will allow us to call the Orange Money Push Payments api only after
                 *  we have returned a response. This will prevent the Orange Money USSD
                 *  pop-up showing up while the user in on the current session which
                 *  must be terminated first. By returning a response we are able
                 *  to terminate the session before running a new session
                 */
                dispatch(function () use ($method, $url, $request_options) {

                    info('Perform Orange Money payment request after session has been terminated');
                    info('dispatch run_REST_Api_Call() '.$url);

                    try {

                        $this->tryCatch('run_REST_Api_Call', [ $method, $url, $request_options ]);

                    } catch (\Throwable $e) {

                        info($e);

                    } catch (\Exception $e) {

                        info($e);

                    }

                })->afterResponse();

            }else{

                $this->logWarning('Orange Money API stopped due to missing values');

            }

        }
    }

    /******************************************
     *  VALIDATION EVENT METHODS              *
     *****************************************/

    /** This method gets all the validation rules of the current display. We then use these
     *  validation rules to validate the target input.
     */
    public function handle_Validation_Event()
    {
        if ($this->event) {
            //  Get the validation rules
            $validation_rules = $this->event['event_data']['rules'] ?? [];

            //  Get the target input
            $target_value = $this->event['event_data']['target'];

            /*************************
             * BUILD TARGET VALUE    *
             ************************/

            //  Convert the "target value" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($target_value);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $target_value = $outputResponse;

            //  Validate the target input
            $failedValidationResponse = $this->handleValidationRules($target_value, $validation_rules);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($failedValidationResponse)) {
                return $failedValidationResponse;
            }
        }
    }

    /** This method checks if the given validation rules are active (If they must be used).
     *  If the validation rule must be used then we determine which rule we are given and which
     *  validation method must be used for each given case.
     */
    public function handleValidationRules($target_value, $validation_rules = [])
    {
        //  If we have validation rules
        if (!empty($validation_rules)) {
            //  For each validation rule
            foreach ($validation_rules as $validation_rule) {
                //  Get the active state value
                $activeState = $this->processActiveState($validation_rule['active']);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($activeState)) {
                    return $activeState;
                }

                //  If the current validation rule is active (Must be used)
                if ($activeState === true) {
                    //  Get the type of validation rule e.g "only_letters" or "only_numbers"
                    $validationType = $validation_rule['type'];

                    //  Use the switch statement to determine which validation method to use
                    switch ($validationType) {
                        case 'only_letters':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateOnlyLetters'); break;

                        case 'only_numbers':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateOnlyNumbers'); break;

                        case 'only_letters_and_numbers':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateOnlyLettersAndNumbers'); break;

                        case 'minimum_characters':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateMinimumCharacters'); break;

                        case 'maximum_characters':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateMaximumCharacters'); break;

                        case 'equal_to_characters':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateEqualToCharacters'); break;

                        case 'validate_email':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateEmail'); break;

                        case 'validate_mobile_number':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateMobileNumber'); break;

                        case 'validate_money':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateMoney'); break;

                        case 'valiate_date_format':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateDateFormat'); break;

                        case 'valiate_date_using_slash_format':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'valiateDateUsingSlashFormat'); break;

                        case 'valiate_date_using_hyphen_format':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'valiateDateUsingHyphenFormat'); break;

                        case 'equal_to':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateEqualTo'); break;

                        case 'not_equal_to':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateNotEqualTo'); break;

                        case 'less_than':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateLessThan'); break;

                        case 'less_than_or_equal':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateLessThanOrEqualTo'); break;

                        case 'greater_than':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateGreaterThan'); break;

                        case 'greater_than_or_equal':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateGreaterThanOrEqualTo'); break;

                        case 'in_between_including':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateInBetweenIncluding'); break;

                        case 'in_between_excluding':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateInBetweenExcluding'); break;

                        case 'no_spaces':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateNoSpaces'); break;

                        case 'custom_regex':

                            $validationResponse = $this->applyValidationRule($target_value, $validation_rule, 'validateCustomRegex'); break;

                        case 'custom_code':

                            $validationResponse = $this->applyFormattingRule($target_value, $validation_rule, 'validateCustomCode'); break;
                    }

                    //  If we have a screen to show return the response otherwise continue
                    if (isset($validationResponse) && $this->shouldDisplayScreen($validationResponse)) {
                        return $validationResponse;
                    }
                }
            }
        }

        //  Return null to indicate that validation passed
        return null;
    }

    /** This method validates to make sure the target input
     *  is only letters with or without spaces.
     */
    public function validateOnlyLetters($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^[a-zA-Z\s]+$/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  is only numbers with or without spaces.
     */
    public function validateOnlyNumbers($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^[0-9\s]+$/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  is only letters and numbers with or without spaces.
     */
    public function validateOnlyLettersAndNumbers($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^[a-zA-Z0-9\s]+$/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters the length of the minimum characters
     *  allowed of more.
     */
    public function validateMinimumCharacters($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $minimum_characters = $this->convertToString($outputResponse);

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (!(strlen($target_value) >= $minimum_characters)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters the length of the minimum characters
     *  allowed of more.
     */
    public function validateMaximumCharacters($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $maximum_characters = $this->convertToString($outputResponse);

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (!(strlen($target_value) <= $maximum_characters)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters with a length equal to a given value.
     */
    public function validateEqualToCharacters($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $value = $outputResponse;

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (!(strlen($target_value) == $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  is a valid email e.g example@gmail.com.
     */
    public function validateEmail($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/iD';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  is a valid mobile number (Botswana Mobile Numbers)
     *  e.g 71234567.
     */
    public function validateMobileNumber($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^[7]{1}[1234567]{1}[0-9]{6}$/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  is a valid money format e.g "35", "35.5" or "35.50"
     *  are valid while "P35", "3,500", "35 .5" and "35. 5"
     *  are invalid.
     */
    public function validateMoney($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^[0-9]+(?:\.[0-9]{1,2}){0,1}/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /**
     *  This method validates to make sure the target input
     *  is a valid date format e.g DDMMYYYY.
     *
     *  Dates that should pass validation:
     *
     *  01012023
     *  12031999
     *  07072005
     *  31082021
     *
     *  Dates that should fail validation:
     *
     *  12345678 (Invalid day and month)
     *  00122020 (Invalid day)
     *  31132020 (Invalid month)
     *  29022021 (2021 is not a leap year, so February 29th is invalid)
     *  25001999 (Invalid day and month)
     */
    public function validateDateFormat($target_value, $validation_rule)
    {
        // Regex pattern for validation
        $pattern = "/^(0?[1-9]|[1-2][0-9]|3[0-1])(0?[1-9]|1[0-2])\d{4}$/";

        // Convert to [String]
        $target_value = $this->convertToString($target_value);

        // If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {

            // Handle the failed validation
            return $this->handleFailedValidation($validation_rule);

        } else {

            // Extract day, month, and year from the input
            $day = substr($target_value, 0, 2);
            $month = substr($target_value, 2, 2);
            $year = substr($target_value, 4);

            // Create a Carbon instance and validate the date
            try {
                $date = \Carbon\Carbon::create($year, $month, $day);
            } catch (\Exception $e) {
                // Handle the failed validation
                return $this->handleFailedValidation($validation_rule);
            }

            // Check if the parsed date matches the input
            if ($date->format('dmY') !== $target_value) {
                // Handle the failed validation
                return $this->handleFailedValidation($validation_rule);
            }
        }
    }

    /**
     *  This method validates to make sure the target input
     *  is a valid date format e.g DD/MM/YYYY.
     *
     *  Dates that should pass validation:
     *
     *  01/01/2023
     *  12/03/1999
     *  07/07/2005
     *  31/08/2021
     *
     *  Dates that should fail validation:
     *
     *  123/456/7890 (Invalid format)
     *  00/12/2020   (Invalid day)
     *  32/01/2022   (Invalid day)
     *  29/02/2021   (2021 is not a leap year, so February 29th is invalid)
     *  25/00/1999   (Invalid month)
     *  01/13/2000   (Invalid month)
     *  01/01/23     (Year should be in 4-digit format)
     */
    public function valiateDateUsingSlashFormat($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = "/^(0?[1-9]|[1-2][0-9]|3[0-1])\/(0?[1-9]|1[0-2])\/\d{4}$/";

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {

            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);

        } else {

            /**
             *  Determine date format based on length of day and month parts:
             *
             *  1. If day and month parts are 1 character long, use 'j/n/Y' format e.g 1/2/2030
             *  2. If day and month parts are 2 characters long, use 'd/m/Y' format e.g 01/02/2030
             *  3. If day part is 1 character long and month part is 2 characters long, use 'j/m/Y' format e.g 1/02/2030
             *  4. If day part is 2 characters long and month part is 1 character long, use 'd/n/Y' format e.g 01/2/2030
             */
            $dayLength = strlen(substr($target_value, 0, strpos($target_value, '/')));
            $monthLength = strlen(substr($target_value, strpos($target_value, '/') + 1, strrpos($target_value, '/') - strpos($target_value, '/') - 1));
            $dateFormat = ($dayLength == 1 ? 'j' : 'd') . '/' . ($monthLength == 1 ? 'n' : 'm') . '/Y';

            $date = \Carbon\Carbon::createFromFormat($dateFormat, $target_value);

            ///  If the date is not valid
            if (($date && $date->format($dateFormat) == $target_value) == false) {

                //  Handle the failed validation
                return $this->handleFailedValidation($validation_rule);

            }

        }
    }

    /**
     *  This method validates to make sure the target input
     *  is a valid date format e.g DD-MM-YYYY.
     *  Dates that should pass validation:
     *
     *  01-01-2023
     *  12-03-1999
     *  07-07-2005
     *  31-08-2021
     *  Dates that should fail validation:
     *
     *  123-456-7890 (Invalid format)
     *  00-12-2020 (Invalid day)
     *  32-01-2022 (Invalid day)
     *  29-02-2021 (2021 is not a leap year, so February 29th is invalid)
     *  25-00-1999 (Invalid month)
     *  01-13-2000 (Invalid month)
     *  01-01-23 (Year should be in 4-digit format)
     */
    public function valiateDateUsingHyphenFormat($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/^(0?[1-9]|[1-2][0-9]|3[0-1])-(0?[1-9]|1[0-2])-\d{4}$/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {

            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);

        } else {

            /**
             *  Determine date format based on length of day and month parts:
             *
             *  1. If day and month parts are 1 character long, use 'j-n-Y' format e.g 1-2-2030
             *  2. If day and month parts are 2 characters long, use 'd-m-Y' format e.g 01-02-2030
             *  3. If day part is 1 character long and month part is 2 characters long, use 'j-m-Y' format e.g 1-02-2030
             *  4. If day part is 2 characters long and month part is 1 character long, use 'd-n-Y' format e.g 01-2-2030
             */
            $dayLength = strlen(substr($target_value, 0, strpos($target_value, '-')));
            $monthLength = strlen(substr($target_value, strpos($target_value, '-') + 1, strrpos($target_value, '-') - strpos($target_value, '-') - 1));
            $dateFormat = ($dayLength == 1 ? 'j' : 'd') . '-' . ($monthLength == 1 ? 'n' : 'm') . '-Y';

            $date = \Carbon\Carbon::createFromFormat($dateFormat, $target_value);

            ///  If the date is not valid
            if (($date && $date->format($dateFormat) == $target_value) == false) {

                //  Handle the failed validation
                return $this->handleFailedValidation($validation_rule);

            }

        }
    }

    /** This method validates to make sure the target input
     *  has characters equal to a given value.
     */
    public function validateEqualTo($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $value = $outputResponse;

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($value) || !($target_value == $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters not equal to a given value.
     */
    public function validateNotEqualTo($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $value = $outputResponse;

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($value) || ($target_value == $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters less than a given value.
     */
    public function validateLessThan($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $value = $outputResponse;

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($value) || !($target_value < $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters less than or equal to a given value.
     */
    public function validateLessThanOrEqualTo($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $value = $this->convertToInteger($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($value) || !($target_value <= $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters grater than a given value.
     */
    public function validateGreaterThan($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $value = $this->convertToInteger($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($value) || !($target_value > $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters grater than a given value.
     */
    public function validateGreaterThanOrEqualTo($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $value = $this->convertToInteger($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($value) || !($target_value >= $value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters inbetween the given min and max values
     *  (Including the Min and Max values).
     */
    public function validateInBetweenIncluding($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $min = $this->convertToInteger($outputResponse);

        /*********************
         * BUILD VALUE 2     *
         ********************/

        $value_2 = $validation_rule['value_2'];

        //  Convert the "value 2" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value_2);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $max = $this->convertToInteger($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($min) || empty($max) || !(($min <= $target_value) && ($target_value <= $max))) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has characters inbetween the given min and max values
     *  (Excluding the Min and Max values).
     */
    public function validateInBetweenExcluding($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $validation_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $min = $this->convertToInteger($outputResponse);

        /*********************
         * BUILD VALUE 2     *
         ********************/

        $value_2 = $validation_rule['value_2'];

        //  Convert the "value 2" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value_2);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $max = $this->convertToInteger($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || empty($min) || empty($max) || !(($min < $target_value) && ($target_value < $max))) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  has no characters that are spaces.
     */
    public function validateNoSpaces($target_value, $validation_rule)
    {
        //  Regex pattern
        $pattern = '/[\s]/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If we found spaces i.e validation failed
        if (empty($target_value) || preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  matches the given custom regex rule.
     */
    public function validateCustomRegex($target_value, $validation_rule)
    {
        //  Regex pattern
        $rule = $validation_rule['rule'];

        //  Convert the "rule value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($rule);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get Regex pattern - Convert to [String]
        $pattern = $this->convertToString($outputResponse);

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  If the pattern was not matched exactly i.e validation failed
        if (empty($target_value) || !preg_match($pattern, $target_value)) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method validates to make sure the target input
     *  matches the given custom regex rule.
     */
    public function validateCustomCode($target_value, $validation_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $code = $validation_rule['value'];

        //  Process the PHP Code
        $outputResponse = $this->processPHPCode("$code");

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        $validation = $outputResponse;

        //  If the validation failed
        if ($validation === false) {
            //  Handle the failed validation
            return $this->handleFailedValidation($validation_rule);
        }
    }

    /** This method gets the validation rule and callback. The callback represents the name of
     *  the validation function that we must run to validate the current input target. Since
     *  we allow custom Regex patterns for custom validation support, we must perform this under
     *  a try/catch incase the provided custom Regex pattern is invalid. This will allow us to
     *  catch any emerging error and be able to use the handleFailedValidation() in order to
     *  display the fatal error message and additional debugging details.
     */
    public function applyValidationRule($target_value, $validation_rule, $callback)
    {
        try {

            /*
             *  Perform the validation method here e.g "validateOnlyLetters()" within the try/catch
             *  method and pass the validation rule e.g "$this->validateOnlyLetters($target_value, $validation_rule )"
             */

            return call_user_func_array([$this, $callback], [$target_value, $validation_rule]);

        } catch (\Throwable $e) {

            //  Handle failed validation
            $this->handleFailedValidation($validation_rule);

            throw $e;

        } catch (\Exception $e) {

            //  Handle failed validation
            $this->handleFailedValidation($validation_rule);

            throw $e;

        }
    }

    /** This method logs a warning with details about the failed validation rule
     */
    public function handleFailedValidation($validation_rule)
    {
        //  Get the error message
        $error_message = $validation_rule['error_msg'];

        //  Convert the "error message" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($error_message);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get error message - Convert to [String]
        $error_message = $this->convertToString($outputResponse) . "\n" .'---'. "\n" . '1. Ok';

        $this->logWarning('Validation failed using ('.$this->wrapAsSuccessHtml($validation_rule['name']).') with message: '.$this->wrapAsErrorHtml($error_message));

        //  Create the notification message using the error message
        $this->create_notification_message($error_message);

        //  Set "0" as Auto Reply to automatically go back
        $this->addReplyRecord('0', 'auto_reply', true);
    }

    /******************************************
     *  VALIDATION EVENT METHODS              *
     *****************************************/

    /** This method gets all the formatting rules of the current display. We then use these
     *  formatting rules to modify the target input.
     */
    public function handle_Formatting_Event()
    {
        if ($this->event) {
            //  Get the formatting rules
            $formatting_rules = $this->event['event_data']['rules'] ?? [];

            //  Get the target input
            $reference_name = $this->event['event_data']['reference_name'];

            //  Get the target input
            $target_value = $this->event['event_data']['target'];

            /*************************
             * BUILD TARGET VALUE    *
             ************************/

            //  Convert the "target value" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($target_value);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output
            $target_value = $outputResponse ?? null;

            //  Format the target input
            $formattingResponse = $this->handleFormattingRules($target_value, $formatting_rules);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($formattingResponse)) {
                return $formattingResponse;
            }

            //  Store the formatted data as dynamic data
            $this->setProperty($reference_name, $formattingResponse);
        }
    }

    /** This method gets all the formatting rules of the current display. We then use these
     *  formatting rules to modify the target input.
     */
    public function handle_Set_Property_Event()
    {
        if ($this->event) {

            //  Get the reference name
            $reference_name = $this->event['event_data']['reference_name'];

            //  Get the property
            $property = $this->event['event_data']['property'];

            //  Convert the "property" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($property);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            $property = $outputResponse;

            //  Store the formatted data as dynamic data
            $this->setProperty($reference_name, $property);
        }
    }

    /** This method checks if the given formatting rules are active (If they must be used).
     *  If the formatting rule must be used then we determine which rule we are given and
     *  which formatting method must be used for each given case.
     */
    public function handleFormattingRules($target_value, $formatting_rules = [])
    {
        //  If we have formatting rules
        if (!empty($formatting_rules)) {
            //  For each formatting rule
            foreach ($formatting_rules as $formatting_rule) {
                //  Get the active state value
                $activeState = $this->processActiveState($formatting_rule['active']);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($activeState)) {
                    return $activeState;
                }

                //  If the current formatting rule is active (Must be used)
                if ($activeState === true) {
                    //  Get the type of formatting rule e.g "capitalize" or "trim"
                    $formattingType = $formatting_rule['type'];

                    //  Use the switch statement to determine which formatting method to use
                    switch ($formattingType) {
                        case 'capitalize':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'capitalizeFormat'); break;

                        case 'uppercase':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'uppercaseFormat'); break;

                        case 'lowercase':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'lowercaseFormat'); break;

                        case 'trim':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'trimFormat'); break;

                        case 'trim_left':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'trimLeftFormat'); break;

                        case 'trim_right':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'trimRightFormat'); break;

                        case 'convert_to_money':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'convertToMoneyFormat'); break;

                        case 'limit':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'limitFormat'); break;

                        case 'substr':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'substrFormat'); break;

                        case 'remove_letters':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'removeLettersFormat'); break;

                        case 'remove_numbers':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'removeNumbersFormat'); break;

                        case 'remove_symbols':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'removeSymbolsFormat'); break;

                        case 'remove_spaces':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'removeSpacesFormat'); break;

                        case 'replace_with':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'replaceWithFormat'); break;

                        case 'replace_first_with':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'replaceWithFormat', 'first'); break;

                        case 'replace_last_with':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'replaceWithFormat', 'last'); break;

                        case 'plural_or_singular':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'pluralOrSingularFormat'); break;

                        case 'random_string':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'randomStringFormat'); break;

                        case 'set_to_null':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'setToNullFormat'); break;

                        case 'set_to_true':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'setToTrueFormat'); break;

                        case 'set_to_false':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'setToFalseFormat'); break;

                        case 'set_to_empty_string':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'setToEmptyStringFormat'); break;

                        case 'set_to_empty_array':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'setToEmptyArrayFormat'); break;

                        case 'custom_code':

                            return $this->applyFormattingRule($target_value, $formatting_rule, 'customCodeFormat'); break;
                    }
                }
            }
        }

        //  Return null to indicate that formatting passed
        return null;
    }

    /** This method capitalizes the given target value
     */
    public function capitalizeFormat($target_value, $formatting_rule)
    {
        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        return ucfirst($target_value);
    }

    /** This method convert the given target value into lowercase
     */
    public function lowercaseFormat($target_value, $formatting_rule)
    {
        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        return strtolower($target_value);
    }

    /** This method convert the given target value into uppercase
     */
    public function uppercaseFormat($target_value, $formatting_rule)
    {
        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        return strtoupper($target_value);
    }

    /** This method removes left and right spaces from the target value
     */
    public function trimFormat($target_value, $formatting_rule)
    {
        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        return trim($target_value);
    }

    /** This method removes left spaces from the target value
     */
    public function trimLeftFormat($target_value, $formatting_rule)
    {
        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        return ltrim($target_value);
    }

    /** This method removes right spaces from the target value
     */
    public function trimRightFormat($target_value, $formatting_rule)
    {
        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        return rtrim($target_value);
    }

    /** This method convert a given number to represent money format
     */
    public function convertToMoneyFormat($target_value, $formatting_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $formatting_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [String]
        $currency_symbol = $this->convertToString($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        return $currency_symbol.number_format($target_value, 2, '.', ',');
    }

    /** This method limits the number of characters of the target value
     */
    public function limitFormat($target_value, $formatting_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $formatting_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $limit = $this->convertToInteger($outputResponse);

        /*********************
         * BUILD VALUE 2     *
         ********************/

        $value = $formatting_rule['value_2'];

        //  Convert the "value 2" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $trail = $this->convertToString($outputResponse);

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        if (strlen($target_value) > $limit) {
            if ($limit > strlen($trail)) {
                return substr($target_value, 0, $limit - strlen($trail)).$trail;
            } else {
                return substr($target_value, 0, $limit);
            }
        }
    }

    /** This method strips the characters of the target value
     */
    public function substrFormat($target_value, $formatting_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $formatting_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $start = $this->convertToInteger($outputResponse);

        /*********************
         * BUILD VALUE 2     *
         ********************/

        $value = $formatting_rule['value_2'];

        //  Convert the "value 2" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [Integer]
        $length = $this->convertToInteger($outputResponse);

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        if ($outputResponse == '') {
            return substr($target_value, $start);
        } else {
            return substr($target_value, $start, $length);
        }
    }

    /** This method removes letters from the target value
     */
    public function removeLettersFormat($target_value, $formatting_rule)
    {
        //  Regex pattern
        $pattern = '/[a-zA-Z]+/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  Replace the letters from the target value with nothing
        return preg_replace($pattern, '', $target_value);
    }

    /** This method removes numbers from the target value
     */
    public function removeNumbersFormat($target_value, $formatting_rule)
    {
        //  Regex pattern
        $pattern = '/[0-9]+/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  Replace the numbers from the target value with nothing
        return preg_replace($pattern, '', $target_value);
    }

    /** This method removes symbols from the target value
     *  (Removes everything except letters, numbers and
     *  spaces).
     */
    public function removeSymbolsFormat($target_value, $formatting_rule)
    {
        //  Regex pattern
        $pattern = '/[^a-zA-Z0-9\s]+/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  Replace the symbols from the target value with nothing
        return preg_replace($pattern, '', $target_value);
    }

    /** This method removes spaces
     */
    public function removeSpacesFormat($target_value, $formatting_rule)
    {
        //  Regex pattern
        $pattern = '/[\s]+/';

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        //  Replace the symbols from the target value with nothing
        return preg_replace($pattern, '', $target_value);
    }

    /** This method replaces a value within the target value with
     *  another value.
     */
    public function replaceWithFormat($target_value, $formatting_rule, $type = null)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $formatting_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [String]
        $search_value = $this->convertToString($outputResponse);

        /*********************
         * BUILD VALUE 2     *
         ********************/

        $value = $formatting_rule['value_2'];

        //  Convert the "value 2" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [String]
        $replace_value = $this->convertToString($outputResponse);

        //  Convert to [String]
        $target_value = $this->convertToString($target_value);

        if ($type == 'first') {
            //  Replaces the first occurrence of a given value in a string
            return Str::of($target_value)->replaceFirst($search_value, $replace_value);
        } elseif ($type == 'last') {
            //  Replaces the last occurrence of a given value in a string
            return Str::of($target_value)->replaceLast($search_value, $replace_value);
        } else {
            //  Replaces the every occurrence of a given value in a string
            return str_replace($search_value, $replace_value, $target_value);
        }
    }

    /** This method will convert the target value into its plural form
     */
    public function pluralOrSingularFormat($target_value, $formatting_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $value = $formatting_rule['value'];

        //  Convert the "value" into its associated dynamic value
        $outputResponse = $this->convertValueStructureIntoDynamicData($value);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output - Convert to [String]
        $word = $this->convertToString($outputResponse);

        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        /* Convert the $word into "car" into "cars" or "child" into "children"
         *  if $target_value is greater than 1 and vice-versa if the
         *  $target_value is equal to 1
         */
        return Str::plural($word, $target_value);
    }

    /** This method will generate a random string with a length the size of the
     *  target value specified.
     */
    public function randomStringFormat($target_value, $formatting_rule)
    {
        //  Convert to [Integer]
        $target_value = $this->convertToInteger($target_value);

        /* Convert the $word into "car" into "cars" or "child" into "children"
         *  if $target_value is greater than 1 and vice-versa if the
         *  $target_value is equal to 1
         */
        return Str::random($target_value);
    }

    /** This method will set the target value to Null
     */
    public function setToNullFormat($target_value, $formatting_rule)
    {
        return null;
    }

    /** This method will set the target value to True
     */
    public function setToTrueFormat($target_value, $formatting_rule)
    {
        return true;
    }

    /** This method will set the target value to False
     */
    public function setToFalseFormat($target_value, $formatting_rule)
    {
        return false;
    }

    /** This method will set the target value to Empty String
     */
    public function setToEmptyStringFormat($target_value, $formatting_rule)
    {
        return '';
    }

    /** This method will set the target value to Empty Array
     */
    public function setToEmptyArrayFormat($target_value, $formatting_rule)
    {
        return [];
    }

    public function customCodeFormat($target_value, $formatting_rule)
    {
        /*******************
         * BUILD VALUE     *
         ******************/

        $code = $formatting_rule['value'];

        //  Process the PHP Code
        $outputResponse = $this->processPHPCode("$code");

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        return $outputResponse;
    }

    /** This method gets the formatting rule and callback. The callback represents the name of
     *  the formatting function that we must run to format the current target value. Since
     *  we allow custom code for custom formatting support, we must perform this under
     *  a try/catch incase the provided custom Regex pattern is invalid. This will
     *  allow us to catch any emerging error and be able to use the
     *  handleFailedformatting() in order to display the fatal
     *  error message and additional debugging details.
     */
    public function applyformattingRule($target_value, $formatting_rule, $callback)
    {
        try {

            /*
             *  Perform the formatting method here e.g "validateOnlyLetters()" within the try/catch
             *  method and pass the formatting rule e.g "$this->validateOnlyLetters($target_value, $formatting_rule )"
             */

            return call_user_func_array([$this, $callback], [$target_value, $formatting_rule]);

        } catch (\Throwable $e) {

            //  Handle failed formatting
            $this->handleFailedFormatting($formatting_rule);

            throw $e;

        } catch (\Exception $e) {

            //  Handle failed formatting
            $this->handleFailedFormatting($formatting_rule);

            throw $e;

        }
    }

    /** This method logs a warning and returns the technical difficulties screen
     */
    public function handleFailedFormatting($formatting_rule)
    {
        $this->logWarning('Formatting failed using ('.$this->wrapAsSuccessHtml($formatting_rule['name']).')');

        //  Show the technical difficulties error screen to notify the user of the issue
        return $this->showTechnicalDifficultiesErrorScreen();
    }

    /******************************************
     *  AUTO REPLY EVENT METHODS              *
     *****************************************/

    /** This method gets the Custom Code and processes the logic provided
     */
    public function handle_Custom_Code_Event()
    {
        if ($this->event) {
            $code = $this->event['event_data']['code'];

            //  Process the PHP Code
            $outputResponse = $this->processPHPCode("$code");

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }
        }
    }

    /******************************************
     *  AUTO REPLY EVENT METHODS              *
     *****************************************/

    /** This method gets all the revisit instructions of the current display. We then use these
     *  revisit instructions to allow the current display to revisit a previous screen, marked
     *  screen or the first launched screen of the current USSD Service Code.
     */
    public function handle_Auto_Reply_Event()
    {
        if ($this->event) {

            //  Get the additional responses
            $automatic_replies = $this->event['event_data']['automatic_replies'];

            /****************************
             * BUILD AUTOMATIC REPLIES  *
             ****************************/

            //  Convert the "automatic_replies" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($automatic_replies);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output - Convert to [String]
            $automatic_replies_text = $this->convertToString($outputResponse);

            //  If the text is not a type of [String] or [Integer]
            if (!(is_string($automatic_replies_text) || is_integer($automatic_replies_text))) {
                $dataType = $this->wrapAsSuccessHtml($this->getDataType($automatic_replies_text));

                $this->logWarning('The given '.$this->wrapAsSuccessHtml('Automatic Replies').' must return data of type ['.$this->wrapAsSuccessHtml('String').'], however we received data of type ['.$dataType.']');

                //  Empty the value
                $automatic_replies_text = '';
            }

            if ($automatic_replies_text != '') {
                $this->logInfo('Performing automatic reply: '.$this->wrapAsSuccessHtml($automatic_replies_text));

                $automatic_replies = explode('*', $automatic_replies_text);

                //  Foreach existing session reply record
                foreach ($automatic_replies as $key => $automatic_reply) {

                    /** We need to make sure that this event does not keep getting fired everytime we
                     *  make a USSD reply. Remember that each time we reply we have to run the before
                     *  and after events of each screen and display. This can be bad in this case since
                     *  we will be running this "Auto Reply" event over and over again. This will make
                     *  it such that every reply that we make this event will fire to add another
                     *  automatic reply after our own user reply. Remember that every automatic reply
                     *  is actually then saved to the existing session record within the "reply_records"
                     *  column.
                     *
                     *  Example:
                     *
                     *  We launch the application and the "reply_records" column is empty as we don't have
                     *  responses yet.
                     *
                     *  reply_records = []
                     *
                     *  Then we make our first response, which means we add a normal user reply. This becomes
                     *  the first response on the "reply_records". This is saved to the database.
                     *
                     *  reply_records = [ { user_record ... } ]
                     *
                     *  Now after we reply the home screens links normally to the next screen, lets call
                     *  it "Screen 2". Now "Screen 2" fires an "Auto Reply" event which forces a new reply
                     *  to the "reply_records". This is saved to the database. This means that we link
                     *  normally to the next screen "Screen 3".
                     *
                     *  reply_records = [ { user_record ... }, { auto_reply_record ... } ]
                     *
                     *  Now after we reply to "Screen 3", we link normally to the next screen "Screen 4".
                     *  This becomes the third response on the "reply_records". This is saved to the database.
                     *
                     *  reply_records = [ { user_record ... }, { auto_reply_record ... }, { user_record ... } ]
                     *
                     *  However we have an issue! Since we run every event on every screen, this means that we
                     *  will also run the "Auto Reply" event on "Screen 2" again. This forces a new reply to
                     *  the "reply_records". This is saved to the database.
                     *
                     *  reply_records = [ { user_record ... }, { auto_reply_record ... }, { user_record ... }, { auto_reply_record ... }]
                     *
                     *  Now we have a serious problem, each time we reply, this event is also triggered and then
                     *  two replies instead of one are recorded and saved to the database. To avoid this messy
                     *  situation, we need to keep checking if the "Auto Reply" reply record already exists
                     *  within the "reply_records". This means that we only ever run it once for each unique
                     *  instance of a display and never more than once.
                     *
                     */

                    /* If this event was triggered after the user replied to the display. Then we know that
                     *  the user's response will be added first to the "reply_records". Now we need to offset
                     *  to target any replies after this user reply. That is, we need to check whether this
                     *  event added "Auto Replies" after the user responded. If no, lets add a reply, one
                     *  after another to follow-up on the users initial response.
                     */
                    if ($this->event_type == 'on_display_response') {
                        /** Lets think!
                         *
                         *  $this->hasResponded() - checks if the user responded to the current display.
                         *
                         *  We need to check for "Auto Replies" after this user response. THis means we can take
                         *  advantage of the $key value which always starts at "0". We need to first increment
                         *  the value so that we can use it to target any replies after this user response.
                         */
                        $level = $this->level + ($key + 1);

                        //  Check if we have any "Auto Replies" after the users initial response
                        if ($this->hasResponded() == false) {

                            /*************************************
                             *  CAPTURE AUTOMATIC REPLY RECORD   *
                             ************************************/

                            /* Get the "Auto Reply" record and save it locally.
                             *  This reply will be recorded to originate from the "Auto Reply" event
                             *  and is a removable reply (Can be deleted by the user) depending on
                             *  the given event settings
                             */
                            $this->addReplyRecord($automatic_reply, 'auto_reply', true);

                        }
                    } else {

                        /** Lets think!
                         *
                         *  $this->hasResponded() - checks if we already have an "Auto Reply"
                         *  to the current display. We need to take advantage of the $key value which always
                         *  starts at "0". We need to use it to target any "Auto Replies" that have been
                         *  executed already.
                         */
                        $level = $this->level + $key;

                        //  Check if we have any "Auto Replies" before the users initial response
                        if ($this->hasResponded() == false) {

                            /*************************************
                             *  CAPTURE AUTOMATIC REPLY RECORD   *
                             ************************************/

                            /* Get the "Auto Reply" record and save it locally.
                             *  This reply will be recorded to originate from the "Auto Reply" event
                             *  and is a removable reply (Can be deleted by the user) depending on
                             *  the given event settings
                             */
                            $this->addReplyRecord($automatic_reply, 'auto_reply', true);

                        }else{

                            //  If the automatic reply is the same as the response to the current level
                            if( $automatic_reply === $this->getResponseFromLevel($level) ){

                                /** If the user manually inserted this value, then we must update it to
                                 *  reflect an automatic reply instead of the user reply. We do this
                                 *  by changing the record origin value.
                                 *
                                 *  Lets assume that the user dials a shortcode e.g *123# to launch the USSD
                                 *  application then is presented with "Screen 1". The user replies with "1"
                                 *  and is instantly linked to "Screen 2". On "Screen 2" we find a before
                                 *  reply event to "Auto Reply" with the value "2" so to that the app will
                                 *  link to "Screen 3". This means that the result is as follows:
                                 *
                                 *  Dial *123#    --> Screen 1
                                 *  User Reply 1  --> Screen 2
                                 *  Auto Reply 2  --> Screen 3
                                 *
                                 *  However what happens when the user dials "*123*1*2#". In this case the application
                                 *  will launch as usual, then the value "1" will be used as the first response to link
                                 *  from "Screen 1" to "Screen 2". This will be recorded as a user response. Then on
                                 *  "Screen 2" the before user reply "Auto Reply" event will be triggered, where we
                                 *  will then process the $automatic_reply to give us a value of "2", however since
                                 *  the user already replied with "2", we need to check if the user reply matches the
                                 *  $automatic_reply value. If we have a match then we need to make sure that the reply
                                 *  is recorded to originate from the "Auto Reply" event. This is because it will allow
                                 *  to easy removal when the user needs to reply "0" to remove the reply. If they do not
                                 *  match we will use the value provided by the user and leave the origin to indicate that
                                 *  the value was provided by the user.
                                 */
                                $this->reply_records[$level - 1]['origin'] = 'auto_reply';

                            }

                        }
                    }
                }
            }
        }
    }

    /******************************************
     *  AUTO LINK EVENT METHODS               *
     *****************************************/

    /** This method gets all the revisit instructions of the current display. We then use these
     *  revisit instructions to allow the current display to revisit a previous screen, marked
     *  screen or the first launched screen of the current USSD Service Code.
     */
    public function handle_Auto_Link_Event()
    {
        if ($this->event) {

            //  Get the trigger type e.g "automatic", "manual"
            $trigger = $this->event['event_data']['trigger']['selected_type'];

            //  Get the trigger input
            $manual_trigger_input = $this->event['event_data']['trigger']['manual']['input'];

            //  Get the "link"
            $link = $this->event['event_data']['link'];

            $is_triggered = false;

            /* If the trigger is manual, this means that the redirect is only
             *  triggered if the user provided the trigger input and if the
             *  input matches the required value to trigger the redirect.
             */
            if ($trigger == 'manual') {
                $this->logInfo($this->wrapAsSuccessHtml('Manual Linking').' event triggered');

                /********************************
                 * BUILD MANUAL TRIGGER INPUT   *
                 *******************************/

                //  Convert the "manual_trigger_input" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($manual_trigger_input);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output - Convert to [String]
                $manual_trigger_input = $this->convertToString($outputResponse);

                //  If the manual input is provided
                if (!empty($manual_trigger_input)) {
                    //  If the manual trigger input matches the current user input
                    if ($manual_trigger_input == $this->current_user_response) {
                        //  Trigger the event manually to redirect
                        $is_triggered = true;
                    }
                }
            } else {
                $this->logInfo($this->wrapAsSuccessHtml('Automatic Linking').' event triggered');

                //  Trigger the event automatically to redirect
                $is_triggered = true;
            }

            //  If the event has been triggered
            if ($is_triggered) {

                /*************************
                 * SET SCREEN VIA LINK   *
                 *************************/

                //  Get the screen matching the given link
                $outputResponse = $this->searchScreenById($link);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                $screen = $outputResponse;

                /*************************
                 * SET DISPLAY VIA LINK  *
                 *************************/

                //  Get the display matching the given link
                $outputResponse = $this->getDisplayById($link);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                $display = $outputResponse;

                //  If the screen to revisit was found
                if ($screen) {

                    $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to link to the following screen: '.$this->wrapAsPrimaryHtml($screen['name']));

                    $this->linked_screen = $screen;

                //  If the display to revisit was found
                } elseif ($display) {

                    $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to link to the following display: '.$this->wrapAsPrimaryHtml($display['name']));

                    $this->linked_display = $display;

                }

                //  If we have the screen or display to link to
                if ($screen || $display) {

                    //  Set an automatic reply for this "Auto Link" event
                    $auto_link_reply = 'A_L';

                    if (!$this->hasResponded()) {

                        /**************************************************
                         *  SAVE THE AUTO LINK REPLIES AS REPLY RECORDS   *
                         *************************************************/

                        /** Add the auto link reply as a reply record. This reply will be recorded to originate
                         *  from the "Auto Link" event and is a removable reply (Can be deleted by the user)
                         *  depending on the given event settings
                         */
                        $this->addReplyRecord($auto_link_reply, 'auto_link', true);

                        /** We need to include the "A_L" reply as the current user response so that we
                         *  can record this value within the $this->chained_display_metadata['text']
                         *  and the $this->chained_screen_metadata['text']. This is so that we have
                         *  a correct order of replies including this "Auto Reply" record. This is
                         *  especially important when the need arises for us to use the
                         *  handleScreenRevisit() since it depends on the text value in
                         *  order for us to Revisit a given screen/display e.g:
                         *
                         *  $this->chained_screens['metadata']['text'] or
                         *  $this->chained_displays['metadata']['text']
                         *
                         *  In order to target the correct shortcode path that leads to that screen
                         *  or display. We must always update the current user response so that it
                         *  can be used to update the this->chained_display_metadata['text'] and
                         *  $this->chained_screen_metadata['text']. If we don't update then we
                         *  will have missing information that will cause issues e.g
                         *
                         *  If we are on "Screen 1" and we reply with "1" to link normally to "Screen 2"
                         *  and then we "Auto Link" to "Screen 3" and we "Auto Link" again to "Screen 4"
                         *  then the metadata text will be
                         *  as follows:
                         *
                         *  Screen 1 = ['metadata']['text' => '']
                         *  Screen 2 = ['metadata']['text' => '1']  (Reply recorded)
                         *  Screen 3 = ['metadata']['text' => '1']  (Auto link Not recorded!)
                         *  Screen 4 = ['metadata']['text' => '1']  (Auto link Not recorded!)
                         *
                         *  As you can see the autolink is not recorded. We need to fix this so that
                         *  we have the following results:
                         *
                         *  Screen 1 = ['metadata']['text' => '']
                         *  Screen 2 = ['metadata']['text' => '1']          (Reply recorded)
                         *  Screen 3 = ['metadata']['text' => '1*A_L']      (Auto link recorded)
                         *  Screen 4 = ['metadata']['text' => '1*A_L*A_L']  (Auto link recorded)
                         */

                        //  Update the chained screen metadata
                        $this->updateChainedScreenMetadata($auto_link_reply);

                        //  Update the chained display metadata
                        $this->updateChainedDisplayMetadata($auto_link_reply);

                    }

                }
            }
        }
    }

    /******************************************
     *  REDIRECT EVENT METHODS                *
     *****************************************/

    /** This method gets all the revisit instructions of the current display. We then use these
     *  revisit instructions to allow the current display to revisit a previous screen, marked
     *  screen or the first launched screen of the current USSD Service Code.
     */
    public function handle_Revisit_Event()
    {
        if ($this->event) {
            //  Get the trigger type e.g "automatic", "manual"
            $trigger = $this->event['event_data']['general']['trigger']['selected_type'];

            //  Get the trigger input
            $manual_trigger_input = $this->event['event_data']['general']['trigger']['manual']['input'];

            //  Get the additional responses
            $automatic_replies = $this->event['event_data']['general']['automatic_replies'];

            //  Get the redirect type e.g "home_revisit", "screen_revisit", "marked_revisit"
            $revisit_type = $this->event['event_data']['revisit_type']['selected_type'];

            $is_triggered = false;

            /* If the trigger is manual, this means that the redirect is only
             *  triggered if the user provided the trigger input and if the
             *  input matches the required value to trigger the redirect.
             */
            if ($trigger == 'manual') {
                $this->logInfo($this->wrapAsSuccessHtml('Manual Revisit').' event triggered');

                /********************************
                 * BUILD MANUAL TRIGGER INPUT   *
                 *******************************/

                //  Convert the "manual_trigger_input" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($manual_trigger_input);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output - Convert to [String]
                $manual_trigger_input = $this->convertToString($outputResponse);

                //  If the manual input is provided
                if (!empty($manual_trigger_input)) {
                    //  If the manual trigger input matches the current user input
                    if ($manual_trigger_input == $this->current_user_response) {
                        //  Trigger the event manually to redirect
                        $is_triggered = true;
                    }
                }
            } else {
                $this->logInfo($this->wrapAsSuccessHtml('Automatic Revisit').' event triggered');

                //  Trigger the event automatically to redirect
                $is_triggered = true;
            }

            //  If the event has been triggered
            if ($is_triggered) {
                $this->logInfo('The '.$this->event['name'].' event has been triggered');

                /****************************
                 * BUILD AUTOMATIC REPLIES  *
                 ****************************/

                //  Convert the "automatic_replies" into its associated dynamic value
                $outputResponse = $this->convertValueStructureIntoDynamicData($automatic_replies);

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output - Convert to [String]
                $automatic_replies_text = $this->convertToString($outputResponse);

                //  If the text is not a type of [String] or [Integer]
                if (!(is_string($automatic_replies_text) || is_integer($automatic_replies_text))) {
                    $dataType = $this->wrapAsSuccessHtml($this->getDataType($automatic_replies_text));

                    $this->logWarning('The given '.$this->wrapAsSuccessHtml('Additional Responses').' must return data of type ['.$this->wrapAsSuccessHtml('String').'], however we received data of type ['.$dataType.']');

                    //  Empty the value
                    $automatic_replies_text = '';
                }

                if ($revisit_type == 'home_revisit') {

                    return $this->handleHomeRevisit($automatic_replies_text);

                } elseif ($revisit_type == 'screen_revisit') {

                    //  Get the provided link
                    $link = $this->event['event_data']['revisit_type']['screen_revisit']['link'];

                    /*************************
                     * SET SCREEN VIA LINK   *
                     *************************/

                    //  Get the screen matching the given link
                    $outputResponse = $this->searchScreenById($link);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    $screen = $outputResponse;

                    /*************************
                     * SET DISPLAY VIA LINK  *
                     *************************/

                    //  Get the display matching the given link
                    $outputResponse = $this->getDisplayById($link);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    $display = $outputResponse;

                    //  If the screen to revisit was found
                    if ($screen) {
                        $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to revisit the following screen: '.$this->wrapAsPrimaryHtml($screen['name']));

                        return $this->handleScreenRevisit($screen, 'screen', $automatic_replies_text);

                    //  If the display to revisit was found
                    } elseif ($display) {
                        $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to revisit following display: '.$this->wrapAsPrimaryHtml($display['name']));

                        return $this->handleScreenRevisit($display, 'display', $automatic_replies_text);
                    }

                } elseif ($revisit_type == 'marked_revisit') {

                    //  Get the provided marker
                    $marker = $this->event['event_data']['revisit_type']['marked_revisit']['selected_marker'];

                    if( empty($marker) ) {

                        $this->logWarning('Provide a marker to locate a screen or display to revisit');

                    }

                    //  Get the screen matching the given link
                    $screen = $this->getScreenByMarker($marker);

                    //  Get the screen matching the given link
                    $display = $this->getDisplayByMarker($marker);

                    //  If the display to revisit was found
                    if ($display) {

                        $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to revisit following display: '.$this->wrapAsPrimaryHtml($display['name']));

                        return $this->handleScreenRevisit($display, 'display', $automatic_replies_text);

                    //  If the screen to revisit was found
                    } elseif ($screen) {

                        $this->logInfo($this->wrapAsPrimaryHtml($this->screen['name']).' is attempting to revisit the following screen: '.$this->wrapAsPrimaryHtml($screen['name']));

                        return $this->handleScreenRevisit($screen, 'screen', $automatic_replies_text);

                    }else{

                        $this->logWarning('The marker '.$this->wrapAsPrimaryHtml($marker).' does not exist, therefore we cannot revisit any screen or display');

                    }

                }
            }
        }
    }

    public function handleHomeRevisit($automatic_replies_text = '')
    {
        //  Empty the existing reply records
        $this->emptyReplyRecords();

        //  Get the automatic replies
        $automatic_replies = $this->getUserResponses($automatic_replies_text);

        //  If we have any automatic replies
        if (count($automatic_replies)) {
            //  Add the new automatic reply records
            foreach ($automatic_replies as $key => $automatic_reply) {
                /*************************************
                 *  CAPTURE AUTOMATIC REPLY RECORD   *
                 ************************************/

                /* Get the "Automatic Reply" record and save it locally.
                 *  This reply will be recorded to originate from the "Revisit" event
                 *  and is a removable reply (Can be deleted by the user) depending on
                 *  the given event settings
                 */
                $this->addReplyRecord($automatic_reply, 'revisit_event', true);
            }
        }

        if (!empty($this->text)) {
            $service_code = substr($this->service_code, 0, -1).'*'.$this->text.'#';
        } else {
            $service_code = $this->service_code;
        }

        $this->logInfo('Revisiting Home: '.$this->wrapAsSuccessHtml($service_code));

        return $this->handleRevisit();
    }

    public function handleScreenRevisit($screen_or_display, $type = null, $automatic_replies_text = '')
    {
        //  Empty the existing reply records
        $this->emptyReplyRecords();

        if ($type == 'screen') {
            $chained_screens_or_displays = $this->chained_screens;
        } elseif ($type == 'display') {
            $chained_screens_or_displays = $this->chained_displays;
        }

        foreach ($chained_screens_or_displays as $chained_screen_or_display) {

            if ($chained_screen_or_display['id'] == $screen_or_display['id']) {

                //  Get the user responses leading on to this screen/display as "text"
                $text = $chained_screen_or_display['metadata']['text'];

                //  Convert the user responses from "text" to an "array" of responses
                $replies = $this->getUserResponses($text);

                //  If we have any user replies
                if (count($replies)) {
                    //  Add the new user reply records
                    foreach ($replies as $key => $reply) {
                        /********************************
                         *  CAPTURE USER REPLY RECORD   *
                         ********************************/

                        /* Get the "User Reply" record and save it locally.
                        *  This reply will be recorded to originate from the "User" event
                        *  and is a removable reply (Can be deleted by the user) depending on
                        *  the given event settings
                        */
                        $this->addReplyRecord($reply, 'user', true);
                    }
                }

                //  Stop the loop
                break 1;
            }
        }

        //  Get the automatic replies
        $automatic_replies = $this->getUserResponses($automatic_replies_text);

        //  If we have any automatic replies
        if (count($automatic_replies)) {
            //  Add the new automatic reply records
            foreach ($automatic_replies as $key => $automatic_reply) {
                /*************************************
                 *  CAPTURE AUTOMATIC REPLY RECORD   *
                 ************************************/

                /* Get the "Automatic Reply" record and save it locally.
                 *  This reply will be recorded to originate from the "Revisit" event
                 *  and is a removable reply (Can be deleted by the user) depending on
                 *  the given event settings
                 */
                $this->addReplyRecord($automatic_reply, 'revisit_event', true);
            }
        }

        if (!empty($this->text)) {
            $service_code = substr($this->service_code, 0, -1).'*'.$this->text.'#';
        } else {
            $service_code = $this->service_code;
        }

        if ($type == 'screen') {
            $this->logInfo('Revisiting screen '.$this->wrapAsPrimaryHtml($screen_or_display['name']).': '.$this->wrapAsSuccessHtml($service_code));
        } elseif ($type == 'display') {
            $this->logInfo('Revisiting display '.$this->wrapAsPrimaryHtml($screen_or_display['name']).': '.$this->wrapAsSuccessHtml($service_code));
        }

        return $this->handleRevisit();
    }

    public function handleMarkedRevisit($screen_or_display, $type = null, $automatic_replies_text = '')
    {
        //  Empty the existing reply records
        $this->emptyReplyRecords();

        if ($type == 'screen') {
            $chained_screens_or_displays = $this->chained_screens;
        } elseif ($type == 'display') {
            $chained_screens_or_displays = $this->chained_displays;
        }

        foreach ($chained_screens_or_displays as $chained_screen_or_display) {
            if ($chained_screen_or_display['id'] == $screen_or_display['id']) {
                //  Get the user responses leading on to this screen/display as "text"
                $text = $chained_screen_or_display['metadata']['text'];

                //  Convert the user responses from "text" to an "array" of responses
                $replies = $this->getUserResponses($text);

                //  If we have any user replies
                if (count($replies)) {
                    //  Add the new user reply records
                    foreach ($replies as $key => $reply) {
                        /********************************
                         *  CAPTURE USER REPLY RECORD   *
                         ********************************/

                        /* Get the "User Reply" record and save it locally.
                        *  This reply will be recorded to originate from the "User" event
                        *  and is a removable reply (Can be deleted by the user) depending on
                        *  the given event settings
                        */
                        $this->addReplyRecord($reply, 'user', true);
                    }
                }

                //  Stop the loop
                break 1;
            }
        }

        //  Get the automatic replies
        $automatic_replies = $this->getUserResponses($automatic_replies_text);

        //  If we have any automatic replies
        if (count($automatic_replies)) {
            //  Add the new automatic reply records
            foreach ($automatic_replies as $key => $automatic_reply) {
                /*************************************
                 *  CAPTURE AUTOMATIC REPLY RECORD   *
                 ************************************/

                /* Get the "Automatic Reply" record and save it locally.
                 *  This reply will be recorded to originate from the "Revisit" event
                 *  and is a removable reply (Can be deleted by the user) depending on
                 *  the given event settings
                 */
                $this->addReplyRecord($automatic_reply, 'revisit_event', true);
            }
        }

        if (!empty($this->text)) {
            $service_code = substr($this->service_code, 0, -1).'*'.$this->text.'#';
        } else {
            $service_code = $this->service_code;
        }

        if ($type == 'screen') {
            $this->logInfo('Revisiting screen '.$this->wrapAsPrimaryHtml($screen_or_display['name']).': '.$this->wrapAsSuccessHtml($service_code));
        } elseif ($type == 'display') {
            $this->logInfo('Revisiting display '.$this->wrapAsPrimaryHtml($screen_or_display['name']).': '.$this->wrapAsSuccessHtml($service_code));
        }

        return $this->handleRevisit();
    }

    public function handleRevisit()
    {
        /* We need to re-run the handleExistingSession() method. This will allow us the opportunity
         *  to change the database "text" value. By updating this value we are able to alter the
         *  current session journey to force changes such as:
         *
         *  - Going back
         *  - Going back and inserting new replies
         *  - Cancelling long Journeys
         *  - Undoing previous actions
         *  ...e.t.c
        */

        /** If this is a new session, then it means we don't have the any existing session
         *  which means that "$this->existing_session" is not set to anything. Since this
         *  is a new session we must force the creation of a new session record so that
         *  we can set that new session as the existing session. This will help us
         *  complete our Revisit Event.
         */
        if ($this->request_type == '1') {

            /** Create new session
             *
             *  This will render as: $this->createNewSession()
             *  while being called within a try/catch handler.
             */
            $createResponse = $this->tryCatch('createNewSession');

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($createResponse)) {
                return $createResponse;
            }

        } elseif ($this->request_type == '2') {

            /** Update existing session
             *
             *  This will render as: $this->updateExistingSessionDatabaseRecord()
             *  while being called within a try/catch handler.
             */
            $updateResponse = $this->tryCatch('updateExistingSessionDatabaseRecord');

        }

        //  Reset the level
        $this->level = 1;

        //  Reset the user reply message
        $this->msg = '';

        //  Empty the existing reply records (Again)
        $this->emptyReplyRecords();

        //  Fetch the existing session record from the database by force
        $this->existing_session = $this->getExistingSessionFromDatabase($force = true);

        /*
         *  Make a indication that we are revisting. Its important to note that when we are revisiting,
         *  we are actually re-handling the session again from scratch using the handleExistingSession()
         *  method which will build the App from the ground up. The problem we have is that whenever we
         *  have Events that are fired in order to reset some Global Variables we keep overiding these
         *  values since everytime we build an App we request Global Variables from the previous session.
         *  This becomes an issue since each time we revisit, we end up overiding our changed variables
         *  with information of variables from the previous session. We need to avoid getting the previous
         *  session variables immediately after we implement a "Revisit event". Assume that we have the
         *  following scenerio:
         *
         *  We launch our App, which in-fact triggers our logic to build the App by first creating a new
         *  session and fetching the last session Global Variables. These Global Variables will overide
         *  the current variables (if they are allowed to do so i.e if the global variable can use data
         *  saved in the database from previous session records). Lets say we have a variable called
         *  "token" currently set to "1234", and "token" is a global variable that can be saved in
         *  the database against the current session for later use by other future sessions.
         *
         *  Now lets say that we decide that we want to change this variable by using a "Formatting Event"
         *  which converts it from "1234" to NULL.
         *
         *  After this, we then decide to use a "Revisit Event" to go back to the home screen. This updates
         *  our current session with the new Global Variable "token" set to NULL. The "Revisit Event"
         *  causes us to run "$this->handleExistingSession()" which forces our App to re-build.
         *
         *  This triggers our logic (Again) to build the App, however we do not create a new session but
         *  instead use the existing session. We start fetching the last session Global Variables (which is
         *  not ideal for our case). These Global Variables from the previous session then overide the
         *  current session variables, which means we lose all the changes that we made before we fired the
         *  "Revisit Event". This means that the value of "token" which was previously "1234" will overide
         *  the new value which is set to NULL. As you can see we have a conflict whenever we use a "Revisit
         *  Event" since the values of the old session overide any potentially updated values. We can use the
         *  "is_revisting_session" variable to help us not to reload any Global Variables from the last session
         *  but target the current session Global Variables so that this way we never lose any of our changes.
         */
        $this->is_revisting_session = true;

        //  Handle existing session - Re-run the handleExistingSession()
        $response = $this->handleExistingSession();

        return $response;
    }

    /** This method checks if we need to SET or GET a notification.
     *  This notification
     */
    public function handle_Notification_Event()
    {
        if ($this->event) {

            /************************
             *  MESSAGE             *
             ***********************/

            //  Get the message
            $message = $this->event['event_data']['message'];

            //  Convert the "message" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($message);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output - Convert to [String]
            $message = $this->convertToString($outputResponse);

            /******************
             *  CAN EXPIRE    *
             *****************/

            //  Get the can expire status
            $can_expire = $this->event['event_data']['can_expire'];

            /*******************************
             *  EXPIRY DURATION NUMBER     *
             ******************************/

            //  Get the expiry duration number
            $expiry_duration_number = $this->event['event_data']['expiry_duration_number'];

            //  Convert the "expiry_duration_number" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($expiry_duration_number);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output - Convert to [Integer]
            $expiry_duration_number = (int) $outputResponse;

            /****************************
             *  EXPIRY DURATION TYPE    *
             ***************************/

            //  Get the expiry duration type
            $expiry_duration_type = $this->event['event_data']['expiry_duration_type'];

            /****************************
             *  DISPLAY SESSION TYPE    *
             ***************************/

            //  Get the display session type
            $display_session_type = $this->event['event_data']['display_session_type'];

            /************************
             *  CONTINUE TEXT       *
             ***********************/

            //  Get the message
            $continue_text = $this->event['event_data']['continue_text'];

            //  Convert the "continue_text" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($continue_text);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output - Convert to [String]
            $continue_text = $this->convertToString($outputResponse);

            //  Merge the message and continue text
            $message = $message."\n".($continue_text ?? '1. Ok');

            /***************************
             *  CALCULATE EXPIRY DATE  *
             **************************/

            $expiry_date = null;
            $expiry_duration_type_options = ['Seconds', 'Minutes', 'Days', 'Months'];

            if($can_expire) {

                if(is_int($expiry_duration_number) && in_array($expiry_duration_type, $expiry_duration_type_options)) {

                    $expiry_date = now();

                    if($expiry_duration_type == 'Seconds') {

                        $expiry_date = $expiry_date->addSeconds($expiry_duration_number);

                    }else if($expiry_duration_type == 'Minutes') {

                        $expiry_date = $expiry_date->addMinutes($expiry_duration_number);

                    }else if($expiry_duration_type == 'Days') {

                        $expiry_date = $expiry_date->addDays($expiry_duration_number);

                    }else if($expiry_duration_type == 'Months') {

                        $expiry_date = $expiry_date->addMonths($expiry_duration_number);

                    }

                }else{

                    if(!empty($expiry_duration_number) && !is_int($expiry_duration_number)) $this->logWarning('The notification expiry duration must be a number e.g 1, 2 or 3');
                    if(!empty($expiry_duration_type) && !in_array($expiry_duration_type, $expiry_duration_type_options)) $this->logWarning('The notification expiry duration type must be seconds, minutes, days or months');

                }

            }

            //  Create the notification message
            $this->create_notification_message($message, $display_session_type, $expiry_date);

        }
    }

    public function create_notification_message($message = null, $display_session_type = 'Same Session', $expiry_date = null)
    {
        if( $message ){

            $this->logInfo(
                'Saving notification with message: <br />'.
                '<div style="white-space: pre-wrap;" class="bg-white border rounded-md p-4 mt-2">'.
                    $this->wrapAsSuccessHtml($message).
                '</div>'
            );

            //  Update an existing notification or insert a new notification
            DB::table('session_notifications')->updateOrInsert(
                //  Search existing notification using the "session_id"
                ['session_id' => $this->session_id],

                //  Update/Create using the following information
                [
                    'display_session_type' => $display_session_type,
                    'ussd_account_id' => $this->ussd_account->id,
                    'version_id' => $this->version->id,
                    'session_id' => $this->session_id,
                    'expiry_date' => $expiry_date,
                    'app_id' => $this->app->id,
                    'message' => $message,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

        }
    }

    /** This method  gets the collection of events then
     *  runs through each event
     */
    public function handle_Event_Collection_Event()
    {
        if ($this->event) {

            /************************
             *  MESSAGE             *
             ***********************/

            //  Get the events from the event collection
            $events = $this->event['event_data']['events']['collection'];

            //  Start handling the given events
            return $this->handleEvents($events);

        }
    }

    /** This method terminates the current session
     */
    public function handle_Terminate_Session_Event()
    {
        if ($this->event) {

            /***************
             * MESSAGE     *
             ***************/

            //  Get the message
            $message = $this->event['event_data']['message'];

            //  Convert the "value" into its associated dynamic value
            $outputResponse = $this->convertValueStructureIntoDynamicData($message);

            //  If we have a screen to show return the response otherwise continue
            if ($this->shouldDisplayScreen($outputResponse)) {
                return $outputResponse;
            }

            //  Get the generated output - Convert to [String]
            $message = $this->convertToString($outputResponse);

            //  Set the event request type to terminate the session
            return $this->terminate_session($message);

        }
    }

    /** This method terminates the current session
     */
    public function terminate_session($message)
    {
        //  Set the event request type to terminate the session
        $this->event_request_type = '3';

        if(!empty($message)) {

            return $this->showCustomScreen($message);;

        }

        return null;
    }

    /******************************************
     *  REDIRECT EVENT METHODS                *
     *****************************************/

    /**
     *  This method creates, reads, updates and deletes database entries.
     *  Database entries are nuggests of information that can be created,
     *  retrieved, updated and deleted realtime.
     */
    public function handle_Database_Event()
    {
        if ($this->event) {

            //  Get the action
            $action = $this->event['event_data']['action'];

            //  Get the reference name
            $reference_name = $this->event['event_data']['reference_name'];

            //  Get the existence reference name
            $existence_reference_name = $this->event['event_data']['existence_reference_name'];

            //  If the reference name is not provided
            if( empty($reference_name) ) {

                $this->logWarning('The database entry reference name is required');

                //  Stop futher execution
                return;

            }

            //  Get the database entry (if exists)
            $database_entry = $this->getUssdDatabaseEntry($reference_name);

            if( empty($database_entry) ) {

                $this->logInfo('The database entry '.$this->wrapAsSuccessHtml($reference_name). ' does not exist');

            }else {

                $this->logInfo('The database entry '.$this->wrapAsSuccessHtml($reference_name). ' exists');

            }

            if( !empty($existence_reference_name) ) {

                //  Store the existence reference name and value
                $this->setProperty($existence_reference_name, !empty($database_entry));

            }

            //  If the database entry must be created or updated
            if( in_array($action, ['create', 'update', 'create_or_update', 'read_or_create']) ) {

                /****************************
                 * BUILD ADDITIONAL FIELDS  *
                 ***************************/

                $processed_fields = [];

                //  Get the additional fields dataset
                $additional_fields = $this->event['event_data']['additional_fields'];

                //  Foreach dataset value
                foreach ($additional_fields as $key => $field) {

                    /******************
                     * BUILD VALUE    *
                     ******************/

                    $name = $field['name'];
                    $value = $field['value'];

                    //  Convert the "field value" into its associated dynamic value
                    $outputResponse = $this->convertValueStructureIntoDynamicData($value);

                    //  If we have a screen to show return the response otherwise continue
                    if ($this->shouldDisplayScreen($outputResponse)) {
                        return $outputResponse;
                    }

                    //  Set the value to the output value
                    $value = $outputResponse;

                    //  If the value is empty
                    if( empty($value) ) {

                        $on_empty_active = $field['on_empty']['active'];
                        $on_empty_value = $field['on_empty']['value'];

                        //  If we can overide empty the empty value with its default value
                        if( $on_empty_active ) {

                            //  Convert the "field value" into its associated dynamic value
                            $outputResponse = $this->convertValueStructureIntoDynamicData($on_empty_value);

                            //  If we have a screen to show return the response otherwise continue
                            if ($this->shouldDisplayScreen($outputResponse)) {
                                return $outputResponse;
                            }

                            //  Set the value to the default value
                            $value = $outputResponse;

                        }

                    }

                    //  Add current processed value to the the processed values array
                    $processed_fields[$name] = $value;

                }

                //  Set the database entry data
                $data = [
                    'name' => $reference_name,
                    'app_id' => $this->app->id,
                    'metadata' => $processed_fields,
                    'version_id' => $this->version->id,
                    'ussd_account_id' => $this->ussd_account->id,
                ];

                //  If the database entry must be created
                if( $action == 'create' || $action == 'create_or_update' || $action == 'read_or_create' ) {

                    if( empty($database_entry) ) {

                        $this->logInfo('Attempting to create the following database entry '.$this->wrapAsSuccessHtml($reference_name));

                        /**
                         *  This will render as: $this->createDatabaseEntry($data)
                         *  while being called within a try/catch handler.
                         */
                        $outputResponse = $this->tryCatch('createDatabaseEntry', [$data]);

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($outputResponse)) {
                            return $outputResponse;
                        }

                        //  Get the database entry (Latest instance - After create)
                        $database_entry = $this->getUssdDatabaseEntry($reference_name, true);

                    }else{

                        if( $action == 'create' ) {

                            $this->logWarning('Could not create the database entry '.$this->wrapAsSuccessHtml($reference_name). ' because it already exists');

                        }else {

                            $this->logInfo('Could not create the database entry '.$this->wrapAsSuccessHtml($reference_name). ' because it already exists');

                        }

                    }

                }

                //  If the database entry must be updated
                if( $action == 'update' || $action == 'create_or_update' ) {

                    if( !empty($database_entry) ) {

                        $this->logInfo('Attempting to update the following database entry '.$this->wrapAsSuccessHtml($reference_name));

                        //  If we have existing database entry metadata and new database entry metadata
                        if (!empty($database_entry->metadata) && !empty($data['metadata'])) {

                            //  Get the storage approach
                            $update_approach = $this->event['event_data']['update_approach'];

                            /**
                             *  Replace existing variables (Delete variables stored in the database that do not appear on this list of variables)
                             */
                            if( $update_approach === 'replace' ) {

                                $this->logInfo('The database entry update is completely replacing existing database values');

                            /**
                             *  Merge with existing variables (Preserve variables stored in the database that do not appear on this list of variables)
                             */
                            }elseif( $update_approach === 'merge' ) {

                                $this->logInfo('The database entry update is merging the current values with existing database values');

                                $data['metadata'] = array_merge($database_entry->metadata, $data['metadata']);

                            }

                        }

                        /**
                         *  This will render as: $this->updateDatabaseEntry($database_entry, $data)
                         *  while being called within a try/catch handler.
                         */
                        $outputResponse = $this->tryCatch('updateDatabaseEntry', [$database_entry, $data]);

                        //  If we have a screen to show return the response otherwise continue
                        if ($this->shouldDisplayScreen($outputResponse)) {
                            return $outputResponse;
                        }

                        //  Get the database entry (Latest instance - After update)
                        $database_entry = $this->getUssdDatabaseEntry($reference_name, true);

                    }else{

                        if( $action == 'update' ) {

                            $this->logWarning('Could not update the database entry '.$this->wrapAsSuccessHtml($reference_name). ' because it does not exist');

                        }else {

                            $this->logInfo('Could not update the database entry '.$this->wrapAsSuccessHtml($reference_name). ' because it does not exist');

                        }

                    }

                }

            }

            //  If the database entry must be deleted
            if( $action == 'delete' ) {

                if( !empty($database_entry) ) {

                    $this->logInfo('Attempting to delete the following database entry '.$this->wrapAsSuccessHtml($reference_name));

                    //  Delete the database entry
                    $database_entry->delete();

                }else{

                    $this->logWarning('Could not delete the database entry '.$this->wrapAsSuccessHtml($reference_name). ' because it does not exist');

                }

            }

            //  If the database entry must be retrieved
            if( $action == 'read' || $action == 'read_or_create' ) {

                if( !empty($database_entry) ) {

                    $this->logInfo('Attempting to read the following database entry '.$this->wrapAsSuccessHtml($reference_name));

                }else{

                    $this->logWarning('Could not read the database entry '.$this->wrapAsSuccessHtml($reference_name). ' because it does not exist');

                }

            }

            //  Extract the database entry metadata if it exists
            $metadata = !empty($database_entry) ? $database_entry->metadata : null;

            //  Store the reference name and value
            $this->setProperty($reference_name, $metadata);

        }
    }

    public function createDatabaseEntry($data)
    {
        //  Convert metadata to json string
        $data['metadata'] = json_encode($data['metadata']);

        //  Set the dates
        $data['created_at'] = now();
        $data['updated_at'] = now();

        //  Create new database entry
        $database_entry = DB::table('database_entries')->insert($data);

        if ($database_entry) {

            $this->logInfo('Database entry created successfully');

        } else {

            $this->logWarning('Sorry, could not create database entry');

        }
    }

    public function updateDatabaseEntry($database_entry, $data)
    {
        //  Convert metadata to json string
        $data['metadata'] = json_encode($data['metadata']);

        //  Set the dates
        $data['updated_at'] = now();

        //  Update existing database entry
        $database_entry_updated = DB::table('database_entries')->where('id', $database_entry->id)->update($data);

        if ($database_entry_updated) {

            $this->logInfo('Database entry updated successfully');

        } else {

            $this->logWarning('Sorry, could not update database entry');

        }
    }

    public function getUssdDatabaseEntry($name, $viaQuery = false)
    {
        if( $viaQuery ) {

            //  Perform a query
            return $this->getUssdDatabaseEntryViaQuery($name);

        }else{

            //  Get the database entry matching the given mobile number, app id and mode
            return Cache::get((new DatabaseEntry())->getCacheName($this->ussd_account->id, $name), function () use ($name) {

                //  We failed to retrieve from the cache, therefore perform a query
                return $this->getUssdDatabaseEntryViaQuery($name);

            });

        }
    }

    public function getUssdDatabaseEntryViaQuery($name)
    {
        return (new DatabaseEntry())->findAndCache($this->ussd_account->id, $name);
    }

    /** This method converts a given value into a mathcing dynamic property. First it checks if
     *  the given value is a valid mustache tag. If it is a valid mustache tag, then we convert
     *  the given value into its dynamic value. If the value is not a valid mustache tag, then
     *  we search for nested mustache tags embedded within the given value. We replace each
     *  and every matching tag into its appropriate data variable.
     *
     *  If the value is immediately a valid mustage tag it can be directly converted and
     *  returned as a String, Integer, Boolean, Array or Object.
     *
     *  If the value is not immediately a valid mustache tag it can only be returned as
     *  a String with embedded mustache tags converted into their matching data values
     *
     *  Therefore:
     *
     *  "{{ products }}" can convert into a valid Array e.g
     *
     *  {{ products }} = [
     *      ['id' => 1, 'name' => 'Product 1'],
     *      ['id' => 2, 'name' => 'Product 2']
     *  ]
     *
     *  However "I love {{ products }}" will convert into a string with {{ products }}
     *  changed into its dynamic value which is then parsed into a string for rejoining
     *  with the string "I love " e.g
     *
     *  "I love [['id' => 1, 'name' => 'Product 1'],['id' => 2, 'name' => 'Product 2']]"
     */
    public function convertValueStructureIntoDynamicData($data)
    {
        /** $data contains three main properties e.g
         *
         *  $data = [
         *      'text' => '{{ products }}',
         *      'code_editor_text' => '<?php ?>',
         *      'code_editor_mode' => false
         *  ];.
         *
         *  text: This represents and normal string, a mustache tag or a normal string with
         *        a mustache tag embbeded within it
         *
         *  code_editor_text: This represents PHP code that must be processed
         *  code_editor_mode: This represents a true/false indication of whether the data
         *                    to proccess is embedded within the "text" property or the
         *                    "code_editor_text" property
         */
        $text = $data['text'];
        $code = $data['code_editor_text'];
        $code_editor_mode = $data['code_editor_mode'];

        //  If the content uses Code Editor Mode
        if ($code_editor_mode == true) {
            //  Process the PHP Code
            $outputResponse = $this->processPHPCode("$code");
        } else {
            //  If the text is set to "true"
            if ($text === true) {
                return true;

            //  If the text is set to "false"
            } elseif ($text === false) {
                return false;

            //  If the provided text is a valid mustache tag
            } elseif ($this->isValidMustacheTag($text, false)) {
                $mustache_tag = $text;

                // Convert the mustache tag into dynamic data
                $outputResponse = $this->convertMustacheTagIntoDynamicData($mustache_tag);

            //  If the provided value is not a valid mustache tag
            } else {
                //  Process dynamic content embedded within the text
                $outputResponse = $this->handleEmbeddedDynamicContentConversion($text);
            }
        }

        //  Return the build response
        return $outputResponse;
    }

    /** Validate if the given value uses valid mustache tag syntax
     */
    public function isValidMustacheTag($text = null, $log_warning = true)
    {
        //  If we have the text to verify
        if (!empty($text)) {
            //  If the text to verify is of type String
            if (is_string($text)) {
                //  Remove the (\u00a0) special character which represents a no-break space in HTML
                $text = $this->remove_HTML_No_Break_Space($text);

                //  Remove any HTML or PHP tags
                $text = strip_tags($text);

                //  Remove left and right spaces
                $text = trim($text);

                /** Detect Dynamic Variables
                 *
                 *  Pattern Meaning:.
                 *
                 *  ^ = Must start with the following rules listed below
                 *
                 *  [{]{2} = The string must have exactly 2 opening curly braces e.g {{ not that "{{{" or "({{" or "[{{" will also pass
                 *
                 *  [\s]* = The string may have zero or more occurences of spaces e.g "{{company" or "{{ company" or "{{   company"
                 *
                 *  [a-zA-Z_]{1} = The first character at this point must be a lowercase or uppercase alphabet or an underscrore (_)
                 *                 e.g "{{ c" or "{{ company" or "{{ _company" but deny "{{ 123" or "{{ 123_company" e.t.c
                 *
                 *  [a-zA-Z0-9_\.]{0,} = After the first character the string may have zero or more occurances of lowercase or uppercase
                 *             alphabets, numbers, underscores (_) and periods (.) e.g "{{ company_123" or "{{ company.name" e.t.c
                 *
                 *  [\s]* = The string may have zero or more occurences of spaces afterwards "{{ company" or "{{ company   " e.t.c
                 *
                 *  [}]{2} = The string must end with exactly 2 closing curly braces e.g }} not that "}}}" or "}})" or "}}]" will also pass
                 *
                 *  $ = Must end with the following rules listed above
                 */
                $pattern = "/^[{]{2}[\s]*[a-zA-Z_]{1}[a-zA-Z0-9_\.]{0,}[\s]*[}]{2}$/";

                //  Check if the given data passes validation
                if (preg_match($pattern, $text)) {
                    //  Return true to indicate that this is a valid mustache tag
                    return true;
                }
            }
        }

        //  If we should log a warning
        if ($log_warning == true) {
            //  Incase the value received is not a string
            if (!is_string($text)) {
                //  Get the text type wrapped in html tags
                $dataType = $this->wrapAsSuccessHtml($this->getDataType($text));

                $this->logWarning('The provided mustache tag is not a valid mustache tag syntax. Instead we received a value of type ['.$dataType.']');
            } else {
                $this->logWarning('The provided mustache tag "'.$this->wrapAsSuccessHtml($text).'" is not a valid mustache tag syntax');
            }
        }

        //  Return false to indicate that this is not a valid mustache tag
        return false;
    }

    /** Remove the (\u00a0) special character which represents a no-break space in HTML.
     *  This can cause issues since it can make valid mustache tags look invalid
     *  e.g convert "{{ \u00a0users }}" into "{{ users }}".
     */
    public function remove_HTML_No_Break_Space($text = '')
    {
        return preg_replace('/\xc2\xa0/', '', $text);
    }

    /** Convert the given mustache tag into a valid matching dynamic value
     *  e.g "{{ first_name }}" into "John".
     */
    public function convertMustacheTagIntoDynamicData($mustache_tag)
    {
        //  Convert "{{ products }}" into "$products"
        $outputResponse = $this->convertMustacheTagIntoPHPVariable($mustache_tag, true);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the converted variable
        $variable = $outputResponse;

        //  Convert the variable into its dynamic value e.g "$products" into "[ ['name' => 'Product 1', ...], ... ]"
        $outputResponse = $this->processPHPCode("return $variable;");

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        //  Get the generated output
        $output = $outputResponse;

        //  Get the output type wrapped in html tags
        $dataType = $this->wrapAsSuccessHtml($this->getDataType($output));

        //  Set an info log for the final conversion result
        $this->logInfo('Converted '.$this->wrapAsSuccessHtml($mustache_tag).' to ['.$dataType.']');

        //  Return the final output
        return $output;
    }

    /** Convert the given mustache tag into a valid PHP variable e.g
     *
     *  1) {{ users }} into $users
     *  2) {{ product.id }} into $product->id.
     *
     *  Note that adding the "$" sign to the variable name is optional
     */
    public function convertMustacheTagIntoPHPVariable($text = null, $add_sign = false)
    {
        //  If the text has been provided and is type of (String)
        if (!empty($text) && is_string($text)) {
            //  Remove the (\u00a0) special character which represents a no-break space in HTML
            $text = $this->remove_HTML_No_Break_Space($text);

            //  Remove any HTML or PHP tags
            $text = strip_tags($text);

            //  Replace all curly braces and spaces with nothing e.g convert "{{ company.name }}" into "company.name"
            $text = preg_replace("/[{}\s]*/", '', $text);

            //  Replace one or more occurences of the period with "." e.g convert "company..name" or "company...name" into "company.name"
            $text = preg_replace("/[\.]+/", '.', $text);

            //  Remove left and right spaces (If Any)
            $text = trim($text);

            //  Convert the dot syntaxt to array syntax e.g "company.details.name" into "company['details']['name']"
            $text = $this->convertDotSyntaxToArraySyntax($text);

            //  If we should add the PHP "$" sign
            if ($add_sign == true) {
                //  Append the $ sign to the begining of the result e.g convert "company->name" into "$company->name"
                $text = '$'.$text;
            }

            //  Return the converted text
            return $text;
        }

        return null;
    }

    public function convertDotSyntaxToArraySyntax($text)
    {
        //  Start with an empty result
        $result = '';

        //  If the text provided has a value
        if ($text) {
            /** This following process converts the given $text with dot notation
             *  syntax e.g "data.value.nested_value" into a valid array notation
             *  synataxt e.g "data['value']['nested_value']". The returned value
             *  is not an actual array but a string that maintains the proper
             *  written syntax of an array that must then be proccessed to
             *  get the actual value.
             */

            /** STEP 1
             *
             *  Convert $text = "data.value.nested_value" into ['data', 'value', 'nested_value'].
             */
            $properties = explode('.', $text);

            /* STEP 2
            *
            *  Iterate over the properties
            */
            for ($i = 0; $i < count($properties); ++$i) {
                /* STEP 3
                *
                *  Foreach property e.g "data", "value" or "nested_value" property
                */

                //  If this is the first property e.g "data"
                if ($i == 0) {
                    //  This sets the first element e.g "data"
                    $result = $properties[$i];
                } else {
                    //  This sets the follow-up elements e.g "data['value']" or "data['value']['nested_value']"
                    $result .= '[\''.$properties[$i].'\']';
                }
            }
        }

        //  Return the final result
        return $result;
    }

    /**
     *  Proccess and execute PHP Code
     */
    public function processPHPCode($__phpCode = 'return null', $__log_dynamic_data = true)
    {
       /**
        *   Use the try/catch handles incase we run into any possible errors
        *
        *   Notice the syntax of "__" on the variable names. This is because the key/value
        *   pairs returned by "$this->getDynamicData()" will be used to instantiate actual
        *   variables and their corresponding values. To avoid system conflicts with
        *   user provided variables, the system variables are named with using
        *   the "__" prefix convention.
        *
        *   Assume "__phpCode" was written as "phpCode" without the "__" prefix convention.
        *   While looping over the "$this->getDynamicData()" key/value pairs, we instantiate
        *   variables, therefore if the user provided a variable named "phpCode", then we risk
        *   a conflic. Lets say the "phpCode" passed as a parameter to this function has the
        *   following value:
        *
        *   $phpCode = 'return $ussd['msisdn'];';     -   Provided via the function parameter
        *
        *   Then we instantiate a variable with the same name
        *
        *   $phpCode = 1234;                          -   Instantiated via $this->getDynamicData()
        *
        *   This means that the "$phpCode = 1234" will overide the "$phpCode = 'return $ussd['msisdn'];';"
        *   This will cause an error while processing using eval($phpCode); since instead of running
        *   eval($ussd['msisdn']); we run eval(1234); which may cause an error such as:
        *
        *   "php syntax error, unexpected end of file"
        *
        *   This is because evaluating <?php return $ussd['msisdn']; ?> makes sense, however evaluating
        *   <?php 1234 ?> does not make much sense. However this is a fatal bug that can occur by when
        *   user variables overide important system variables.
        */
        $__dynamic_variables = [];

        //  If we have dynamic data
        if (count($this->getDynamicData())) {

            //  Create dynamic variables
            foreach ($this->getDynamicData() as $__key => $__value) {

                /*  Foreach dataset use the iterator key to create the dynamic variable name and
                    *  assign the iterator value as the new variable value.
                    *
                    *  Example:
                    *
                    *  $data = ['product' => 'Orange', 'quantity' => 3, 'price' => 450, ...e.tc];
                    *
                    *  Foreach dataset, we produce dynamic variables e.g
                    *
                    *  $product = 'Orange';
                    *  $quantity = 3;
                    *  $price = 450;
                    *
                    *  ... e.t.c
                    */
                ${$__key} = $__value;

                //  Set an info log for the created variable and its dynamic data value
                if ($__log_dynamic_data) {

                    //  Get the value type wrapped in html tags
                    $__dataType = $this->wrapAsSuccessHtml($this->getDataType($__value));

                    //  Get the variable for logs
                    array_push($__dynamic_variables, [
                        'name' => '$'.$__key,                 //  $first_name
                        'data_type' => $__dataType,           //  String
                        'value' => json_encode($__value),     //  John
                    ]);

                }

            }

        }

        if (count($__dynamic_variables)) {

            //  Log the available dynamic variables
            $this->logInfo('Getting dynamic variables', 'dynamic_variables', [
                'dynamic_variables' => $__dynamic_variables,
            ]);

        }

        //  Process dynamic content embedded within the code
        $__outputResponse = $this->handleEmbeddedDynamicContentConversion($__phpCode);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($__outputResponse)) {
            return $__outputResponse;
        }

        $__phpCode = $__outputResponse;

        //  Remove the PHP tags from the PHP Code (If Any)
        $__phpCode = $this->removePHPTags($__phpCode);

        //  Execute PHP Code
        return eval($__phpCode);
    }

    /**
     *  Check existence of PHP tags
     */
    public function hasPHPTags($code = '')
    {
        return $this->hasStartingPHPTags($code) && $this->hasEndingPHPTags($code);
    }

    /**
     *  Check existence of a single starting PHP tag
     */
    public function hasStartingPHPTags($code = '')
    {
        return preg_match("/^(<\?php){1}/i", $code) ? true : false;
    }

    /**
     *  Check existence of a single ending PHP tag
     */
    public function hasEndingPHPTags($code = '')
    {
        return preg_match("/(\?>){1}$/i", $code) ? true : false;
    }

    /** Remove PHP tags from the PHP Code
     */
    public function removePHPTags($code = '')
    {
        //  Remove PHP Tags
        $code = trim(preg_replace("/<\?php|\?>/i", '', $code));

        return $code;
    }

    /** Convert the given Object into a valid Array if its a
     *  valid Object otherwise return the original value.
     */
    public function convertObjectToArray($data)
    {
        if (is_object($data)) {
            $data = get_object_vars($data);
        }

        if (is_array($data)) {
            return array_map([$this, 'convertObjectToArray'], $data);
        } else {
            return $data;
        }
    }

    public function processActiveState($active_state)
    {
        //  If the active state property was found
        if ($active_state) {
            //  If the active status is set to yes
            if ($active_state['selected_type'] == 'yes') {
                //  Return true to indicate that the state is active
                return true;
            } elseif ($active_state['selected_type'] == 'no') {
                //  Return false to indicate that the state is not active
                return false;
            } elseif ($active_state['selected_type'] == 'conditional') {
                $code = $active_state['code'];

                //  Process the PHP Code
                $outputResponse = $this->processPHPCode("$code");

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                if ($outputResponse === true) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    /** Convert mustache tags embedded within the given string into their corresponding
     *  matching dynamic values. The final value returned is always of type String.
     */
    public function handleEmbeddedDynamicContentConversion($text = '')
    {
        //  Remove the (\u00a0) special character which represents a no-break space in HTML
        $text = $this->remove_HTML_No_Break_Space($text);

        //  Get all instances of mustache tags within the given text
        $result = $this->getInstancesOfMustacheTags($text);

        //  Get the total number of mustache tags found within the given text
        $number_of_mustache_tags = $result['total'];

        //  Get the mustache tags found within the given text
        $mustache_tags = $result['mustache_tags'];

        //  If we managed to detect one or more mustache tags
        if ($number_of_mustache_tags) {
            //  Foreach mustache tag we must convert it into a php variable
            foreach ($mustache_tags as $mustache_tag) {
                //  Convert "{{ company.name }}" into "$company->name"
                $dynamic_variable = $this->convertMustacheTagIntoPHPVariable($mustache_tag, true);

                //  Convert the dynamic property into its dynamic value e.g "$company->name" into "Company XYZ"
                $outputResponse = $this->processPHPCode("return $dynamic_variable;");

                //  If we have a screen to show return the response otherwise continue
                if ($this->shouldDisplayScreen($outputResponse)) {
                    return $outputResponse;
                }

                //  Get the generated output
                $output = $outputResponse;

                //  Incase the dynamic value is not a string, integer or float
                if (!is_string($output) && !is_integer($output) && !is_float($output)) {
                    //  Get the output type wrapped in html tags
                    $dataType = $this->wrapAsSuccessHtml($this->getDataType($output));

                    //  Use json_encode($value) to show $value data instead of getDataType($value)
                    $this->logInfo('Converting '.$this->wrapAsSuccessHtml($mustache_tag).' into ['.$dataType.']');
                } else {
                    //  Set an info log that we are converting the dynamic property to its associated value
                    $this->logInfo('Converting '.$this->wrapAsSuccessHtml($mustache_tag).' into '.$this->wrapAsSuccessHtml($output));
                }

                //  Use json_encode for any Object, Array, Boolean e.t.c in order to convert the output into a String format
                $output = $this->convertToString($output);

                //  Replace the mustache tag with its dynamic data e.g replace "{{ company.name }}" with "Company XYZ"
                $text = preg_replace("/$mustache_tag/", $output, $text);
            }
        }

        //  Return the converted text
        return $text;
    }

    public function getInstancesOfMustacheTags($text = '')
    {
        //  Remove the (\u00a0) special character which represents a no-break space in HTML
        $text = $this->remove_HTML_No_Break_Space($text);

        /** Detect Dynamic Variables
         *
         *  Pattern Meaning:.
         *
         *  [{]{2} = The string must have exactly 2 opening curly braces e.g {{ not that "{{{" or "({{" or "[{{" will also pass
         *
         *  [\s]* = The string may have zero or more occurences of spaces e.g "{{company" or "{{ company" or "{{   company"
         *
         *  [a-zA-Z_]{1} = The first character at this point must be a lowercase or uppercase alphabet or an underscrore (_)
         *                 e.g "{{ c" or "{{ company" or "{{ _company" but deny "{{ 123" or "{{ 123_company" e.t.c
         *
         *  [a-zA-Z0-9_\.]{0,} = After the first character the string may have zero or more occurances of lowercase or uppercase
         *             alphabets, numbers, underscores (_) and periods (.) e.g "{{ company_123" or "{{ company.name" e.t.c
         *
         *  [\s]* = The string may have zero or more occurences of spaces afterwards "{{ company" or "{{ company   " e.t.c
         *
         *  [}]{2} = The string must end with exactly 2 closing curly braces e.g }} not that "}}}" or "}})" or "}}]" will also pass
         */
        $pattern = "/[{]{2}[\s]*[a-zA-Z_]{1}[a-zA-Z0-9_\.]{0,}[\s]*[}]{2}/";

        $total_results = preg_match_all($pattern, $text, $results);

        /*
         * The "$total_results" represents the number of matched mustache tags e.g
         *
         * $total_results = 3;
         *
         * The "$results[0]" represents an array of the matched mustache tags
         *
         * $results[0] = [
         *      "{{ company.name }}",
         *      "{{ company.branches.total }}",
         *      "{{ company.details.contacts.phone }}",
         *      ... e.t.c
         *  ];
         */
        return ['total' => $total_results, 'mustache_tags' => $results[0]];
    }

    public function convertToString($data = '')
    {
        //  If the given data is not a string
        if (!is_string($data)) {

            //  If the data is an array, object or bool
            if (is_array($data) || is_object($data) || is_bool($data)) {

                $data = json_encode($data);

            }

            //  Cast data into a string format
            $data = (string) $data;

        }

        //  Return data without HTML or PHP tags
        return strip_tags($data);
    }

    public function convertToInteger($data = 0)
    {
        /** This will render as: $this->convertToString($data)
         *  while being called within a try/catch handler.
         */
        $outputResponse = $this->tryCatch('convertToString', [$data]);

        //  If we have a screen to show return the response otherwise continue
        if ($this->shouldDisplayScreen($outputResponse)) {
            return $outputResponse;
        }

        return floatval($outputResponse);
    }

    /** This method gets the validation rule and callback. The callback represents the name of
     *  the validation function that we must run to validate the current input target. Since
     *  we allow custom Regex patterns for custom validation support, we must perform this under
     *  a try/catch incase the provided custom Regex pattern is invalid. This will allow us to
     *  catch any emerging error and be able to use the handleFailedValidation() in order to
     *  display the fatal error message and additional debugging details.
     */
    public function tryCatch($callback, $callback_params = [])
    {
        /*  Run the custom function here.
            *
            *  The $callback is the method/function that we must run to e.g
            *
            *  If $callback = 'custom_method_1'
            *
            *  Then this will call "$this->custom_method_1()"
            *
            *  The $callback_params represents an array of values that must be passed to the
            *  method/function to become the method/function arguments e.g
            *
            *  If $callback_params = ['value_1', 'value_2', ...]
            *
            *  Then this will allow for "$this->custom_method_1('value_1', 'value_2', ...)"
            *
            *  The result will be a custom function that will be run within the try/catch
            *  block to catch any bad exceptions that may be triggered
            *
            */

        return call_user_func_array([$this, $callback], $callback_params);
    }

    /** This method is used to handle errors caught during try-catch screnerios.
     *  It logs the error, indicates that an error occured and returns null.
     */
    public function handleTryCatchError($error)
    {
        //  Record fatal error
        $this->fatal_error = true;

        //  Record fatal message (Get a maximum of 1000 characters if the error message is too long)
        $this->fatal_error_msg = Str::limit($error->getMessage(), UssdSession::FATAL_ERROR_MSG_MAX_CHARACTERS);

        //  Set an error log
        $this->logError('Error:  '.$error->getMessage());

        //  Show the technical difficulties error screen to notify the user of the issue
        return $this->showTechnicalDifficultiesErrorScreen();
    }

    /**********************
     *  LOGGING METHODS   *
     **********************/

    /** This method is used to log information about the USSD
     *  application build process.
     */
    public function logInfo($description = '', $data_type = null, $data = null)
    {
        $this->addLog(['type' => 'info', 'description' => $description, 'data_type' => $data_type, 'data' => $data]);
    }

    /** This method is used to log warnings about the USSD
     *  application build process.
     */
    public function logWarning($description = '', $data_type = null, $data = null)
    {
        $this->addLog(['type' => 'warning', 'description' => $description, 'data_type' => $data_type, 'data' => $data]);
    }

    /** This method is used to log errors about the USSD
     *  application build process.
     */
    public function logError($description = '', $data_type = null, $data = null)
    {
        $this->addLog(['type' => 'error', 'description' => $description, 'data_type' => $data_type, 'data' => $data]);
    }

    /** This method is used to add a log
     */
    public function addLog($data)
    {
        //  Get the mobile log saving approach (never, always, on_fail, on_success)
        $mobileSaveApproach = $this->version->builder['log_settings']['mobile']['save_logs'];

        //  Get the simulator log saving approach (never, always, on_fail, on_success)
        $simulatorSaveApproach = $this->version->builder['log_settings']['simulator']['save_logs'];

        //  Get the save approach (never, always, on_fail, on_success)
        $saveApproach = $this->test_mode ? $simulatorSaveApproach : $mobileSaveApproach;

        $weShouldAlwaysSaveLogs = $saveApproach == 'always';
        $weShouldOnlySaveLogsOnFail = $saveApproach == 'on_fail' && $this->fatal_error == true;
        $weShouldOnlySaveLogsOnSuccess = $saveApproach == 'on_success' && $this->fatal_error == false;
        $weShouldReturnSimulatorLogs = $this->test_mode && $this->version->builder['simulator']['debugger']['return_logs'];

        //  Check if we are required to capture the log
        if( $weShouldAlwaysSaveLogs || $weShouldOnlySaveLogsOnFail || $weShouldOnlySaveLogsOnSuccess || $weShouldReturnSimulatorLogs ) {

            //  Set additional information
            $data['level'] = $this->level ?? null;
            $data['screen'] = $this->screen['name'] ?? null;
            $data['display'] = $this->display['name'] ?? null;

            //  If the description is an Array, convert to Json Object
            if(gettype($data['description']) === 'array') {
                $data['description'] = json_encode($data['description']);
            }

            //  If we want to capture summarized logs
            if( !$this->test_mode || ($this->test_mode && $this->version->builder['simulator']['debugger']['return_summarized_logs']) ) {

                /** When setting logs, its important to note that some logs are very repetitive
                 *  e.g logs of variable values and data types. This information may be necessary
                 *  during real-time debugging of the application since it gives additional insights
                 *  during the application build process, however it results in a huge dataset of logs
                 *  that may even size up to 1mb. This might not be ideal information to save directly
                 *  to the database as it will require huge amounts of storage. Imagine 2 million users
                 *  dial to request a session and each session contains logs that size up to 1mb, that
                 *  would mean we would need 2 million megabytes of storage (i.e 2TB) to store all that
                 *  information for just that moment in time. To reduce this insane size, we can push
                 *  only important logs to a variable called "summarized_logs". This variable will
                 *  only get logs that are essential for storage in the database session record.
                 */
                $excluded_datatypes = ['dynamic_variables'];

                if (!in_array($data['data_type'], $excluded_datatypes)) {

                    //  Push the latest log update
                    array_push($this->summarized_logs, $data);

                }

            //  If we want to capture detailed logs
            }else{

                //  Push the latest log update
                array_push($this->logs, $data);

            }

        }
    }

    /*******************************
     *  SCREEN DETECTING METHODS   *
     ******************************/

    /** Check if the given content indicates if this is a continuing
     *  screen. This means that the user will be able to make a
     *  reply to continue the session.
     */
    public function isContinueScreen($text = '')
    {
        if (is_string($text) && !empty($text)) {
            //  If the first 3 characters of the text match the word "CON" then this is a continuing screen
            return  (substr($text, 0, 3) == 'CON') ? true : false;
        }

        return false;
    }

    /** Check if the given content indicates if this is an ending
     *  screen. This means that the user will not be able to make
     *  a reply. The session will have been closed.
     */
    public function isEndScreen($text = '')
    {
        if (is_string($text) && !empty($text)) {
            //  If the first 3 characters of the text match the word "END" then this is an ending screen
            return  (substr($text, 0, 3) == 'END') ? true : false;
        }

        return false;
    }

    /** Check if the given content indicates if this is a redirecting
     *  screen. This means that we will be redirecting the user to
     *  the provided Service Code.
     */
    public function isRedirectScreen($text = '')
    {
        if (is_string($text) && !empty($text)) {
            //  If the first 3 characters of the text match the word "RED" then this is a redirecting screen
            return  (substr($text, 0, 3) == 'RED') ? true : false;
        }

        return false;
    }

    /** Check if the given content indicates if this is a timeout
     *  screen. This means that the user's session has ended due
     *  to a delayed response.
     */
    public function isTimeoutScreen($text = '')
    {
        if (is_string($text) && !empty($text)) {
            //  If the first 3 characters of the text match the word "TIM" then this is a timeout screen
            return  (substr($text, 0, 3) == 'TIM') ? true : false;
        }

        return false;
    }

    /** Check if the given content indicates if this is a screen
     */
    public function shouldDisplayScreen($text = '')
    {
        //  If the given text is a valid String
        if (is_string($text)) {
            //  Check if the current text represents any given screen
            return ($this->isContinueScreen($text) ||
                    $this->isRedirectScreen($text) ||
                    $this->isTimeoutScreen($text) ||
                    $this->isEndScreen($text))
                    ? true : false;
        }

        return false;
    }

    /**************************
     *  SHOW SCREEN METHODS   *
     **************************/

    /**
     *  This is the screen displayed when we want to end the session.
     */
    public function showEndScreen($message = '')
    {
        $response = 'END '.$message;

        return trim($response);
    }

    /** This is the screen displayed when we want to still continue the session.
     *  We therefore display the custom message.
     */
    public function showCustomScreen($message = '', $options = [])
    {
        $default_options = [
            'continue' => true,
            'use_line_breaker' => true,
            'show_go_back' => false,
        ];

        $options = array_merge($default_options, $options);

        $response = $options['continue'] ? 'CON ' : 'END ';
        $response .= $message;
        $response .= $options['use_line_breaker'] ? "\n" : '';
        $response .= $options['show_go_back'] ? '0. Back' : '';

        return trim($response);
    }

    /** This is the screen displayed when a problem was encountered and but we want
     *  to still continue the session. We therefore display the custom error
     *  message but also display the option to go back.
     */
    public function showCustomGoBackScreen($message = '', $options = [])
    {
        $default_options = [
            'show_go_back' => true,
        ];

        $options = array_merge($default_options, $options);

        $response = $this->showCustomScreen($message, $options);

        return $response;
    }

    /** This is the screen displayed when we have experienced technical difficulties
     *  and we want to end the session with a general error message.
     */
    public function showTechnicalDifficultiesErrorScreen()
    {
        return $this->showEndScreen($this->default_technical_difficulties_message);
    }

    /** This is the screen displayed when the USSD session times out
     */
    public function showTimeoutScreen($timeout_message)
    {
        return 'TIM '.$timeout_message;
    }

    /** This is the screen displayed when we want to redirect the current
     *  session to another USSD Service Code.
     */
    public function showRedirectScreen($service_code)
    {
        return 'RED '.$service_code;
    }

    /********************************
     *  SPECIAL DEVELOPER METHODS   *
     *******************************/

    /** Count the number of times that the user responded
     *  to a given screen based on the provided screen id.
     */
    public function getTotalScreenResponses($screen_id = null)
    {
        //  If the screen id provided is not null and is a valid string
        if (!is_null($screen_id) && is_string($screen_id)) {
            //  If we have recorded screens
            if (count($this->screen_total_responses)) {
                //  If we have the total number of responses to the screen set
                if (isset($this->screen_total_responses[$screen_id])) {
                    //  Return the total number of responses to the screen
                    return $this->screen_total_responses[$screen_id];
                }
            }
        }

        return 0;
    }

    /** Determine is the user has responded to a specific screen
     */
    public function hasRespondedToScreen($screen_id = null)
    {
        return $this->getTotalScreenResponses($screen_id) ? true : false;
    }

    /** Count the number of times that the user responded to
     *  a given display based on the provided display id.
     */
    public function getTotalDisplayResponses($display_id = null)
    {
        //  If the display id provided is not null and is a valid string
        if (!is_null($display_id) && is_string($display_id)) {
            //  If we have recorded displays
            if (count($this->display_total_responses)) {
                //  If we have the total number of responses to the display set
                if (isset($this->display_total_responses[$display_id])) {
                    //  Return the total number of responses to the display
                    return $this->display_total_responses[$display_id];
                }
            }
        }

        return 0;
    }

    /** Determine is the user has responded to a specific display
     */
    public function hasRespondedToDisplay($display_id = null)
    {
        return $this->getTotalDisplayResponses($display_id) ? true : false;
    }

    /** Determine is the user has responded to the current level screen or display
     */
    public function hasResponded()
    {
        //  Check if the user has already responded to the current display screen
        return $this->completedLevel($this->level);
    }

}
