<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The Reports dashboard counts distinct accounts per project / app / version:
 * COUNT(DISTINCT ussd_account_id) GROUP BY <dimension>_id over ussd_account_connections.
 * ussd_account_connections only had single-column indexes (ussd_account_id, version_id),
 * so the DISTINCT-per-dimension had to look the account up for every row. These composite
 * (dimension, account) indexes let the aggregation read straight from an ordered index.
 *
 * The active/inactive connection variants join ussd_sessions on ussd_account_connection_id,
 * which was UN-indexed on ussd_sessions — add that too so the join is a seek, not a scan.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ussd_account_connections', function (Blueprint $table) {
            $table->index(['project_id', 'ussd_account_id'], 'idx_conn_project_acct');
            $table->index(['app_id', 'ussd_account_id'], 'idx_conn_app_acct');
            $table->index(['version_id', 'ussd_account_id'], 'idx_conn_version_acct');
        });

        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->index('ussd_account_connection_id', 'idx_sess_conn');
        });
    }

    public function down(): void
    {
        Schema::table('ussd_account_connections', function (Blueprint $table) {
            $table->dropIndex('idx_conn_project_acct');
            $table->dropIndex('idx_conn_app_acct');
            $table->dropIndex('idx_conn_version_acct');
        });

        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropIndex('idx_sess_conn');
        });
    }
};
