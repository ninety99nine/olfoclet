<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * File 01 Problem 10 — archive table for old sessions.
 *
 * Mirrors ussd_sessions exactly (CREATE TABLE ... LIKE) so the scheduled
 * `sessions:archive` command can move rows older than 90 days out of the hot
 * table, keeping scans + buffer pool fast as the table grows into the millions.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE TABLE IF NOT EXISTS ussd_sessions_archive LIKE ussd_sessions');
    }

    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS ussd_sessions_archive');
    }
};
