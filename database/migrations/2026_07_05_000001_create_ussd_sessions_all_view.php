<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * A read-only UNION view over the hot table + the archive, so history/analytics
 * readers (Sessions list, session detail, Reports) see the FULL retention window
 * (24h live + up to 3 months archived) while the USSD runtime + all writes keep
 * using the small, fast base `ussd_sessions` table.
 *
 * NOTE: `SELECT *` freezes the column list at view-creation time. If the
 * ussd_sessions schema changes (add/drop a column), this view must be recreated
 * (drop + this migration re-run, or a follow-up migration). The archive table is
 * created `LIKE ussd_sessions`, so the two branches always share column order.
 *
 * Perf: MySQL 8.0.22+ derived-condition-pushdown pushes the outer WHERE into each
 * UNION branch, so filtered/paginated reads still use each table's indexes.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE OR REPLACE VIEW ussd_sessions_all AS
            SELECT * FROM ussd_sessions
            UNION ALL
            SELECT * FROM ussd_sessions_archive');
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS ussd_sessions_all');
    }
};
