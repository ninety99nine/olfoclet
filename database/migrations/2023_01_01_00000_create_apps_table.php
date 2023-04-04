<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('apps', function (Blueprint $table) {

            $table->increments('id');

            /*  Project Information  */
            $table->string('name', 30);
            $table->string('description', 500)->nullable();
            $table->boolean('online')->default(false);
            $table->string('offline_message', 120)->nullable();

            /*  Version Information  */
            $table->unsignedInteger('active_version_id')->nullable();

            /*  Project Information  */
            $table->unsignedInteger('project_id')->nullable();

            /*  Delete Information  */
            $table->char('confirmation_code', 6)->nullable();

            /*  Soft Delete Timestamp (deleted_at)  */
            $table->softDeletes();

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
        Schema::dropIfExists('apps');
    }
}
