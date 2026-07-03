<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * File 01 Problem 6 — hot-path indexes.
 *
 * Converts the per-request `WHERE session_id = ?` lookup from a full scan of the
 * ussd_sessions table into an indexed ref, and covers the global-variable and
 * notification lookups that run on every request.
 *
 * PRODUCTION: run off-peak — the ussd_sessions ALTER briefly locks the table
 * (~30-120s on the live ~500k-row table). Use pt-online-schema-change for the
 * ussd_sessions indexes if traffic cannot be interrupted; the small tables can
 * use plain migrate.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->index('session_id', 'idx_ussd_sessions_session_id');
            $table->index('created_at', 'idx_ussd_sessions_created_at');
        });

        Schema::table('global_variables', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'app_id'], 'idx_gv_account_app');
            $table->index(['ussd_account_id', 'version_id'], 'idx_gv_account_version');
        });

        Schema::table('session_notifications', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'marked_as_seen'], 'idx_sn_account_seen');
        });
    }

    public function down(): void
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropIndex('idx_ussd_sessions_session_id');
            $table->dropIndex('idx_ussd_sessions_created_at');
        });

        Schema::table('global_variables', function (Blueprint $table) {
            $table->dropIndex('idx_gv_account_app');
            $table->dropIndex('idx_gv_account_version');
        });

        Schema::table('session_notifications', function (Blueprint $table) {
            $table->dropIndex('idx_sn_account_seen');
        });
    }
};
