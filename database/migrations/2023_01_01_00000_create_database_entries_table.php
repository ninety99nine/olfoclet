<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDatabaseEntriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('database_entries', function (Blueprint $table) {

            $table->increments('id');

            /*  Database Entry Details  */
            $table->unsignedInteger('ussd_account_id');
            $table->string('name')->nullable();
            $table->text('metadata')->nullable();

            /*  Ownership Information  */
            $table->unsignedInteger('app_id')->nullable();
            $table->unsignedInteger('version_id')->nullable();

            /*  Indexes  */
            $table->index(['ussd_account_id', 'name']);

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
        Schema::dropIfExists('database_entries');
    }
}
