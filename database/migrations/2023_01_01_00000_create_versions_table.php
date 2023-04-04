<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVersionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('versions', function (Blueprint $table) {

            $table->increments('id');

            /*  Version Information  */
            $table->decimal('number', 6, 2)->default(1.00)->nullable();
            $table->string('description', 500)->nullable();

            /*  Feature Information */
            $table->json('features')->nullable();

            /*  Builder Information */
            $table->json('builder')->nullable();

            /*  Ownership Information  */
            $table->unsignedInteger('app_id')->nullable();

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
        Schema::dropIfExists('versions');
    }
}
