#!/bin/sh
# Telcoflo V1 app container entrypoint. Runs on the `app` (php-fpm) service only;
# `queue`/`scheduler` clear the entrypoint and just run their command, so exactly
# one container performs migrations/caching (no race).
set -e

DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
DB_DATABASE="${DB_DATABASE:-telcoflo}"

log() { echo "[entrypoint] $*"; }

# ---- 1. Wait for the database to accept connections ----------------------
log "waiting for database ${DB_HOST}:${DB_PORT} ..."
until php -r '$h=getenv("DB_HOST")?:"mysql"; $p=(int)(getenv("DB_PORT")?:3306); exit(@fsockopen($h,$p,$e,$s,1)?0:1);'; do
    sleep 2
done
log "database is up."

mysql_cli() {
    MYSQL_PWD="${DB_PASSWORD}" mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USERNAME}" "${DB_DATABASE}" "$@"
}

# ---- 2. Guard: migrations table AUTO_INCREMENT ---------------------------
# A DB restored from a partial/manual dump can lose the migrations.id
# AUTO_INCREMENT + PRIMARY KEY, which makes `migrate` apply the schema change
# then die inserting its bookkeeping row. Detect + repair idempotently before
# migrating. (See docs/EXECUTION_PLAN.md cross-cutting risks.)
if mysql_cli -N -e "SHOW TABLES LIKE 'migrations';" 2>/dev/null | grep -q migrations; then
    EXTRA=$(mysql_cli -N -e "SELECT EXTRA FROM information_schema.columns WHERE table_schema='${DB_DATABASE}' AND table_name='migrations' AND column_name='id';" 2>/dev/null || echo "")
    case "$EXTRA" in
        *auto_increment*) : ;;
        *)
            log "repairing migrations.id (missing AUTO_INCREMENT/PK) ..."
            mysql_cli -e "ALTER TABLE migrations MODIFY id INT UNSIGNED NOT NULL;" 2>/dev/null || true
            mysql_cli -e "ALTER TABLE migrations ADD PRIMARY KEY (id);" 2>/dev/null || true
            mysql_cli -e "ALTER TABLE migrations MODIFY id INT UNSIGNED NOT NULL AUTO_INCREMENT;" 2>/dev/null || true
            ;;
    esac
fi

# ---- 3. App key (fallback only — normally set in .env.docker) -------------
if [ -z "${APP_KEY}" ]; then
    log "APP_KEY empty; generating an ephemeral key (set one in .env.docker for stable sessions across containers)."
    export APP_KEY="base64:$(head -c 32 /dev/urandom | base64)"
fi

# ---- 4. Rebuild the package manifest -------------------------------------
# composer ran with --no-scripts (for build-cache reasons), so the auto-discovery
# manifest was never generated. Build it before any provider-booting command.
log "discovering packages ..."
php artisan package:discover --ansi

# ---- 5. Migrate ----------------------------------------------------------
log "running migrations ..."
php artisan migrate --force

# ---- 6. Optional one-time File 03 converter ------------------------------
if [ "${RUN_UPGRADE_BUILDERS}" = "true" ]; then
    log "running ussd:upgrade-builders --backup ..."
    php artisan ussd:upgrade-builders --backup || log "converter reported issues (continuing)."
fi

# ---- 7. Caches + storage link --------------------------------------------
log "caching config + routes ..."
php artisan config:cache
php artisan route:cache
php artisan storage:link 2>/dev/null || true

log "boot complete; handing off to: $*"
exec "$@"
