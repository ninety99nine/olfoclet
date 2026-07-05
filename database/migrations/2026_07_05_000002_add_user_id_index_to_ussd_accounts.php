<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * `SimulationController::launchUssd` (test_mode / simulator only) closes a user's
 * other open sessions by joining `ussd_sessions` to `ussd_accounts` on
 * `ussd_accounts.user_id = ?`. `user_id` is only the 3rd column of the existing
 * (msisdn, test, user_id) index, so filtering by it alone forces a FULL INDEX
 * SCAN of every account (EXPLAIN: rows ≈ 1.23M). A standalone `user_id` index lets
 * it SEEK the user's accounts instead. Non-blocking online DDL on MySQL 8.
 *
 * (Production gateway dials are not test_mode and never run this query — this only
 * speeds up the builder/simulator.)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ussd_accounts', function (Blueprint $table) {
            $table->index('user_id', 'idx_ussd_accounts_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('ussd_accounts', function (Blueprint $table) {
            $table->dropIndex('idx_ussd_accounts_user_id');
        });
    }
};
