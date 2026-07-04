# Telcoflo V1 — AWS deployment (GitHub Actions → ECR → EC2)

CI/CD modeled on the V2 (`telcoflo-new`) pipeline, adapted for V1 (Laravel Mix,
MySQL test harness, single app image). On every push to `main`:

```
test (phpunit vs MySQL)  →  build & push app image to ECR  →  SSH deploy to EC2
                                                                (pull image + compose up)
```

The container entrypoint self-heals the DB (AUTO_INCREMENT), runs `migrate --force`
and caches config/routes, so the SSH step stays thin. Deploys are gated by the
repo variable `DEPLOY_TARGET=ec2` — the workflow is safe to merge before AWS exists.

Files: `.github/workflows/deploy.yml`, `docker-compose.production.yaml`,
`scripts/ec2-docker-setup.sh`, `.env.production.example`.

---

## What YOU need to do (one-time)

### 1. AWS — launch a V1 EC2 (separate from the V2 "Telcoflo" box)
- **EC2:** Ubuntu 22.04/24.04, sized like the target Orange box (start `t3.medium`;
  the report sizes FPM/MySQL for more — scale up for real load tests). Region
  `eu-west-2` (matches V2).
- **Security group:** inbound `22` (from your IP + GitHub Actions egress or use a
  bastion/SSM), `80` (public; `443` later if you add TLS). MySQL/Redis stay
  internal (no host ports).
- **SSH key pair:** create/download one for this box — you'll paste the *private*
  key into GitHub as `AWS_EC2_SSH_KEY`.
- **ECR:** nothing to do — the workflow creates the `telcoflo-v1-app` repo on
  first run. (Region `eu-west-2`.)
- **IAM for CI:** **reuse the existing `telcoflo` user's "GitHub Actions CI/CD"
  access key** (chosen) — it already has ECR access. V1 just adds a new ECR repo
  (`telcoflo-v1-app`, auto-created by the workflow). That key becomes
  `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`. (If you'd rather isolate later, a
  dedicated `telcoflo-v1-ci` user with `AmazonEC2ContainerRegistryPowerUser` +
  `sts:GetCallerIdentity` works identically.)
- **DNS (optional):** point a hostname at the EC2 if you want a real URL / TLS.

### 2. GitHub — secrets & variables (repo `ninety99nine/olfoclet`)
Settings → Secrets and variables → Actions.

**Variables:**
| name | value |
|------|-------|
| `DEPLOY_TARGET` | `ec2` |
| `TLS_ENABLED` | `false` for staging; `true` after you run init-letsencrypt (Promotion) |

**Secrets:**
| name | value |
|------|-------|
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | the CI IAM key |
| `AWS_EC2_HOST` | EC2 public DNS/IP |
| `AWS_EC2_USER` | `ubuntu` |
| `AWS_EC2_SSH_KEY` | the EC2 **private** SSH key (full PEM) |
| `AWS_EC2_SSH_PORT` | `22` (optional) |
| `AWS_EC2_APP_PATH` | `/var/www/telcoflo-v1` (optional) |
| `PRODUCTION_ENV` | the full `.env` contents — copy `.env.production.example`, fill in APP_KEY + passwords |

Optionally add a GitHub **Environment** named `production` (Settings → Environments)
with a required reviewer if you want a manual approval gate before deploys.

### 3. Grafana Cloud — monitoring (Phase 10)
- Create a free Grafana Cloud stack (closest region). From Connections → Data
  sources, note the **Prometheus remote_write** URL + user/token and (optional)
  **Loki** URL + token.
- Enable the **Linux Server**, **MySQL**, **php-fpm** integrations for ready-made
  dashboards.
- Fill `docker/monitoring/.env.monitoring` (from `.env.monitoring.example`).

---

## First deploy

1. Set the GitHub variable + secrets above.
2. Push to `main` (or run the workflow manually via *Actions → Build and Deploy V1
   → Run workflow*). It tests, builds, pushes to ECR, and SSHes in to deploy.
3. The first run bootstraps the EC2 (installs Docker + AWS CLI via
   `ec2-docker-setup.sh`).
4. **Seed data:** the box starts with an empty DB. To load real services, drop a
   sanitised dump into `docker/mysql/initdb/` before first boot (or restore into
   the running `mysql` container), and set `RUN_UPGRADE_BUILDERS=true` in
   `PRODUCTION_ENV` once so the File 03 converter runs, then set it back to false.

## Load testing (Phase 10)

Once the box is up and monitoring is streaming to Grafana Cloud:

```bash
# On the EC2 (or from your machine pointed at it):
BASE_URL=http://<ec2-host> SCENARIO=ramp ./loadtest/run-k6.sh
```

Push k6 metrics to the same Grafana Cloud stack (`OUTPUT=grafana-cloud`) so the
K6 numbers sit next to FPM/MySQL/host metrics. Ramp until a ceiling hits (FPM
`max_children`, MySQL connections, CPU), fix, re-test. See `loadtest/k6/README.md`
and `docker/monitoring/README.md`.

**Before a load run:** point the CMS at the mock (`--profile staging`) and bump
`innodb_buffer_pool_size` to mirror the box. (The `throttle:api` limit is already
~5000 req/s per IP, so it's only a factor if you drive >5000 req/s from one k6 host.)

---

## Monitoring overlay on the EC2

```bash
cd /var/www/telcoflo-v1
docker compose \
  -f docker-compose.production.yaml \
  -f docker/monitoring/docker-compose.monitoring.yml \
  --env-file docker/monitoring/.env.monitoring up -d
```

(Alloy pushes outbound to Grafana Cloud over 443 — no inbound ports needed.)

## Promotion: staging → production (TLS + real CMS + real data)

The box starts as a **staging/load-test replica** (HTTP + mock CMS). To promote the
same box toward production:

1. **TLS** — point a domain's DNS at the EC2, open `443` in the SG, set `APP_DOMAIN`
   + `ACME_EMAIL` in `PRODUCTION_ENV`, then on the box:
   ```bash
   cd /var/www/telcoflo-v1 && bash docker/scripts/init-letsencrypt.sh
   ```
   Set the GitHub variable **`TLS_ENABLED=true`** so every deploy keeps the TLS
   overlay (`docker-compose.tls.yaml`). Add `certbot-renew.sh` to cron (twice daily).
2. **Real CMS/STK** — set `ORANGE_STK_PUSH_URL` and the builders' CMS URL to the real
   reachable Orange hosts (public IP if outside their network), and deploy WITHOUT
   `--profile staging` so the mock isn't started.
3. **Real data** — restore a sanitised production dump and run
   `ussd:upgrade-builders --backup` once (`RUN_UPGRADE_BUILDERS=true` for one boot).
4. Bump `innodb_buffer_pool_size` and FPM `pm.max_children` to the box's RAM.

> The real Orange production still sits behind Wallix (443 only) — this AWS box is
> the staging/validation replica; Phase 11 covers the actual Orange cutover.

## Rollback

Images are tagged by commit SHA in ECR. To roll back, re-run the deploy job for
an earlier green commit, or on the box:
`IMAGE_TAG=<old-sha> docker compose -f docker-compose.production.yaml up -d app`.

## Notes / deviations from V2
- V1 builds **one** app image (used by app/queue/scheduler); nginx/mysql/redis are
  stock images pulled on the box (V2 also ships custom mysql/worker/sandbox images).
- V1 tests need **MySQL** (golden harness) — the workflow runs a `mysql:8.0`
  service; V2 used sqlite.
- V1 uses **Laravel Mix** (`npm run prod`); V2 uses Vite (`npm run build`).
- No TLS/Let's Encrypt wired yet (V2 uses an nginx-proxy + certbot). Add it if the
  box serves a public HTTPS URL; the Orange production sits behind Wallix (443).
