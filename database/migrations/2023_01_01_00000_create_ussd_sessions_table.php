<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUssdSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ussd_sessions', function (Blueprint $table) {

            $table->increments('id');

            /*  Session Information  */
            $table->unsignedInteger('ussd_account_id');
            $table->unsignedInteger('ussd_account_connection_id');
            $table->string('session_id')->nullable();
            $table->string('service_code')->nullable();
            $table->string('type')->default('shared');
            $table->string('request_type')->default(1);
            $table->string('text')->nullable();
            $table->mediumText('reply_records')->nullable();
            $table->mediumText('inputs_and_outputs')->nullable();
            $table->mediumText('logs')->nullable();
            $table->timestamp('logs_expire_at')->nullable();
            $table->boolean('fatal_error')->nullable()->default(false);
            $table->text('fatal_error_msg')->nullable();
            $table->boolean('allow_timeout')->nullable()->default(0);
            $table->timestamp('timeout_at')->nullable();
            $table->unsignedMediumInteger('total_session_duration')->default(0);
            $table->text('session_execution_times')->nullable();

            /*  Ownership Information  */
            $table->unsignedInteger('project_id')->nullable();
            $table->unsignedInteger('app_id')->nullable();
            $table->unsignedInteger('version_id')->nullable();

            /*  Indexes  */
            $table->index(['ussd_account_id']);
            $table->index(['project_id', 'app_id', 'version_id']);

            /*  Timestamps  */
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ussd_sessions');
    }
}
