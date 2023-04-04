<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirtimeBillingTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('airtime_billing_tokens', function (Blueprint $table) {

            $table->id();
            $table->unsignedInteger('msisdn');
            $table->string('access_token');
            $table->timestamp('expiry_date');
            $table->timestamps();

            /*  Indexes  */
            $table->index(['msisdn']);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('airtime_billing_tokens');
    }
}
