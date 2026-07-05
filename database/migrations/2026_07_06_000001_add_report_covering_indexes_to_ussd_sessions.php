<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reports aggregate per account: MAX(updated_at) / MIN(created_at) grouped by
 * ussd_account_id over ~1.23M accounts, dozens of times per dashboard load. Without
 * a covering index MySQL reads the row for every session (measured ~2.8s/query on
 * the box). A composite (ussd_account_id, <time>) index lets MySQL compute the
 * per-account MIN/MAX straight from the ordered index — measured ~0.2s/query (14x).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'updated_at'], 'idx_sess_acct_updated');
            $table->index(['ussd_account_id', 'created_at'], 'idx_sess_acct_created');
        });
    }

    public function down(): void
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropIndex('idx_sess_acct_updated');
            $table->dropIndex('idx_sess_acct_created');
        });
    }
};
