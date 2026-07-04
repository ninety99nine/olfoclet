-- Read-only user for the Phase 10 mysqld-exporter (harmless if monitoring is
-- unused). Runs only on a FRESH mysql data dir; on an existing stack create it
-- manually (see docker/monitoring/README.md). Password must match
-- MONITORING_DB_PASSWORD in .env.monitoring.
CREATE USER IF NOT EXISTS 'exporter'@'%' IDENTIFIED BY 'exporter' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';
FLUSH PRIVILEGES;
