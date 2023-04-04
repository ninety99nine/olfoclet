<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShortCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('short_codes', function (Blueprint $table) {

            $table->increments('id');

            /*  Service Code Information  */
            $table->string('shared_code')->nullable();
            $table->string('dedicated_code')->nullable();

            /*  Ownership Information  */
            $table->unsignedInteger('app_id')->nullable();
            $table->unsignedInteger('shared_short_code_id')->nullable();

            /*  Indexes  */
            $table->index('shared_code');
            $table->index('dedicated_code');

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
        Schema::dropIfExists('short_codes');
    }
}
