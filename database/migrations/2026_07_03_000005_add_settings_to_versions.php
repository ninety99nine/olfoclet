<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * File 02 Problem 2 — version-level settings store.
 *
 * Holds simulator/test config, session timeout settings, and appearance/UI
 * annotations that used to live inside the builder JSON, so they can be edited
 * independently of (and without re-saving/repairing) the large builder.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('versions', function (Blueprint $table) {
            $table->json('settings')->nullable()->after('builder');
        });
    }

    public function down(): void
    {
        Schema::table('versions', function (Blueprint $table) {
            $table->dropColumn('settings');
        });
    }
};
