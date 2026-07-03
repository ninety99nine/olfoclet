# Monitoring Setup: Prometheus + Grafana for the USSD Platform (Orange Infra)

> **TL;DR** — One free agent (Grafana Alloy) runs on the Orange server and pushes metrics + logs
> **outbound over HTTPS/443** to **Grafana Cloud** (free tier). No inbound ports opened, no AWS server,
> no cost. Grafana Cloud becomes the dashboard that shows everything happening on the server — so during an
> SMS-driven traffic spike we can finally see *why* USSD returns "Unknown Error."

---

## 1. The problem

- **App:** Laravel 10 / PHP 8.1 platform serving USSD.
  Entry point `SimulationController::launchUssd` → `app/Services/Ussd/UssdService.php`.
- **Hosting:** Orange Botswana server, reached only through a **Wallix bastion**, firewall exposes **only 443**.
- **Trigger:** Orange Botswana (the MNO) sends bulk SMS to their subscriber base inviting users to dial
  services hosted on the platform. Each campaign creates a **synchronized traffic spike** on the USSD endpoint.
- **Symptom:** During those spikes the USSD handset/gateway shows **"Error performing request — Unknown Error."**
- **Blind spot:** The app currently has **no metrics, no health endpoint, no external monitoring**. When a
  spike hits, we cannot see what is happening under the hood.

**Goal:** See OS, web server, PHP-FPM, MySQL, and the USSD endpoint **live during a spike**, correlate the
error timestamps with the real bottleneck, and get alerted.

---

## 1.5 Evidence — Orange ZTE gateway logs, 2026-02-03 (root cause CONFIRMED)

Orange Botswana shared their USSD gateway (`OBRW_ZTE_Service`) logs. The log is pipe-delimited; `OS` =
Outbound to Service (gateway → our server), `IS` = Inbound from Service (our server → gateway).

**Matched request/response pair (session start, `*217#`):**

| | Timestamp | Meaning |
|---|---|---|
| `OS` (request) | `2026/02/03-12:14:52.668` | User dials `*217#` → `<type>1</type>` (session start) |
| `IS` (response) | `2026/02/03-12:15:34.177` | `200` OK, correct First-Aid menu, response `Date: 10:15:33 GMT` (= 12:15:33 local) |

- Elapsed = **~41.5 seconds** (the gateway even records the field `41509` = 41,509 ms round-trip).
- The server returned the **correct** menu — the USSD logic is fine — but **41 s too late**. The handset
  session had already timed out, so the user saw **"Error performing request — Unknown Error."**

**The "only fault" line** — request `<type>2</type><msg>99</msg>` → response **`Read timed out`**: same cause,
worse outcome. The server was so slow it did not answer within the gateway's HTTP read-timeout at all.

### Confirmed root cause
> **Under the SMS-driven spike, our server's USSD response time collapses from milliseconds to 41+ seconds (or
> to a read timeout). The USSD gateway/handset times out long before our reply arrives. That IS the
> "Unknown Error." It is a latency/concurrency failure, NOT a menu-logic bug** (the returned payload is correct).

### Most likely mechanism (from code exploration)
1. **Blocking work inside the request cycle:** `UssdService::handle_SMS_API_Event` (~L7728) retries the Orange
   SMS API **up to 20 times over ~20 s**, holding a PHP-FPM worker the whole time; Appwrite HTTP calls block too.
2. **No queue** (`QUEUE_CONNECTION=sync`) — that SMS/Appwrite work runs *inside* the USSD request, not in the background.
3. At campaign time, hundreds dial in at once → workers stuck in 20 s blocking calls → **PHP-FPM pool exhausts**
   → new dials queue in the FPM listen backlog → 41 s waits and read timeouts.

The monitoring below will prove exactly which ceiling is hit first and quantify it; the remediation in
**Section 8** addresses the cause.

---

## 2. Why the design looks the way it does (the firewall problem)

Prometheus normally works by **pulling** — the Prometheus server reaches *into* your box on a metrics port to
scrape it. We **can't** do that here: no inbound ports, and we sit behind Wallix.

**Solution → push model.** A single agent, **Grafana Alloy**, runs on the Orange server, scrapes local
exporters over `localhost`, and **pushes** the data **outbound over 443** to Grafana Cloud. The only new
network flow is Alloy → Grafana Cloud. **Nothing is exposed to the internet.**

```
        ORANGE SERVER (behind Wallix, only 443)                    GRAFANA CLOUD (free tier)
  ┌───────────────────────────────────────────────┐         ┌──────────────────────────────┐
  │  exporters bound to 127.0.0.1 only:            │         │  Mimir (Prometheus metrics)  │
  │   • unix/node metrics  (CPU/mem/disk/net/fd)   │  HTTPS  │  Loki   (logs)               │
  │   • php-fpm_exporter    :9253                  │  443    │  Grafana (dashboards)        │
  │   • mysqld_exporter     :9104                  │  ─────► │  Alerting (email/Slack/TG)   │
  │   • nginx/apache exporter                      │  OUT    │  Synthetic Monitoring        │
  │                                                │  only   │   (external HTTPS probe)     │
  │  ┌──────────────┐  scrapes localhost           │         └──────────────┬───────────────┘
  │  │ Grafana Alloy│──────────────────────────────┼── remote_write ────────┘
  │  │  (1 agent)   │  tails laravel.log + web logs │         probes public USSD URL from outside
  │  └──────────────┘                               │◄──────── (no inbound to Orange box) ────
  └───────────────────────────────────────────────┘
```

- **Grafana Alloy** = the single open-source agent (successor to Grafana Agent). One binary, one systemd
  service, one outbound connection. Bundles Prometheus scraping, remote_write, and log shipping.
- **Exporters bind to `127.0.0.1` only** — nothing new is reachable from outside; Alloy scrapes them locally.
- **No AWS, no cost.** Grafana Cloud *is* the "other server that shows everything," on the **free tier**
  (currently ~10k metric series, ~50 GB logs, 14-day retention, synthetics + alerting). Enough for one server.

---

## 3. What we monitor — and how each maps to the "Unknown Error"

| Layer | Exporter | Signals that explain a spike failure |
|---|---|---|
| **PHP-FPM** (prime suspect) | `hipages/php-fpm_exporter` → FPM status page | `active processes`, `listen queue`, `max children reached`, `slow requests`. When `pm.max_children` is hit, new USSD requests queue then error at the gateway. **#1 thing to watch.** |
| **MySQL** | `prometheus/mysqld_exporter` | `Threads_connected` vs `max_connections`, `Aborted_connects`, slow queries, InnoDB lock waits. USSD sessions (`ussd_sessions`) hit MySQL hard under load. |
| **OS / Host** | Alloy `prometheus.exporter.unix` (node_exporter) | CPU %, load / run-queue, memory + swap, disk I/O, disk free, **open file descriptors**, **TCP socket states**. |
| **Web server** | `nginx-prometheus-exporter` (stub_status) or `apache_exporter` (mod_status) | request rate, active connections, **5xx rate**, upstream latency. |
| **External availability** | Grafana Cloud **Synthetic Monitoring** | Probes the public HTTPS/USSD URL from outside → up/down + latency as *users* experience it. No inbound needed. |
| **Logs** | Alloy `loki.source.file` | Tail `storage/logs/laravel.log` + web logs → Loki. Line up the exact error timestamps against the metric spikes. `UssdService` records `fatal_error` / `fatal_error_msg`. |

**Working hypothesis (to confirm with the data, not assume):** during a campaign the synchronized dial-in
saturates the **PHP-FPM worker pool** and/or **MySQL connections**; workers may also block on the synchronous
outbound calls inside `UssdService` (Orange SMS API retry loop `handle_SMS_API_Event` ~L7728, and Appwrite
calls). The dashboards will show *which* ceiling is hit first. We only fix after the data proves the cause.

---

## 4. Step-by-step plan

### Phase 0 — Confirm with the Orange team first
1. **Outbound egress:** 443 outbound confirmed working. If egress goes through a proxy/allowlist, ask them to
   allowlist the Grafana Cloud hostnames (Phase 1). Alloy honours `HTTPS_PROXY` if they require a proxy.
2. **OS + versions:** distro (`cat /etc/os-release`), web server (nginx vs apache), PHP-FPM pool + socket
   (`/etc/php/*/fpm/pool.d/www.conf`), MySQL version.
3. **PHP-FPM status page:** enable `pm.status_path = /status` (scraped on localhost only).
4. **MySQL access:** create a read-only `exporter'@'localhost` user with `PROCESS, REPLICATION CLIENT, SELECT`.
5. **Install rights:** sudo/systemd rights via the Wallix session.
6. **Public USSD URL** for the external synthetic probe.

### Phase 1 — Grafana Cloud (free tier)
1. Create a Grafana Cloud stack (closest region). Note the endpoints:
   - Prometheus remote_write: `https://prometheus-prod-XX-<region>.grafana.net/api/prom/push`
   - Loki push: `https://logs-prod-XX.grafana.net/loki/api/v1/push`
   - (These hostnames are what Orange allowlists if egress is filtered.)
2. Create a **Cloud Access Policy token** (scopes: `metrics:write`, `logs:write`). Store it as a
   `root:root 0600` file on the server — **never in git**.
3. Enable the **Linux Server**, **MySQL**, and **php-fpm** integrations — each gives a ready-made Alloy config
   snippet + prebuilt dashboards, merged into one Alloy config.

### Phase 2 — Install Grafana Alloy on the Orange server (via Wallix SSH)
1. Install Alloy from Grafana's APT/YUM repo; `systemctl enable --now alloy`.
2. Base config `/etc/alloy/config.alloy`:
   - `prometheus.exporter.unix` → `prometheus.scrape` → `prometheus.remote_write` (Grafana Cloud, Bearer token).
   - `loki.source.file` tailing `storage/logs/laravel.log` + web logs → `loki.write` (Grafana Cloud).
3. Alloy talks only to `localhost` (exporters) and **outbound 443** (Grafana Cloud). No inbound.

### Phase 3 — Local exporters (all bound to 127.0.0.1)
1. **php-fpm:** enable `pm.status_path = /status`, run `php-fpm_exporter`, scrape from Alloy.
2. **MySQL:** run `mysqld_exporter` on `127.0.0.1:9104` with the read-only user, scrape from Alloy.
3. **Web server:** enable nginx `stub_status` (or apache `/server-status` on localhost), run the matching
   exporter, scrape from Alloy.
4. Verify each with `curl 127.0.0.1:<port>/metrics` before wiring into Alloy.

### Phase 4 — Logs to Loki
Ship `storage/logs/laravel.log` + web `error.log`/`access.log`, labelled (`job`, `host`, `service=ussd`).
This is what lets us line up "Unknown Error" moments against PHP-FPM queue depth and MySQL connections.

### Phase 5 — Dashboards
Import the integration dashboards (Linux/Node, MySQL, php-fpm, nginx/apache). Build one **"USSD Spike"**
overview pinning the four ceilings on a shared time axis: PHP-FPM active/queue, MySQL connections, host
CPU/load, 5xx rate — plus a Loki logs panel filtered to errors.

### Phase 6 — External synthetic probe
Add a Grafana Cloud Synthetic Monitoring HTTP check against the public USSD/app URL. Shows if failures are
user-visible externally vs internal-only — with zero inbound access.

### Phase 7 — Alerting (email / Slack / Telegram)
- PHP-FPM `listen queue > 0` sustained 1m, or `max children reached` increasing.
- MySQL `Threads_connected / max_connections > 80%`.
- Host CPU > 90% for 3m, load > cores×2, disk free < 15%, or FD usage > 80%.
- Web server 5xx rate spikes above baseline.
- Synthetic probe down or p95 latency breach.
- Alloy/target down (dead-man's switch) so we know if monitoring itself stops.

### Phase 8 (OPTIONAL — app-level USSD metrics; needs code change, deferred)
Expose a Laravel `/metrics` endpoint via `spatie/laravel-prometheus` with counters/histograms for USSD
sessions started/ended/timeout, `fatal_error` count, and request duration — sourced from existing
`ussd_sessions` fields (`fatal_error`, `session_execution_times`, `request_type`). Turns "the box is busy"
into "X% of USSD sessions failed." Not required for the initial diagnosis.

---

## 5. Security notes (for the Orange / Wallix team)
- **No inbound ports opened.** All exporters bind to `127.0.0.1`. Only new flow = Alloy → Grafana Cloud,
  **outbound TLS 443**.
- Grafana Cloud token stored `root:root 0600`, referenced by the Alloy systemd unit; not in git.
- If egress is allowlisted, provide the Prometheus + Loki hostnames from Phase 1; Alloy honours `HTTPS_PROXY`.
- Install/config done interactively through Wallix; services run under systemd afterwards.

---

## 6. Verification (end-to-end)
1. Server: `systemctl status alloy` active; `curl -s 127.0.0.1:<port>/metrics` returns data for each exporter.
2. Grafana Cloud → Explore: `up` = 1 per job; `node_load1`, `phpfpm_active_processes`,
   `mysql_global_status_threads_connected` return live series.
3. Loki → Explore: `{service="ussd"}` shows recent laravel.log lines; grep the error string.
4. Trigger a **controlled test spike** (small SMS batch, or `k6`/`ab` against the USSD endpoint) and watch the
   "USSD Spike" dashboard — identify which ceiling is hit as errors appear.
5. Fire one alert end-to-end (temporarily lower a threshold) and confirm it reaches email/Slack.
6. Confirm the Synthetic probe reports up/latency from outside.

**Success = during a real SMS campaign, the dashboard visibly shows the bottleneck the instant the
"Unknown Error" appears — turning the mystery into a named, alertable cause.**

---

## 7. Cost & the "no AWS" decision
- **Zero infrastructure cost.** No AWS EC2, no self-hosted server. Everything runs on the **Grafana Cloud
  free tier**; the only thing on your side is the free, open-source Alloy agent + exporters.
- **Fallback (not built now):** if you ever outgrow the free tier, self-host on an AWS EC2 box running
  Prometheus (`--web.enable-remote-write-receiver`) + Grafana + Alertmanager behind TLS/auth, and just point
  Alloy's `remote_write` at that endpoint instead. Everything else in this doc stays identical. Trade-off:
  you then own patching, storage retention, backups, and TLS.
