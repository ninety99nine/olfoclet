<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAirtimeBillingPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('airtime_billing_payments', function (Blueprint $table) {
            $table->id();
            $table->string('msisdn_to_bill');
            $table->boolean('is_prepaid_account');
            $table->boolean('has_enough_funds');
            $table->decimal('amount_to_bill', 8, 2, true);
            $table->decimal('funds_before_deduction', 8, 2);
            $table->decimal('funds_after_deduction', 8, 2);
            $table->boolean('success_status');

            $table->char('currency', 3);
            $table->string('product_id');
            $table->string('service_id');
            $table->string('description');
            $table->string('on_behalf_of');
            $table->string('purchase_category_code');
            $table->string('response_reference_name');

            $table->unsignedInteger('ussd_account_id')->index();
            $table->string('ussd_session_id')->index();
            $table->unsignedInteger('version_id')->index();
            $table->unsignedInteger('project_id')->index();
            $table->unsignedInteger('app_id')->index();

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
        Schema::dropIfExists('airtime_billing_payments');
    }
}
