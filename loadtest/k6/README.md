# USSD load testing (K6) — Phase 10

Drives the real gateway endpoint `POST /api/launch/ussd` with realistic session
sequences to find the load ceiling and validate the optimisations under
SMS-campaign-style spikes.

## Quick start (against the local Docker stack)

```bash
# stack must be up: docker compose up -d
SCENARIO=smoke ./loadtest/run-k6.sh          # 5 VUs, 20s — sanity
SCENARIO=ramp  ./loadtest/run-k6.sh          # 20 -> 300 VUs
SCENARIO=spike ./loadtest/run-k6.sh          # burst to 600 VUs
```

`run-k6.sh` runs the `grafana/k6` image on the `telcoflo-v1-net` network and
reaches the app via the `nginx` service. From the host with a local k6 binary:

```bash
k6 run -e BASE_URL=http://localhost:8080 -e SCENARIO=ramp loadtest/k6/ussd-flow.js
```

## What the script does

Per virtual user, per iteration: a new session (`request_type=1`, `msg=<short
code>`) then N menu continuations (`request_type=2`) with think-time between
steps, ending when the app returns `request_type=3`. Session ids and MSISDNs are
randomised so each iteration is a distinct subscriber.

**Custom metrics:** `ussd_start_duration` (new session incl. on-start REST),
`ussd_step_duration` (continuation — the number Problem 20 optimises),
`ussd_session_duration`, `ussd_sessions_started/completed`, `ussd_session_errors`.

**Thresholds** (fail the run if breached): `<2%` transport failures, `<1%` session
errors, start p95 `<1.5s`, step p95 `<800ms` (target ~300ms post-optimisation),
overall p99 `<3s`. Tune to the box.

## Knobs (env)

| var | default | meaning |
|-----|---------|---------|
| `BASE_URL` | `http://nginx` (in container) | app base URL |
| `SERVICE_CODE` | `*217#` | short code to dial |
| `MSISDN_PREFIX` | `2677` | + 7 random digits |
| `INPUTS` | `1` | CSV of menu replies for the continuation steps |
| `THINK_MIN`/`THINK_MAX` | `1`/`3` | think-time seconds between steps |
| `SCENARIO` | `ramp` | `smoke` \| `ramp` \| `spike` \| `soak` |

## Push metrics to Grafana Cloud

Use the Prometheus remote-write output so the K6 metrics sit next to the
server-side metrics (Phase 10 monitoring) on the same dashboards:

```bash
export K6_PROMETHEUS_RW_SERVER_URL="https://prometheus-prod-XX-<region>.grafana.net/api/prom/push"
export K6_PROMETHEUS_RW_USERNAME="<instance-id>"
export K6_PROMETHEUS_RW_PASSWORD="<grafana-cloud-api-token>"
OUTPUT=grafana-cloud ./loadtest/run-k6.sh
```

## Before a real run — two config gotchas

1. **API throttle.** `POST /api/launch/ussd` is behind `throttle:api`. The default
   (60/min) will 429 the load test and hide the app's real ceiling. Raise it for
   staging via `USSD_API_RATE_LIMIT` (see routes/config) or disable the limiter on
   the staging box. Watch for `429` in the k6 summary — that means the throttle,
   not the app, is the bottleneck.
2. **CMS target.** For deterministic, isolated numbers point the app's CMS calls at
   the **mock-server** (`192.168.22.202` on the compose network), not the real
   public Orange IP — otherwise you are also load-testing (and waiting on) their
   CMS. The mock returns canned success instantly. (The First-Aid `_cmsProjectUrl`
   global variable currently points at the public IP from manual testing — set it
   back to `http://192.168.22.202/api/projects/1` for load runs.)

Also bump `innodb_buffer_pool_size` (docker/mysql/my.cnf) to mirror the target
box so the buffer-pool hit rate is realistic.
