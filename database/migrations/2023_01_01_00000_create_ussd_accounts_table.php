<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUssdAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ussd_accounts', function (Blueprint $table) {

            $table->increments('id');

            /*  Ussd Account Details  */
            $table->string('msisdn')->nullable();
            $table->boolean('test')->nullable()->default(false);

            /*  Ownership Information  */
            $table->unsignedInteger('user_id')->nullable();

            /*  Indexes  */
            $table->index(['msisdn', 'test', 'user_id']);

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
        Schema::dropIfExists('ussd_accounts');
    }
}
