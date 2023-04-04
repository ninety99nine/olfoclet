<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('session_notifications', function (Blueprint $table) {

            $table->increments('id');

            /*  Session Notifications Details  */
            $table->unsignedInteger('ussd_account_id');
            $table->string('session_id')->nullable();
            $table->string('type')->nullable();
            $table->text('message')->nullable();
            $table->text('metadata')->nullable();
            $table->boolean('showing_notification')->default(false);

            /*  Ownership Information  */
            $table->unsignedInteger('app_id')->nullable();
            $table->unsignedInteger('version_id')->nullable();

            /*  Indexes  */
            $table->index(['session_id']);
            $table->index(['ussd_account_id']);

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
        Schema::dropIfExists('session_notifications');
    }
}
