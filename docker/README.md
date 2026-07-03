# Telcoflo V1 — Docker stack

Production-like stack for the optimised Telcoflo **V1** engine: nginx + php-fpm
(tuned OPcache/FPM) + MySQL 8 (tuned) + Redis 7 + queue worker + scheduler +
a mock Orange-internal server. Deliberately isolated from the V2 "Telcoflo"
(Sail) setup — project `telcoflo-v1`, ports app **8080** / mysql **3307** /
redis **6380** — so both coexist on one machine.

## Layout

```
Dockerfile               multi-stage: node (npm run prod) -> composer -> php:8.2-fpm
docker-compose.yml       app, nginx, mysql, redis, queue, scheduler, mock-server
.env.docker              stack env (redis drivers, DB, mock hosts) — template
docker/
  entrypoint.sh          wait-for-db, migrations-table guard, migrate, cache, (opt) converter
  nginx/default.conf     serves public/, fastcgi -> app:9000
  php/opcache.ini        report §7.1
  php/www.conf           FPM pool, report §7.2
  php/php.ini            app php settings
  mysql/my.cnf           report §6 (buffer pool, flush, slow log)
  mysql/initdb/          drop a seed .sql/.sql.gz here (first-boot import)
  redis/redis.conf       report §7.3
  mock-server/           canned CMS/STK/SMS responses (static IP 192.168.22.202)
```

## Run

```bash
docker compose up -d --build      # build image + boot the whole stack
open http://localhost:8080        # app via nginx
docker compose logs -f app        # watch the entrypoint (migrate/cache)
docker compose down               # stop (keeps volumes)
docker compose down -v            # stop + wipe mysql/redis/public/storage volumes
```

First boot: the `app` entrypoint waits for MySQL, repairs the `migrations` table
if a restored dump lost its AUTO_INCREMENT, migrates, discovers packages, caches
config/routes. Set `RUN_UPGRADE_BUILDERS=true` in `.env.docker` to also run the
File 03 converter (`ussd:upgrade-builders --backup`) after seeding legacy data.

## Seeding real data

Put a sanitised dump in `docker/mysql/initdb/` (imported when the MySQL data dir
is first created):

```bash
mysqldump -h 127.0.0.1 -uroot telcoflo | gzip > docker/mysql/initdb/seed.sql.gz
docker compose up -d
```

Keep real dumps out of git (`.gitignore` the `*.sql*` in that folder).

## External Orange hosts (mock)

- **CMS `192.168.22.202`** (builder REST events) resolves to the `mock-server`
  container, which holds that IP on the `telcoflo-v1-net` (`192.168.22.0/24`).
- **STK push** was externalised to `config('services.orange.stk_push_url')`;
  `.env.docker` points `ORANGE_STK_PUSH_URL` at the mock.

> If the Docker host itself sits on `192.168.22.0/24`, change the subnet, the
> mock's `ipv4_address`, and `ORANGE_STK_PUSH_URL` together in
> `docker-compose.yml` + `.env.docker`.

## Assets after a rebuild

Built JS/CSS live in the `public` named volume, populated from the image on
first boot. After changing frontend source, rebuild AND refresh that volume:

```bash
docker compose build app
docker compose down                       # or: docker volume rm telcoflo-v1_public
docker compose up -d
```

## Production notes

- Set a fresh `APP_KEY` and real DB passwords before any real deployment.
- Bump `innodb_buffer_pool_size` (docker/mysql/my.cnf) to ~60–70% of the box RAM
  for load testing (Phase 10) so the buffer-pool hit rate mirrors production.
- Monitoring exporters (Phase 10) read `/fpm-status` (FPM) and `/nginx-status`.
