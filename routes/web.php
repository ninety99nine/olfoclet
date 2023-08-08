<?php

use App\Http\Controllers\GlobalVariableController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\UssdAccountsController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\SimulationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\VersionController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\AppController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use App\Models\UssdSession;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
use GuzzleHttp\Client;

// Send SMS
Route::get('/sms-using-rest', function () {

    //////////////////////////
    /// GENERATE SMS TOKEN ///
    //////////////////////////

    // Create a new Guzzle
    $client = new Client();

    try {

        $tokenEndpoint = 'https://aas.orange.co.bw:443/token';

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
        $response = $client->post($tokenEndpoint, [
            'headers' => [
                'Authorization' => 'Basic Uk9lRzRVMTFwYTlCOGVpbnRlT1JOTHI4dUVnYTplcDg0bDFCMmNWbGRlVjhZMzdVc0pMRE1Peklh',
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'form_params' => [
                'grant_type' => 'client_credentials'
            ]
        ]);

        $statusCode = $response->getStatusCode();
        $responseData = json_decode($response->getBody(), true);

        // Handle the response as needed
        if ($statusCode === 200) {

            $accessToken = $responseData['access_token'];

            /////////////////////
            /// SEND THE SMS ///
            ////////////////////

            $smsEndpoint = 'https://aas-bw.com.intraorange:443/smsmessaging/v1/outbound/tel%3A%2B26712345/requests';

            $response = $client->post($smsEndpoint, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Content-Type' => 'application/json',
                    'accept' => 'application/json'
                ],
                'json' => [
                    'outboundSMSMessageRequest' => [
                        'address' => ['tel:+26712345'],
                        'senderAddress' => 'tel:+26712345', // will be displayed if senderName is not included
                        'senderName' => 'Bonako',           // any string of choice
                        'outboundSMSTextMessage' => [
                            'message' => 'Hello world.'
                        ],
                        'clientCorrelator' => 'cf9d467d-2131-4280-b996-dddc5eb70eb2' // a unique id
                    ]
                ]
            ]);

            $statusCode = $response->getStatusCode();
            $responseData = json_decode($response->getBody(), true);

            // Handle the response as needed
            if ($statusCode === 201) {
                // SMS sent successfully
                return response()->json(['message' => 'SMS sent successfully']);
            } else {
                // Handle the error
                return response()->json(['error' => 'Failed to send SMS'], $statusCode);
            }


        } else {

            // Handle the error
            return ['error' => 'Failed to acquire token', 'status_code' => $statusCode];

        }


    } catch (GuzzleHttp\Exception\GuzzleException $e) {

        // Handle any exceptions that occurred during the API call
        return response()->json(['error' => 'Failed to acquire token: ' . $e->getMessage()], 500);

    }

});

//  ChatGPT
Route::get('/chatgpt', function() {

    /*
    $response = Http::withoutVerifying()
        ->withHeaders([
            'Authorization' => 'Bearer ' . env('CHATGPT_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            "messages" => [
                [
                    "role" => "system",
                    "system" => "Your name is Bonako Sales and you are an expert sales consultant assisting businesses in Botswana"
                ]
                [
                    "role" => "user",
                    "content" => "How can i start a business in Botswana?"
                ]
            ],
            "model" => "gpt-3.5-turbo",
            "max_tokens" => 500,
            "temperature" => 0.7
        ]);

    return $response->json()['choices'][0]['text'];
    */

    $response = Http::withoutVerifying()
        ->withHeaders([
            'Authorization' => 'Bearer ' . env('CHATGPT_API_KEY'),
            'Content-Type' => 'application/json',
        ])->get('https://api.openai.com/v1/models');

    return $response->json();
});

Route::get('/fix', function(){

    $projects = App\Models\Project::with(['apps.versions'])->get();

    foreach($projects as $project) {
        foreach($project->apps as $app) {
            foreach($app->versions as $version) {
                $version->builder = $version->repairBuilder($version->builder);
                $version->save();
            }
        }
    }

    return 'Completed Successfully!';

});

Route::redirect('/', '/login', 301);
Route::get('/login', [LoginController::class, 'show'])->name('login.show');
Route::post('/login', [LoginController::class, 'authenticate'])->name('login.authenticate');

Route::get('/register', [RegisterController::class, 'show'])->name('register.show');
Route::post('/register', [RegisterController::class, 'create'])->name('register.create');

Route::post('/logout', [LogoutController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {

    //  Projects
    Route::controller(ProjectController::class)
        ->prefix('trashed-projects')
        ->group(function () {
            Route::get('/', 'index')->name('trashed.projects.show');
        });

    //  Projects
    Route::controller(ProjectController::class)
        ->prefix('projects')
        /**
         *  Scope bindings will instruct laravel to fetch the child relationship via
         *  the parent relatcionship e.g "projects/{project}/versions/{version}" will
         *  make sure that the {version} must be a resource related to the {project}
         *  provided.
         *
         *  Refer to: https://laravel.com/docs/9.x/routing#implicit-model-binding-scoping
         */
        ->scopeBindings()
        ->group(function () {

            Route::get('/', 'index')->name('projects.show');
            Route::post('/', 'create')->name('projects.create');

            //  Project
            Route::prefix('/{project}')->group(function () {

                Route::name('project.')->group(function () {
                    Route::put('/', 'update')->name('update');
                    Route::delete('/', 'delete')->name('delete');
                    Route::post('/restore', 'restore')->name('restore');
                    Route::get('/apps', 'show')->name('show.with.apps');
                    Route::get('/trashed-apps', 'show')->name('show.with.trashed.apps');

                    //  Project Sessions
                    Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.show');

                    //  Project Accounts
                    Route::get('/accounts', [UssdAccountsController::class, 'index'])->name('accounts.show');

                    //  Project Global Variables
                    Route::get('/global-variables', [GlobalVariableController::class, 'index'])->name('global.variables.show');
                });

                //  Apps
                Route::controller(AppController::class)
                    ->prefix('apps')
                    ->group(function () {

                    Route::post('/', 'create')->name('apps.create');

                    //  App
                    Route::prefix('/{app}')->group(function () {

                        Route::name('app.')->group(function () {
                            Route::put('/', 'update')->name('update');
                            Route::delete('/', 'delete')->name('delete');
                            Route::post('/restore', 'restore')->name('restore');
                            Route::get('/versions', 'show')->name('show.with.versions');
                            Route::get('/trashed-versions', 'show')->name('show.with.trashed.versions');

                            //  App Sessions
                            Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.show');

                            //  App Accounts
                            Route::get('/accounts', [UssdAccountsController::class, 'index'])->name('accounts.show');

                            //  App Global Variables
                            Route::get('/global-variables', [GlobalVariableController::class, 'index'])->name('global.variables.show');
                        });

                        //  Versions
                        Route::controller(VersionController::class)
                            ->prefix('versions')
                            ->group(function () {

                            Route::post('/', 'create')->name('versions.create');

                            //  Version
                            Route::prefix('/{version}')->group(function () {

                                Route::name('version.')->group(function () {
                                    Route::get('/', 'show')->name('show');
                                    Route::put('/', 'update')->name('update');
                                    Route::delete('/', 'delete')->name('delete');
                                    Route::post('/repair', 'repair')->name('repair');
                                    Route::post('/restore', 'restore')->name('restore');

                                    //  Version Sessions
                                    Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.show');
                                    Route::get('/sessions/{ussd_session}', [SessionController::class, 'show'])->name('session.show');

                                    //  Version Accounts
                                    Route::controller(UssdAccountsController::class)
                                        ->prefix('accounts')
                                        ->group(function () {

                                        Route::get('/', 'index')->name('accounts.show');

                                        Route::prefix('/{ussd_account}')->name('account.')->group(function () {
                                            Route::get('/', 'show')->name('show');
                                            Route::get('/sessions', 'show')->name('sessions.show');
                                            Route::get('/notifications', 'show')->name('notifications.show');
                                            Route::get('/database-entries', 'show')->name('database.entries.show');
                                            Route::get('/global-variables', 'show')->name('global.variables.show');
                                        });

                                    });

                                    //  Version Global Variables
                                    Route::controller(GlobalVariableController::class)
                                        ->prefix('global-variables')
                                        ->group(function () {

                                        Route::get('/', 'index')->name('global.variables.show');

                                        Route::prefix('/{global_variable}')->name('global.variable.')->group(function () {
                                            Route::get('/', 'show')->name('show');
                                            Route::put('/', 'update')->name('update');
                                        });

                                    });

                                });

                                //  Sessions
                                /*
                                Route::controller(SessionController::class)
                                    ->prefix('sessions')
                                    ->group(function () {

                                    Route::get('/', 'index')->name('sessions.show');

                                    Route::prefix('/{ussd_session}')->name('session.')->group(function () {

                                        Route::get('/', 'show')->name('show');
                                        Route::delete('/', 'delete')->name('delete');

                                    });

                                });

                                //  Notifications
                                Route::controller(NotificationController::class)
                                    ->prefix('notifications')
                                    ->group(function () {

                                    Route::get('/', 'index')->name('notifications.show');

                                    Route::prefix('/{notification}')->name('notification.')->group(function () {

                                        Route::get('/', 'show')->name('show');
                                        Route::delete('/', 'delete')->name('delete');

                                    });

                                });

                                //  Database Entries
                                Route::controller(DatabaseEntryController::class)
                                    ->prefix('database-entries')
                                    ->group(function () {

                                    Route::get('/', 'index')->name('database.entries.show');

                                    Route::prefix('/{database_entry}')->name('database.entry.')->group(function () {

                                        Route::get('/', 'show')->name('show');
                                        Route::put('/', 'update')->name('update');
                                        Route::delete('/', 'delete')->name('delete');

                                    });

                                });

                                //  Global Variables
                                Route::controller(GlobalVariableController::class)
                                    ->prefix('global-variables')
                                    ->group(function () {

                                    Route::get('/', 'index')->name('global.variables.show');

                                    Route::prefix('/{global_variable}')->name('global.variable.')->group(function () {

                                        Route::get('/', 'show')->name('show');
                                        Route::put('/', 'update')->name('update');
                                        Route::delete('/', 'delete')->name('delete');

                                    });

                                });

                                //  Analytics
                                Route::controller(ReportController::class)
                                    ->prefix('analytics')
                                    ->group(function () {

                                    Route::get('/', 'index')->name('analytics.show');

                                });
                                */

                            });

                        });

                    });

                });

            });

        });

    //  Sessions
    Route::controller(SessionController::class)
        ->prefix('sessions')
        ->group(function () {
            Route::get('/', 'index')->name('sessions.show');
        });

    //  Accounts
    Route::controller(UssdAccountsController::class)
        ->prefix('accounts')
        ->group(function () {
            Route::get('/', 'index')->name('accounts.show');
        });

    //  Global Variables
    Route::controller(GlobalVariableController::class)
        ->prefix('global-variables')
        ->group(function () {
            Route::get('/', 'index')->name('global.variables.show');
        });

    //  Reports
    Route::controller(ReportController::class)
        ->prefix('reports')
        ->group(function () {
            Route::get('/', 'index')->name('reports.show');
        });

    //  Settings
    Route::controller(ProjectController::class)
        ->prefix('settings')
        ->name('settings.')
        ->group(function () {

            Route::get('/account', [SettingController::class, 'index'])->name('account');
            Route::post('/account', [SettingController::class, 'updateAccount'])->name('account.update');

            Route::get('/server-commands', [SettingController::class, 'index'])->name('server.commands');
            Route::post('/server-commands', [SettingController::class, 'runServerCommands'])->name('server.commands.run');

            Route::get('/server-status', [SettingController::class, 'index'])->name('server.status');
            Route::post('/server-status', [SettingController::class, 'checkServerStatus'])->name('server.status.check');


            Route::get('/users', [SettingController::class, 'index'])->name('users');
            Route::get('/notifications', [SettingController::class, 'index'])->name('notifications');

            Route::get('/server-logs', [SettingController::class, 'index'])->name('server.logs');
            Route::get('/server-logs/{file_name}', [SettingController::class, 'downloadLogFile'])->name('server.logs.download');

            Route::get('/enviroment-configurations', [SettingController::class, 'index'])->name('enviroment.configurations');
            Route::post('/enviroment-configurations', [SettingController::class, 'updateEnviroment'])->name('enviroment.configurations.update');

        });

    /**
     *  The below routes are used by the USSD Simulator (Test sessions)
     */
    Route::post('/launch/ussd/simulation', [SimulationController::class, 'launchUssd'])->name('launch.ussd.simulation');
    Route::post('/{session_id}/stop/ussd/simulation', [SimulationController::class, 'stopUssd'])->name('stop.ussd.simulation');

});
