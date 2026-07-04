# Monitoring overlay (Grafana Alloy + exporters) — Phase 10

Push-model monitoring: exporters bound to the internal compose network, scraped
by **Grafana Alloy**, which pushes metrics to **Grafana Cloud** over HTTPS/443.
Nothing new is exposed to the internet. Aligns with `docs/monitoring-setup.md`.

## What it watches (→ the "Unknown Error")

| Exporter | Signals |
|----------|---------|
| `php-fpm-exporter` (`app:9000/fpm-status`) | active processes, **listen queue**, **max children reached**, slow requests — the #1 thing to watch |
| `mysqld-exporter` (`mysql:3306`) | `Threads_connected` vs `max_connections`, aborts, InnoDB waits, slow queries |
| `node-exporter` (host) | CPU, load, memory/swap, disk I/O, **open FDs**, TCP socket states |
| `nginx-exporter` (`nginx/nginx-status`) | request rate, active connections, 5xx |

The stack already exposes `/fpm-status` (docker/php/www.conf) and `/nginx-status`
(docker/nginx/default.conf, allowed from the compose subnet).

## Run

```bash
cp docker/monitoring/.env.monitoring.example docker/monitoring/.env.monitoring   # fill in Grafana Cloud creds
docker compose \
  -f docker-compose.yml \
  -f docker/monitoring/docker-compose.monitoring.yml \
  up -d
```

Alloy's own UI: `http://<host>:12345` (component graph / debug). Dashboards live
in Grafana Cloud — enable the **Linux Server**, **MySQL**, and **php-fpm**
integrations for ready-made dashboards, then build the "USSD Spike" overview
(FPM active/queue, MySQL connections, host CPU/load, 5xx, error logs on one axis).

## mysqld-exporter DB user

Created automatically on a fresh MySQL data dir (`docker/mysql/initdb/02-monitoring-user.sql`).
On an already-running stack, create it once:

```bash
docker compose exec -T mysql mysql -uroot -proot -e \
  "CREATE USER IF NOT EXISTS 'exporter'@'%' IDENTIFIED BY 'exporter' WITH MAX_USER_CONNECTIONS 3;
   GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%'; FLUSH PRIVILEGES;"
```

Change the password in both the SQL and `.env.monitoring` for anything real.

## Logs (optional)

Uncomment the `loki.source.docker` block in `alloy/config.alloy` and the
docker.sock mount in the compose file to ship container stdout/stderr to Grafana
Cloud Loki — then line error timestamps up against the metric spikes.

## On the real box (AWS / Orange)

Same idea, but Alloy typically runs as a host systemd service scraping localhost
exporters (per `docs/monitoring-setup.md`), or this overlay runs alongside the
app compose. Keep `.env.monitoring` out of git; inject creds via the deploy.
