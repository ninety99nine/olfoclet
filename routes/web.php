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

use smpp\SMPP;
use App\Services\Sms\SmsBuilder;

//  Send sms
Route::get('/sms', function() {
    $ip_address = '192.168.50.159';
    $timeout = 10000;
    $port = '10000';
    $sender = 'OQ';

    $send = request()->input('send');
    $username = 'smsobw262';
    $password = 'b0n@k062';
    $recipient = '26772882239';
    $message = 'Hello';

    if($send == '1') {

        /**
         *  The sender, address, port, username, password and timeout values
         *
         *  The sender must be the name of the sender from which the SMS is coming from e.g "Company A".
         *  Note that the sender must only contain 11 or less characters otherwise and error will occur.
         *
         *  I used an SMPP package form: https://github.com/alexandr-mironov/php-smpp
         *  to implement this sms sending feature.
         *
         *  The custom SmsBuilder is located in App\Services, and i did a minor change
         *  to this file to allow the sender to be provided as part of the constructor
         *  parameters instead of being globally set.
         */
        try {

            (new SmsBuilder($sender, $ip_address, $port, $username, $password, $timeout))
                ->setRecipient($recipient, SMPP::TON_INTERNATIONAL)
                ->sendMessage($message);

        } catch (\Exception $e) {

            //  Handle try catch error
            throw $e;

        }

    }else{

        return [
            'username' => $username,
            'password' => $password,
            'recipient' => $recipient,
            'message' => $message,
        ];
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

    $projects = App\Models\Project::with(['apps.versions.accounts'])->get();

    foreach($projects as $project) {
        foreach($project->apps as $app) {
            foreach($app->versions as $version) {
                foreach($version->accounts as $account) {
                    DB::table('ussd_account_connections')
                        ->where('ussd_account_id', $account->id)
                        ->where('version_id', $version->id)
                        ->update([
                            'project_id' => $project->id,
                            'version_id' => $version->id,
                            'app_id' => $app->id
                        ]);
                }
            }
        }
    }

    $sessions = UssdSession::with(['account.connections'])->get();

    foreach($sessions as $session) {

        $connection = collect($session->account->connections)->filter(function($connection) use ($session) {
            return $connection->ussd_account_id === $session->ussd_account_id && $connection->version_id === $session->version_id;
        })->first();

        if( $connection ) {

            $session->where('id', $session->id)->update([
                'ussd_account_connection_id' => $connection->id
            ]);

        }
    }

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
