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

# ---- 2. Guard: repair `id` columns missing AUTO_INCREMENT ----------------
# A DB restored from a defective dump can lose the PRIMARY KEY + AUTO_INCREMENT
# on `id` columns across MANY tables. Two failure modes: `migrate` dies
# recording its bookkeeping row, and — more insidiously — every runtime INSERT
# (a new USSD session, etc.) throws "Field 'id' doesn't have a default value".
# Detect + repair every affected base table idempotently BEFORE migrating.
# Generated from information_schema so it covers the whole class, not just
# `migrations`. (See docs/EXECUTION_PLAN.md cross-cutting risks.)
REPAIR_SQL=$(mysql_cli -N -e "
  SELECT CONCAT('ALTER TABLE \`', c.table_name, '\` ',
    CASE WHEN COALESCE(pk.cnt,0)=0 THEN 'ADD PRIMARY KEY (\`id\`), ' ELSE '' END,
    'MODIFY \`id\` ', c.column_type, ' NOT NULL AUTO_INCREMENT;')
  FROM information_schema.columns c
  JOIN information_schema.tables t
    ON t.table_schema=c.table_schema AND t.table_name=c.table_name AND t.table_type='BASE TABLE'
  LEFT JOIN (
    SELECT table_name, COUNT(*) cnt FROM information_schema.statistics
    WHERE table_schema='${DB_DATABASE}' AND index_name='PRIMARY' AND column_name='id'
    GROUP BY table_name
  ) pk ON pk.table_name=c.table_name
  WHERE c.table_schema='${DB_DATABASE}' AND c.column_name='id'
    AND c.extra NOT LIKE '%auto_increment%';" 2>/dev/null)
if [ -n "$REPAIR_SQL" ]; then
    log "repairing id columns missing AUTO_INCREMENT:"
    echo "$REPAIR_SQL"
    printf '%s\n' "$REPAIR_SQL" | mysql_cli --force 2>&1 || true
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
