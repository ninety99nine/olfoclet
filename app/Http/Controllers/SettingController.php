<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Symfony\Component\Process\Process;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\Process\Exception\ProcessFailedException;

class SettingController extends BaseController
{
    protected $phpCommands = [
        'deploy',
        'git log',
        'git pull',
        'composer install',
        'truncate laravel.log',
    ];

    protected $artisanCommands = [
        'config:cache',
        'config:cache',
        'config:clear',
        'cache:clear',
        'route:clear',
        'route:cache',
        'migrate'
    ];

    public function index()
    {
        $data = [];

        if( request()->routeIs('settings.server.logs') ) {

            $data['fileNames'] = [
                'Laravel Logs' => collect($this->getLaravelLogs())->pluck('name')->toArray(),
                'MYSQL Logs' => collect($this->getMysqlLogs())->pluck('name')->toArray(),
                'NGINX Logs' => collect($this->getNginxLogs())->pluck('name')->toArray(),
                'Site Logs' => collect($this->getSiteLogs())->pluck('name')->toArray(),
                'Supervisor Logs' => collect($this->getSupervisorLogs())->pluck('name')->toArray()
            ];

        }elseif( request()->routeIs('settings.server.commands') ) {

            $data['commands'] = [
                ...$this->phpCommands,
                ...$this->artisanCommands,
            ];

        }elseif( request()->routeIs('settings.enviroment.configurations') ) {

            $data['enviromentFile'] = file_get_contents(base_path('.env'));

        }

        return Inertia::render('Settings/index', $data);
    }

    public function updateAccount()
    {
        $validator = Validator::make(request()->all(), [
            'curr_password' => ['current_password'],
            'new_password' => ['required', 'confirmed', Password::min(6)]
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        auth()->user()->update([
            'password' => bcrypt($data['new_password'])
        ]);

        return redirect()->route('settings.account');
    }

    public function updateEnviroment()
    {
        $validator = Validator::make(request()->all(), [
            'enviromentFile' => ['required']
        ], [
            'enviromentFile.required' => 'The enviroment file must contain configuration values'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        file_put_contents(base_path('.env'), $data['enviromentFile']);

        return redirect()->route('settings.enviroment.configurations');
    }

    public function runServerCommands()
    {
        $validator = Validator::make(request()->all(), [
            'command' => ['required', 'string']
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();

        $command = $data['command'];
        $phpPath = '/usr/bin/php7.4'; // Run the command "whereis php" on the ubuntu server to see the php installation location
        $process = null;

        if( in_array($command, $this->artisanCommands) || in_array($command, $this->phpCommands) ) {

            /**
             *  Navigate to the application root folder and execute the command.
             *  Since this is a sudo command, we need to echo the server user
             *  password.
             */
            if(in_array($command, ['deploy'])) {

                /**
                 *  Deployment Explained:
                 *  ---------------------
                 *
                 *  1. The the "sh" command is used to specify that the file being loaded is a "Shell Script".
                 *  This helps the Process() method to know how to process the script, since this could be any
                 *  other kind of file e.g "PHP", "HTML", "PYTHON", e.t.c.
                 *
                 *  2. The script path is the fully qualified path to the deployment script that we want to run
                 *
                 *  3. The base_path() method is used to specify the exact working directory to execute the script
                 *  commands. In this case the base_path() returns the fully qualified path to the application's
                 *  root directory so execute the commands from there.
                 *
                 *  4. The run() command will run the deploy.sh script and pass the array as variables to be
                 *  accessed from the deploy.sh script. This allows us to set the configurations here and
                 *  then pass them to the script for processing.
                 *
                 *  ---------------------
                 *
                 *  This deployment script requires that we provide the php path (PHP_PATH)
                 *  which can be found by running the <?php phpinfo(); ?> script, then refer to
                 *  the part about "Environment", then looking to the next row after the "PATH"
                 *  variable, which is a variable called "_", and this variable contains the
                 *  PHP location e.g
                 *
                 *  "/opt/homebrew/bin/php"
                 *
                 *  This value is different on the local development computer vs the actual production server.
                 *  Rather than hard-coding this php path, I prefered using a PHP Constant called PHP_BINARY
                 *  which was suggested on the following stackoverflow issue:
                 *
                 *  Reference #1 (Stackoverflow): https://stackoverflow.com/questions/18656678/how-to-get-path-of-the-php-binary-on-server-where-it-is-located
                 *  Reference #2 (Php Manual): https://www.php.net/manual/en/reserved.constants.php
                 */
                $scriptPath = base_path('app/Services/Deployment/deploy.sh');
                $process = new Process(['sh', $scriptPath], base_path());

                /**
                 *  Possible Improvement:
                 *  ---------------------
                 *
                 *  We could check if we are on production and run shell_exec('php-fmp -v'); to acquire the
                 *  installed php-fmp version. However running this command on a development server e.g
                 *  a Mac laptop, returns "null". Therefore for now i have created a configuration
                 *  variable to hold this value. This can be adjusted from the .env file.
                 */
                $process->run(null, [
                    'PHP_FPM' => config('PHP_FPM_INSTALLED'),   //  Adjust to the php-fpm version (Confirm with server)
                    'PHP_PATH' => $phpPath,
                    'BRANCH' => 'master',
                ]);

            }elseif(in_array($command, ['git log'])) {

                /*
                 *  Log the last 10 commits
                 */
                $process = new Process(['sudo git log'], base_path());
                $process->run();

            }elseif(in_array($command, ['git pull'])) {

                $process = new Process(['sudo git pull origin master'], base_path());
                $process->run();

            }elseif(in_array($command, ['truncate laravel.log'])) {

                $process = new Process(['truncate', '-s', '0', base_path('app/storage/logs/laravel.log')], base_path());
                $process->run();

            }elseif(in_array($command, ['composer install'])) {

                /**
                 *  If this function returns an error such as "Command not found", then you may need
                 *  to provide the fully qualified path to the composer.phar file instead of just
                 *  referencing the global "composer"
                 */
                $process = new Process(['composer', 'install', '--no-interaction', '--prefer-dist', '--optimize-autoloader', '--no-dev'], base_path());
                $process->run();

            }else{

                /**
                 *  Since we are running artisan commands, we need to reference the fully qualified
                 *  path of the PHP-CLI to avoid issues regarding the "Command not found" problem.
                 */
                $process = new Process([$phpPath, 'artisan', $command], base_path());
                $process->run();

            }

            //  If the process is set and running
            if( !is_null($process) ) {

                /**
                 *  Lets check if the script was executed successfully
                 */
                if ( !$process->isSuccessful() ) {

                    //  If the execution failed, lets throw the error
                    throw new ProcessFailedException($process);

                }

                //  Otherwise lets return the output response
                return $process->getOutput();

            }

        }
    }

    public function checkServerStatus()
    {
        $commandClusters = [
            'Versions' => [
                'PHP Version' => [
                    'desc' => null,
                    'exe' => [PHP_BINARY, '-v'],
                ],
                'MYSQL Version' => [
                    'desc' => null,
                    'exe' => ['mysql', '-V'],
                ],
                'PHP FPM Version' => [
                    'desc' => null,
                    'exe' => ['php-fpm', '-v'],
                ],
            ],
            'Services' => [
                'ALL Services' => [
                    'desc' => 'The [+] indicates a running service while the [-] indicates a stopped service.'."\n".'Services managed by Upstart will appear on the list but marked with a ?',
                    'exe' => ['service', '--status-all']
                ],
                'NGINX Service' => [
                    'desc' => null,
                    'exe' => ['service', 'nginx', 'status'],
                ],
                'MYSQL Service' => [
                    'desc' => null,
                    'exe' => ['service', 'mysql', 'status'],
                ],
                'CRON Service' => [
                    'desc' => null,
                    'exe' => ['service', 'cron', 'status'],
                ],
                'Supervisor Service' => [
                    'desc' => null,
                    'exe' => ['service', 'supervisor', 'status'],
                ],
            ],
            'Firewall' => [
                'UFW Status - Server Firewall' => [
                    'desc' => null,
                    'exe' => ['ufw', 'status']
                ]
            ]
        ];

        $response = [];

        foreach($commandClusters as $clusterName => $commandCluster) {

            foreach($commandCluster as $commandName => $command) {

                /**
                 *  Run the command to acquire the service status
                 */
                $process = new Process($command['exe'], base_path());
                $process->run();

                /**
                 *  Lets check if the script was executed successfully
                 */
                if ( $process->isSuccessful() ) {

                    //  Otherwise lets return the output response
                    $response[$clusterName][$commandName] = [
                        'message' => $process->getOutput(),
                        'description' => $command['desc']
                    ];

                }else{

                    //  If the execution failed, lets throw the error
                    $error = new ProcessFailedException($process);

                    //  If the execution failed, lets throw the error
                    $response[$clusterName][$commandName] = [
                        'message' => $error->getMessage(),
                        'description' => $command['desc']
                    ];

                }

            }

        }

        return $response;
    }

    public function downloadLogFile($file_name)
    {
        $siteLogs = $this->getSiteLogs();
        $nginxLogs = $this->getNginxLogs();
        $mysqlLogs = $this->getMysqlLogs();
        $lavelLogs = $this->getLaravelLogs();
        $supervisorLogs = $this->getSupervisorLogs();

        $file = collect([...$lavelLogs, ...$siteLogs, ...$mysqlLogs, ...$nginxLogs, ...$supervisorLogs])->firstWhere('name', $file_name);

        if( $file ) {

            return response()->download($file['path']);     //  return response()->download(storage_path('logs/laravel.log'));

        }else{

            return redirect()->route('settings.server.logs')->withErrors([
               'file' => 'The file "'.$file_name.'" cannot be downloaded'
            ]);

        }
    }

    /**
     *  @param $path example /Users/juliantabona/Downloads/*.log
     */
    public function getLogs($path)
    {
        //  Get the Laravel log file paths
        $filePaths = glob($path);

        //  Get the Laravel log file names and file paths
        return collect($filePaths)->map(function($filePath) {
            return [
                'name' => basename($filePath),
                'path' => $filePath
            ];
        })->toArray();
    }

    public function getLaravelLogs()
    {
        return $this->getLogs(base_path('storage/logs/*.log'));
    }

    public function getMysqlLogs()
    {
        return [
            ...$this->getLogs('/var/log/mysql/*.log'),      //  error.log
            ...$this->getLogs('/var/log/mysql/*.log.*'),    //  error.log.1
            ...$this->getLogs('/var/log/mysql/*.gz')        //  error.gz
        ];
    }

    public function getSiteLogs()
    {
        return [
            ...$this->getLogs('/var/log/*.log'),      //  ufw.log or php7.4-fpm.log
            ...$this->getLogs('/var/log/*.log.*'),    //  ufw.log.1 or php7.4-fpm.log.1
            ...$this->getLogs('/var/log/*.gz')        //  ufw.gz or php7.4-fpm.gz
        ];
    }

    public function getNginxLogs()
    {
        return [
            ...$this->getLogs('/var/log/nginx/*.log'),      //  error.log or access.log
            ...$this->getLogs('/var/log/nginx/*.log.*'),    //  error.log.1 or access.log.1
            ...$this->getLogs('/var/log/nginx/*.gz')        //  error.gz or access.gz
        ];
    }

    public function getSupervisorLogs()
    {
        return [
            ...$this->getLogs('/var/log/supervisor/*.log'),     //  supervisord.log
            ...$this->getLogs('/var/log/supervisor/*.log.*'),   //  supervisord.log.1
            ...$this->getLogs('/var/log/supervisor/*.gz')       //  supervisord.gz
        ];
    }
}
