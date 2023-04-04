<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSharedShortCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shared_short_codes', function (Blueprint $table) {

            $table->increments('id');

            /*  Shared Service Code Information  */
            $table->string('code')->nullable();

            /*  Indexes  */
            $table->index('code');

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
        Schema::dropIfExists('shared_short_codes');
    }
}
