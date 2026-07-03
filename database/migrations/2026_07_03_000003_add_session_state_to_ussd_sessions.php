<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * File 01 Problem 20 — session-state fast path.
 *
 * Nullable column caching the RAW responses of the application on-start REST API
 * events (the "Get User" / "Create User" calls) captured on the first request,
 * so continuation requests serve those from cache instead of re-hitting the
 * network on every keystroke — while the on-start events still run normally and
 * recompute all derived data. Backward compatible: existing sessions have NULL
 * and simply make the calls as before.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->mediumText('session_state')->nullable()->after('session_execution_times');
        });
    }

    public function down(): void
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropColumn('session_state');
        });
    }
};
