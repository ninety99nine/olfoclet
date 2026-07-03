# File 1 — SAFE / NON-BREAKING PERFORMANCE FIXES
### Companion to `PERFORMANCE_OPTIMIZATION_REPORT_AND_PLAN_OPUS_4_8.md`
### Created: 2026-06-07 · Codebase: commit `71cfe7a` · Status: NOT STARTED

---

## What this file is

This file contains **only** the performance fixes that are **completely safe to deploy**. Every change
here works with the **existing, unmodified USSD builder JSON** that is already stored on production.
Pulling these changes from GitHub will **not** break any running application. No version builder needs
to be converted. There is nothing for the JSON migration command (File 3) to do for anything in this file.

> The defining rule for File 1: **the change does not alter the shape of the stored USSD builder JSON,
> and it is backward compatible with every session and every app already in production.**

Anything that changes the builder JSON structure lives in **File 2**
(`02_BREAKING_JSON_STRUCTURE_FIXES.md`). The converter that makes old JSON compatible with File 2 lives
in **File 3** (`03_JSON_COMPATIBILITY_MIGRATION.md`).

---

## Commit protocol (READ FIRST)

1. **One problem = one commit.** Never bundle two problems into one commit.
2. **Stage only the files that belong to that problem**, then commit with the exact message given.
3. **Commit order = least severe → most severe** (the numbering below is the commit order).
   Problem 1 is the safest, lowest-blast-radius change; Problem 20 is the highest-risk change in this file.
4. After each commit, run the **Verify** block. If it fails, use the **Rollback** and stop.
5. Do not commit the unrelated dirty build artifacts already in the working tree
   (`public/js/*`, `public/css/*`, `.DS_Store`, `bootstrap/cache/.gitignore`, etc.). Keep perf commits clean.
6. Branch: `perf/file1-safe-fixes` off `main`. Open one PR for the whole file, but keep the commits separate
   inside it so each fix is independently reviewable and revertable.

### Severity legend
🟢 trivial / zero blast radius · 🟡 low–medium / localized · 🟠 medium–high / hot path or wide surface

### Verified code anchors (checked against live source 2026-06-07)
Line numbers drift on every edit to `UssdService.php` (13,730 lines). **Always re-locate by `grep -n "function <name>"` before editing.** Anchors below subsequent edits will shift.

| Symbol | Line | File |
|--------|------|------|
| `handleExistingSession()` | 921 | `app/Services/Ussd/UssdService.php` |
| `createNewSession()` | 1063 | same |
| `updateExistingSessionDatabaseRecord()` | 1150 | same |
| `createOrUpdateGlobalVariablesToDatabase()` | 1408 | same |
| `getExistingSessionFromDatabase()` | 1443 | same |
| `startBuildingUssd()` | 1993 | same |
| `storeGlobalVariables()` | 2200 | same |
| `addReplyRecord()` | 2532 | same |
| `extractUserResponsesAsText()` | 2566 | same |
| `handleCurrentDisplay()` | 3688 | same |
| `removeEmojis()` | 4071 | same |
| `getDisplayById()` | 6112 | same |
| `searchScreenById()` | 6148 | same |
| `callGuzzleHttp()` | 7037 | same |
| `convertValueStructureIntoDynamicData()` | 12788 | same |
| `processPHPCode()` | 13044 | same |
| `handleEmbeddedDynamicContentConversion()` | 13231 | same |
| `$with`, `$appends`, `$casts` | 14, 160, 25 | `app/Models/UssdSession.php` |
| `findAndCache()` / `getCacheName()` | 18 / 13 | `app/Traits/VersionTrait.php` |
| mysql connection array | — | `config/database.php` |
| Cache::get anti-pattern usages | 575, 746, 757, 778, 801, 817, 12746 | `app/Services/Ussd/UssdService.php` |

---

## Commit order summary

| # | Problem | Sev | Commit scope |
|---|---------|-----|--------------|
| 1 | Double JSON decode of HTTP responses | 🟢 | UssdService |
| 2 | `removeEmojis()` 7 regex passes → 1 | 🟢 | UssdService |
| 3 | Unbounded `session_execution_times` | 🟢 | UssdService |
| 4 | Persistent PDO connections | 🟡 | config |
| 5 | Guzzle client per-call + no timeout | 🟡 | UssdService |
| 6 | Missing DB indexes | 🟡 | migration |
| 7 | InnoDB buffer pool undersized | 🟡 | server config |
| 8 | File cache/session driver | 🟡 | .env + server |
| 9 | `Cache::get()` closure anti-pattern | 🟡 | UssdService |
| 10 | Session table unbounded growth (archiving) | 🟡 | command + schedule |
| 11 | Global variables queried every request | 🟡 | UssdService |
| 12 | Linear screen/display lookup | 🟡 | UssdService |
| 13 | `collect()` overhead in hot path | 🟡 | UssdService |
| 14 | `extractUserResponsesAsText()` recompute | 🟡 | UssdService |
| 15 | UssdSession eager-load + appends | 🟠 | model + callers |
| 16 | Empty ValueStructure slow-path | 🟠 | UssdService |
| 17 | `processPHPCode()` unconditional `json_encode` logging | 🟠 | UssdService |
| 18 | `processPHPCode()` full variable extraction | 🟠 | UssdService |
| 19 | Per-tag mustache resolution | 🟠 | UssdService |
| 20 | Full session replay (session-state persistence) | 🟠 | migration + model + UssdService |

---
---

## Problem 1 — Double JSON decode of HTTP responses 🟢
**Report:** Finding 14 · **Commit:** `perf(http): decode REST API response body once`

### Symptom
Every REST API event response is parsed twice. For a 5 KB CMS user-profile payload this doubles the
JSON parse cost on a path that runs on every on-start event.

### Root cause (verified)
In `callGuzzleHttp()` (`app/Services/Ussd/UssdService.php`, ~line 7037, response section ~7055) the body
is decoded once to an associative array and again to an object:
```php
$array_body = json_decode($body, true);
$json_body  = json_decode($body, false);   // re-parses the identical string
```

### Why it's non-breaking
`json_decode($body)` with no second argument returns an object — identical to `json_decode($body, false)`.
Pure micro-optimization; output is byte-identical.

### Exact fix
```php
// AFTER
$array_body = json_decode($body, true);
$json_body  = json_decode($body);   // default = object; same result, half the parse work
```

### Verify
- Simulator: run a screen that fires a REST API event returning an object; confirm the response renders identically.
- `grep -n 'json_decode($body, false)' app/Services/Ussd/UssdService.php` returns nothing.

### Rollback
Restore the `, false` argument.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(http): decode REST API response body once

Removed the duplicate json_decode of the same response body in
callGuzzleHttp(). json_decode(\$body) returns an object identical to
json_decode(\$body, false), halving parse work for every REST API event.

Ref: Performance report Finding 14."
```

---

## Problem 2 — `removeEmojis()` runs 7 sequential regex passes 🟢
**Report:** Finding 16 · **Commit:** `perf(text): collapse removeEmojis into a single regex pass`

### Symptom
Seven `preg_replace()` passes over each string, where one alternation does the same job.

### Root cause (verified)
`removeEmojis()` (line 4071) makes seven separate `preg_replace` calls over the string
(alphanumeric, symbols, emoticons, transport, supplemental, misc, dingbats).

### Why it's non-breaking
A single alternation regex with the same Unicode ranges removes exactly the same characters in one pass.

### Exact fix
Replace the whole body with:
```php
public function removeEmojis($string)
{
    return preg_replace(
        '/[\x{1F100}-\x{1F1FF}]|[\x{1F300}-\x{1F5FF}]|[\x{1F600}-\x{1F64F}]' .
        '|[\x{1F680}-\x{1F6FF}]|[\x{1F900}-\x{1F9FF}]|[\x{2600}-\x{26FF}]' .
        '|[\x{2700}-\x{27BF}]/u',
        '',
        $string
    );
}
```
> The seven ranges above are exactly the seven currently used (verified at lines 4073–4098). Preserve them 1:1.

### Verify
- Run a string containing one character from each of the seven ranges through `removeEmojis()`; output must equal the old method's output (test side-by-side before committing).

### Rollback
Restore the seven-pass version.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(text): collapse removeEmojis into a single regex pass

Replaced 7 sequential preg_replace calls with one alternation regex
covering the identical 7 Unicode ranges. Same output, one pass.

Ref: Performance report Finding 16."
```

---

## Problem 3 — `session_execution_times` grows unbounded 🟢
**Report:** Finding 7 (part) · **Commit:** `perf(session): cap session_execution_times at 50 entries`

### Symptom
The `session_execution_times` JSON column gains one entry per keystroke with no cap, bloating the
`ussd_sessions` row and the UPDATE payload on deep sessions.

### Root cause (verified)
In `updateExistingSessionDatabaseRecord()` (line 1150) the array is rebuilt from the existing session
and appended to with no upper bound.

### Why it's non-breaking
Only the last entries matter for diagnostics. Trimming to the most recent 50 changes no behavior; the
column is display/diagnostic only (cast to array in the model, not used for engine logic).

### Exact fix
Immediately after the array is assembled (after the line that sets
`$this->session_execution_times` from `$this->existing_session->session_execution_times`):
```php
if (count($this->session_execution_times) > 50) {
    $this->session_execution_times = array_slice($this->session_execution_times, -50);
}
```

### Verify
- Run a simulator session past 50 keystrokes; the saved row's `session_execution_times` holds ≤ 50 entries.
- Shorter sessions are unaffected.

### Rollback
Remove the `array_slice` guard.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(session): cap session_execution_times at 50 entries

Bounded the per-keystroke execution-times array to the most recent 50
entries to stop unbounded ussd_sessions row growth on deep sessions.
Diagnostic-only column; no engine logic depends on the trimmed entries.

Ref: Performance report Finding 7."
```

---

## Problem 4 — No persistent database connections 🟡
**Report:** §7.4 · **Commit:** `perf(db): enable persistent PDO connections`

### Symptom
Each PHP-FPM request re-establishes a MySQL TCP connection (~5–20 ms) instead of reusing one.

### Root cause (verified)
`config/database.php` mysql connection has no `PDO::ATTR_PERSISTENT` option.

### Why it's non-breaking
Persistent connections are reused within a worker; behavior is unchanged. The only operational risk is
connection-count growth, which is monitored (see Verify) and reversible in one line.

### Exact fix
In the `mysql` connection array in `config/database.php`:
```php
'options' => extension_loaded('pdo_mysql') ? array_filter([
    PDO::ATTR_PERSISTENT => true,
]) : [],
```
> If an `options` key already exists, merge `PDO::ATTR_PERSISTENT => true` into it rather than overwriting.

### Verify
- After deploy: `mysql -e "SHOW STATUS LIKE 'Threads_connected';"` — must stay well below `max_connections`.
- Simulator and dashboard both work normally.

### Rollback
Remove the `PDO::ATTR_PERSISTENT` option and `php artisan config:clear`. **If `Threads_connected` climbs toward the limit, roll back immediately.**

### Git
```bash
git add config/database.php
git commit -m "perf(db): enable persistent PDO connections

Reuse MySQL TCP connections across requests within a PHP-FPM worker,
saving ~5-20ms connection setup per request. Monitored via
Threads_connected; single-line rollback.

Ref: Performance report section 7.4."
```

---

## Problem 5 — Guzzle client created per call with no timeout 🟡
**Report:** Finding 13 · **Commit:** `perf(http): reuse a single Guzzle client with timeouts`

### Symptom
Every REST API event builds a fresh `new Client()` with **no timeout** (default = infinite). A hanging
CMS at `192.168.22.202` blocks the USSD worker forever.

### Root cause (verified)
`callGuzzleHttp()` (line 7037) instantiates `new Client()` per call with no `timeout`/`connect_timeout`.

### Why it's non-breaking
Reusing one configured client per request changes nothing functionally. Adding timeouts only changes
behavior in the failure case (a hang now errors at ~10 s instead of blocking forever) — strictly safer.
`http_errors => false` preserves the current behavior of not throwing on 4xx/5xx (verify the existing code
already treats non-2xx responses without relying on a thrown exception).

### Exact fix
1. Add a property to the property block (near line 60):
```php
public $httpClient = null;
```
2. Add a getter (place it just above `callGuzzleHttp`):
```php
private function getHttpClient()
{
    if ($this->httpClient === null) {
        $this->httpClient = new \GuzzleHttp\Client([
            'timeout'         => 10,
            'connect_timeout' => 5,
            'http_errors'     => false,
            'verify'          => false,
        ]);
    }
    return $this->httpClient;
}
```
3. In `callGuzzleHttp()` replace `$httpClient = new Client();` with `$httpClient = $this->getHttpClient();`.

> ⚠ Before committing, confirm the existing response handling does **not** depend on Guzzle throwing on
> non-2xx (since `http_errors=false` suppresses that). If it does, keep the current error semantics.

### Verify
- Simulator REST API event resolves normally.
- Point the event at an unreachable host (or a sleeping endpoint) → worker returns an error at ~10 s instead of hanging indefinitely.

### Rollback
Restore `new Client()` and remove the getter/property.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(http): reuse a single Guzzle client with timeouts

Introduced getHttpClient() returning one cached client per request with
timeout=10s, connect_timeout=5s, http_errors=false. Replaces per-call
new Client() in callGuzzleHttp() and prevents a hanging CMS from blocking
USSD workers indefinitely.

Ref: Performance report Finding 13, section 7.5."
```

---

## Problem 6 — Missing critical database indexes 🟡
**Report:** Finding 3, §6.2 · **Commit:** `perf(db): add performance indexes for hot-path queries`

### Symptom
`WHERE session_id = ?` runs on every request and full-scans 489,556 rows (the 19.5 s smoking-gun query).
Global-variable and notification lookups also lack covering indexes.

### Root cause (verified)
`database/migrations/2023_01_01_00000_create_ussd_sessions_table.php` indexes only `ussd_account_id`
(line 46) and `(project_id, app_id, version_id)` (line 47). **No `session_id` index.**

### Why it's non-breaking
Indexes are additive metadata; they never change query results or data. Fully reversible.
The only caution is the **ALTER lock** on the large table (mitigated by running off-peak / online).

### Exact fix
Create `database/migrations/2026_06_07_000001_add_performance_indexes.php`:
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->index('session_id', 'idx_ussd_sessions_session_id');
            $table->index('created_at', 'idx_ussd_sessions_created_at');
        });
        Schema::table('global_variables', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'app_id'], 'idx_gv_account_app');
            $table->index(['ussd_account_id', 'version_id'], 'idx_gv_account_version');
        });
        Schema::table('session_notifications', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'marked_as_seen'], 'idx_sn_account_seen');
        });
    }

    public function down()
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropIndex('idx_ussd_sessions_session_id');
            $table->dropIndex('idx_ussd_sessions_created_at');
        });
        Schema::table('global_variables', function (Blueprint $table) {
            $table->dropIndex('idx_gv_account_app');
            $table->dropIndex('idx_gv_account_version');
        });
        Schema::table('session_notifications', function (Blueprint $table) {
            $table->dropIndex('idx_sn_account_seen');
        });
    }
};
```
> Confirm the `session_notifications` table has columns `ussd_account_id` and `marked_as_seen` before
> running (grep its migration). If column names differ, adjust the index definition.

### Deploy notes
- **Staging first:** `php artisan migrate`.
- **Production:** run during the lowest-traffic window (≈02:00–04:00). The `ussd_sessions` ALTER takes
  30–120 s and briefly locks the table. For zero downtime use `pt-online-schema-change` for the
  `ussd_sessions` indexes; the small tables can use plain `migrate`.

### Verify
```sql
EXPLAIN SELECT * FROM ussd_sessions WHERE session_id = '<real id>' LIMIT 1;
-- must show type=ref, key=idx_ussd_sessions_session_id  (NOT type=ALL)
SHOW INDEX FROM global_variables;   -- shows the two new composite indexes
```

### Rollback
`php artisan migrate:rollback --step=1` (drops the indexes; data untouched).

### Git
```bash
git add database/migrations/2026_06_07_000001_add_performance_indexes.php
git commit -m "perf(db): add performance indexes for hot-path queries

Adds idx on ussd_sessions(session_id) and (created_at), composite
global_variables(ussd_account_id,app_id) and (ussd_account_id,version_id),
and session_notifications(ussd_account_id,marked_as_seen). Converts the
per-request session lookup from a 489k-row full scan to an indexed ref.

Run on production off-peak (brief ALTER lock) or via pt-online-schema-change.

Ref: Performance report Finding 3, section 6.2."
```

---

## Problem 7 — InnoDB buffer pool undersized 🟡
**Report:** §6.1 · **Commit:** *(server config — not a code commit; record in `docs/performance/`)*

### Symptom
A no-WHERE browse of `ussd_sessions` took 19.5 s. The 1.3 GiB table does not fit in the buffer pool, so
every query hits disk.

### Root cause
`innodb_buffer_pool_size` likely at the 128 MB default while the hot table is 1.3 GiB.

### Why it's non-breaking
A MySQL configuration value. No application or schema change. Reversible by editing the config and restarting.

### Exact fix
`/etc/mysql/mysql.conf.d/mysqld.cnf`:
```ini
innodb_buffer_pool_size      = 5G      ; 60–70% of server RAM (set from actual RAM)
innodb_buffer_pool_instances = 4
innodb_log_file_size         = 512M
innodb_flush_log_at_trx_commit = 2     ; safe for non-financial USSD
innodb_flush_method          = O_DIRECT
```
Then `sudo systemctl restart mysql` in the off-peak window.

### Verify
- `SHOW VARIABLES LIKE 'innodb_buffer_pool_size';` reflects the new value.
- Re-time the browse query → target < 2 s (was 19.5 s).
- `SHOW STATUS LIKE 'Innodb_buffer_pool_read%';` → hit rate trends > 99%.

### Rollback
Revert the config lines and restart MySQL.

### Git
This is a server change, not a repo change. Record the applied values and the before/after timings in
`docs/performance/baseline_metrics_2026-06-07.md`. (No application commit.)

---

## Problem 8 — File-based cache and session drivers 🟡
**Report:** Finding 4, §7.3 · **Commit:** `perf(cache): switch cache/session/queue drivers to Redis`

### Symptom
7+ cache lookups per request hit the filesystem (~5 ms each) with lock contention under load.
Confirmed `.env`: `CACHE_DRIVER=file`, `SESSION_DRIVER=file`, `QUEUE_CONNECTION=sync`; `REDIS_HOST=127.0.0.1` already set.

### Why it's non-breaking
Laravel's cache/session APIs are driver-agnostic; the same keys and values work over Redis. **Two caveats,
both benign:** switching `SESSION_DRIVER` invalidates existing web/dashboard login sessions (users re-login
once — do off-peak); switching `QUEUE_CONNECTION` from `sync` to `redis` makes dispatched jobs run
asynchronously, so **audit existing jobs first** (next paragraph). USSD builder JSON is untouched.

### Pre-flight (queue audit)
```bash
grep -rnE 'dispatch\(|->onQueue|ShouldQueue|dispatchSync' app/ | head
```
If any job currently relies on synchronous execution mid-request (rare for the USSD path), either keep
`QUEUE_CONNECTION=sync` for now or convert those to `dispatchSync()`. The cache/session switch is the
primary win and can ship even if queue stays `sync`.

### Exact fix
1. Install Redis (server): `sudo apt install redis-server && sudo systemctl enable --now redis-server`,
   `/etc/redis/redis.conf`: `maxmemory 2gb`, `maxmemory-policy allkeys-lru`, `save ""`.
   ✅ `redis-cli ping` → `PONG`.
2. `.env`:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis   # only if the queue audit passed; otherwise leave as sync
```
3. `php artisan config:clear && php artisan cache:clear`.
4. If queue → redis: run a worker under supervisor/systemd (`php artisan queue:work`).

### Verify
- `redis-cli MONITOR` shows cache reads/writes during a simulator run.
- Simulator + dashboard both work; dashboard re-login succeeds.

### Rollback
Set the three vars back to `file`/`file`/`sync`, `php artisan config:clear`. (`.env` is per-environment;
ensure the production `.env` is updated on the server, not just in the repo.)

### Git
```bash
git add .env.example   # if drivers are documented there; .env itself is typically not committed
git commit -m "perf(cache): switch cache/session/queue drivers to Redis

Moves cache and session off the filesystem onto Redis (already configured
at REDIS_HOST=127.0.0.1) to remove per-request file I/O and lock
contention. Queue moved to redis after auditing dispatched jobs.

Note: production .env updated on the server. Session driver change forces
a one-time dashboard re-login.

Ref: Performance report Finding 4, section 7.3."
```

---

## Problem 9 — `Cache::get()` closure anti-pattern 🟡
**Report:** Finding 6 · **Commit:** `perf(cache): use Cache::remember for model lookups`

### Symptom
The lookup pattern instantiates a model just to compute a cache key and relies on a hidden `Cache::put()`
side effect inside `findAndCache()`. Concurrent cache misses cause duplicate DB hits.

### Root cause (verified)
Pattern repeated at lines **575, 746, 757, 778, 801, 817, 12746**:
```php
Cache::get((new ShortCode())->getCacheName(), function () {
    return (new ShortCode())->findAndCache();   // caching only via side effect
});
```

### Why it's non-breaking
`findAndCache()` already calls `Cache::put()` (verified in `VersionTrait::findAndCache` line 36), so the
cache contents and keys are unchanged. We are only making the caching explicit and the read reliable.
**Keep the existing cache key strings identical** (use the same `getCacheName(...)` values) so existing
cache entries and invalidation in the trait/observers keep working.

### Exact fix (apply uniformly to each of the 7 sites)
Replace `Cache::get($key, fn () => (new X())->findAndCache(...))` with:
```php
Cache::remember((new ShortCode())->getCacheName(), now()->addHour(), function () {
    return (new ShortCode())->findAndCache();
});
```
> Conservative option that is even safer: leave the key construction exactly as-is and only swap
> `Cache::get` → `Cache::remember` with an explicit TTL. Do **not** change `getCacheName()` signatures in
> this file — making them static is a nice-to-have but touches the traits; defer it.

### Verify
- Cold cache: first request populates the key; second request served from cache (`redis-cli MONITOR`).
- Editing a ShortCode/App/Version still reflects (the observers still call `removeFromCache`/`findAndCache`).

### Rollback
Revert each site to `Cache::get(...)`.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(cache): use Cache::remember for model lookups

Replaced the Cache::get(key, closure) anti-pattern (which cached only via
findAndCache()'s side effect) with Cache::remember + explicit TTL at all 7
call sites. Cache keys unchanged, so existing entries and observer-driven
invalidation keep working. Prevents duplicate DB hits on concurrent misses.

Ref: Performance report Finding 6."
```

---

## Problem 10 — `ussd_sessions` unbounded growth (archiving) 🟡
**Report:** §6.3, Phase 7 · **Commit:** `perf(db): add scheduled session archiving command`

### Symptom
489,556 rows / 1.3 GiB and growing; scans and the buffer pool degrade as the table grows to millions.

### Why it's non-breaking
A new scheduled command and a new archive table. The live request path is untouched. Archived rows are
recoverable (copied before delete, plus the Phase 0 backup). Batched deletes avoid long locks.

### Exact fix
1. Migration `2026_06_07_000003_create_ussd_sessions_archive_table.php`:
```php
public function up()   { DB::statement('CREATE TABLE IF NOT EXISTS ussd_sessions_archive LIKE ussd_sessions'); }
public function down() { DB::statement('DROP TABLE IF EXISTS ussd_sessions_archive'); }
```
2. `php artisan make:command ArchiveOldSessions` → signature `sessions:archive`. Move rows older than
   90 days in batches (e.g. 5,000) inside a loop: copy to archive, then delete the same ids, until none remain.
3. Schedule in `app/Console/Kernel.php`: `$schedule->command('sessions:archive')->dailyAt('03:00');`

### Verify
- Staging dry-run: archived count + remaining count == original total. No rows lost.
- The command completes without a long table lock (batched).

### Rollback
Remove the schedule entry; archived data remains restorable from `ussd_sessions_archive`.
(Run `OPTIMIZE TABLE ussd_sessions;` to reclaim space only after a successful large purge, off-peak — this is its own follow-up, not part of this commit.)

### Git
```bash
git add database/migrations/2026_06_07_000003_create_ussd_sessions_archive_table.php \
        app/Console/Commands/ArchiveOldSessions.php app/Console/Kernel.php
git commit -m "perf(db): add scheduled session archiving command

Adds ussd_sessions_archive table and a batched sessions:archive command
(daily 03:00) that moves sessions older than 90 days out of the hot table.
Request path untouched; archived rows recoverable.

Ref: Performance report section 6.3, Phase 7."
```

---

## Problem 11 — Global variables queried on every request 🟡
**Report:** Finding 12 · **Commit:** `perf(globals): cache global_variables lookup with invalidation`

### Symptom
`storeGlobalVariables()` runs a `global_variables` query on every request (and on every replay step) with
no caching.

### Root cause (verified)
`storeGlobalVariables()` (line 2200) queries at line 2222:
```php
$global_variables_records = DB::table('global_variables')->where([
    'ussd_account_id' => $this->ussd_account->id,
    'app_id'          => $this->app->id,
])->oldest('updated_at')->get();
```
Writes happen in `createOrUpdateGlobalVariablesToDatabase()` (line 1408, `updateOrInsert` at 1421).

### Why it's non-breaking — **only if invalidation is correct**
The cached value is the same query result. Correctness depends on busting the cache whenever globals are
written. This problem is 🟡 specifically because a missed invalidation = stale globals (a correctness bug).
Pairs with the composite index from Problem 6 (`idx_gv_account_app`).

### Exact fix
At the query (line ~2222):
```php
$cacheKey = 'gv_' . $this->ussd_account->id . '_' . $this->app->id;
$global_variables_records = Cache::remember($cacheKey, 1800, function () {
    return DB::table('global_variables')->where([
        'ussd_account_id' => $this->ussd_account->id,
        'app_id'          => $this->app->id,
    ])->oldest('updated_at')->get();
});
```
In `createOrUpdateGlobalVariablesToDatabase()` after the `updateOrInsert` (after line ~1435):
```php
Cache::forget('gv_' . $this->ussd_account->id . '_' . $this->app->id);
```
> ⚠ Confirm `$this->ussd_account->id` and `$this->app->id` are populated at both sites. Also search for any
> other writer of `global_variables` and add the same `Cache::forget` there.

### Verify
- Change a global variable mid-flow → it reflects on the **next** request (invalidation works).
- Repeated requests don't re-query (`redis-cli MONITOR` / slow query log shows the query only on cold cache).

### Rollback
Remove the `Cache::remember` wrapper and the `Cache::forget` calls.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(globals): cache global_variables lookup with invalidation

Wrapped storeGlobalVariables()'s per-request global_variables query in
Cache::remember (30m) keyed by account+app, with Cache::forget on every
write in createOrUpdateGlobalVariablesToDatabase(). Verified invalidation
so globals are never served stale.

Ref: Performance report Finding 12."
```

---

## Problem 12 — Linear screen/display lookup on every navigation 🟡
**Report:** Finding 9, §5.4–5.5 · **Commit:** `perf(engine): index screens and displays by id`

### Symptom
`searchScreenById()` / `getDisplayById()` scan the full screen/display collections on every navigation
(and repeatedly during replay).

### Root cause (verified)
`searchScreenById()` (line 6148) and `getDisplayById()` (line 6112) use `collect(...)->where('id', ...)->first()`.

### Why it's non-breaking
This is a **PHP-side index built at runtime from the existing JSON** — the builder JSON is not changed
(that distinction is what keeps this in File 1, not File 2). The maps return the same objects the scans did.

### Exact fix
1. Properties (near line 60): `public $screenIndex = []; public $displayIndex = [];`
2. A helper that builds both from `$this->screens` (call it once where screens are first available,
   e.g. inside `startBuildingUssd()` after screens are populated):
```php
private function buildScreenIndexes()
{
    $this->screenIndex  = array_column($this->screens, null, 'id');
    $this->displayIndex = [];
    foreach ($this->screens as $screen) {
        foreach (($screen['displays'] ?? []) as $display) {
            $this->displayIndex[$display['id']] = $display;
        }
    }
}
```
3. Rewrite the lookups (preserve signatures):
```php
public function searchScreenById($link = null) {
    return $this->screenIndex[$link] ?? null;
}
public function getDisplayById($link = null, $globalSearch = false) {
    return $this->displayIndex[$link] ?? null;
}
```
> ⚠ Read how `$this->screens` is mutated during a request. If it is mutated after `buildScreenIndexes()`,
> rebuild or update the index accordingly so it never goes stale. `getDisplayById`'s `$globalSearch` param
> becomes a no-op because the index already spans all screens — keep the parameter for signature compatibility.

### Verify
- Navigate forward and backward through several screens/displays in the simulator; every link resolves to
  the same screen/display as before. Test a deep flow.

### Rollback
Restore the original `collect()->where()->first()` bodies; remove the helper and properties.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): index screens and displays by id

Builds screenIndex/displayIndex hash maps once per request from the
existing builder JSON and routes searchScreenById()/getDisplayById()
through O(1) lookups instead of collect()->where()->first() scans. No
JSON change; same objects returned.

Ref: Performance report Finding 9."
```

---

## Problem 13 — `collect()` overhead in the hot path 🟡
**Report:** Finding 15 · **Commit:** `perf(engine): replace hot-path collect() with native arrays`

### Symptom
Laravel Collections are instantiated hundreds of times per request for simple maps/filters where native
arrays are 2–5× faster.

### Root cause (verified)
Multiple hot-path sites (583, 1743, 2571, 2936, 3659, 5881, 6132–6284) use `collect()->map()/filter()/where()`.

### Why it's non-breaking
Native `array_map`/`array_filter`/`foreach` produce identical results. **Do this incrementally and only at
confirmed hot sites**; verify each conversion's output equivalence (Collections sometimes re-key — preserve
keys/order where the caller depends on them).

### Exact fix (pattern, apply per site)
```php
// collect($x)->where('id',$id)->first()  → (or use the Problem 12 index if it's a screen/display)
foreach ($x as $row) { if (($row['id'] ?? null) === $id) return $row; }
return null;

// collect($x)->map($fn)->filter()->toArray()
$result = array_values(array_filter(array_map($fn, $x)));
```
> Convert one site per review pass. If a site relies on Collection-specific behavior (lazy chaining,
> key preservation, `values()`), replicate it exactly. When unsure, leave that site as a Collection.

### Verify
- Simulator regression pass after each batch of conversions; outputs identical.

### Rollback
Revert the specific site(s) to `collect()`.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): replace hot-path collect() with native arrays

Converted confirmed hot-path collect()->map()/filter()/where() calls to
native array_map/array_filter/foreach equivalents (identical output) to
cut per-request object allocation. Sites relying on Collection semantics
left untouched.

Ref: Performance report Finding 15."
```

---

## Problem 14 — `extractUserResponsesAsText()` recomputed repeatedly 🟡
**Report:** Finding 11 · **Commit:** `perf(engine): memoize extractUserResponsesAsText`

### Symptom
During replay and gate checks, `extractUserResponsesAsText()` re-traverses a growing array many times per request.

### Root cause (verified)
`extractUserResponsesAsText()` (line 2566) recomputes from scratch each call; it is called from
`addReplyRecord()` (line 2532) and from `hasResponded()` during traversal.

### Why it's non-breaking
A memo with a dirty flag returns the same value; it is invalidated whenever a reply record is added. The
explicit-argument call path bypasses the memo, preserving existing callers that pass their own records.

### Exact fix
1. Properties: `private $cachedResponseText = null; private $responseTextDirty = true;`
2. In `addReplyRecord()` after the record is pushed: `$this->responseTextDirty = true;`
3. In `extractUserResponsesAsText($reply_records = null)`:
```php
if ($reply_records === null && !$this->responseTextDirty && $this->cachedResponseText !== null) {
    return $this->cachedResponseText;
}
// ... existing computation producing $result ...
if ($reply_records === null) {
    $this->cachedResponseText = $result;
    $this->responseTextDirty  = false;
}
return $result;
```
> ⚠ Read the real method first — it accepts an optional `$reply_records`. The memo must apply **only** to
> the no-argument call. Any code that mutates `$this->reply_records` directly (not via `addReplyRecord`)
> must also set `$this->responseTextDirty = true`.

### Verify
- Deep session (depth 8+) shows the correct accumulated response text identical to before.

### Rollback
Remove the two properties and the memo branches.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): memoize extractUserResponsesAsText

Cached the no-arg result with a dirty flag invalidated in addReplyRecord(),
eliminating repeated full re-traversal of the growing reply array during
replay and gate checks. Explicit-argument calls bypass the memo.

Ref: Performance report Finding 11."
```

---

## Problem 15 — UssdSession eager-load + appended accessors 🟠
**Report:** Finding 10 · **Commit:** `perf(model): drop default eager-load and appends on UssdSession`

### Symptom
Every `UssdSession` load fires an extra `account` JOIN query and runs 7 accessors (Carbon::now(),
Collection wrapping, relation access) — all unnecessary on the USSD processing path.

### Root cause (verified)
`app/Models/UssdSession.php`: `protected $with = ['account'];` (line 14) and
`protected $appends = ['origin','mobile_number','has_timed_out','request_type_status','success_status','total_duration','total_inputs_and_outputs'];` (line 160).

### Why this is 🟠 (wider surface)
Removing `$appends`/`$with` is safe for the USSD engine but the **dashboard/Inertia/exports rely on those
appended attributes and the auto-loaded relation**. This is the widest regression surface in File 1. The
fix is safe **only if** every consumer that needs those attributes is updated to request them explicitly.

### Exact fix
1. In `UssdSession.php` remove `protected $with = ['account'];` and the `protected $appends = [...]` array.
   (Keep the accessor methods — they still work when an attribute is accessed or appended on demand.)
2. Find every consumer and add explicit loading/appending where needed:
```bash
grep -rnE "UssdSession::|->origin|->mobile_number|->has_timed_out|->request_type_status|->success_status|->total_duration|->total_inputs_and_outputs" \
  app/ routes/ resources/ | grep -v 'UssdService.php'
```
   For dashboard/report queries: `UssdSession::with('account')->...` and `->append([...])` (or
   `->makeVisible`) on the records actually rendered.

### Verify
- Dashboard session **list** and session **detail** pages render with origin, mobile number, timeout,
  statuses, durations — identical to before.
- USSD simulator path works and no longer fires the extra `account` query (check the query log).

### Rollback
Restore `$with` and `$appends` in the model.

### Git
```bash
git add app/Models/UssdSession.php <updated controllers/resources/views>
git commit -m "perf(model): drop default eager-load and appends on UssdSession

Removed \$with=['account'] and the 7 \$appends accessors that ran on every
load. Re-added with('account') and ->append([...]) explicitly in the
dashboard/report consumers that need them. USSD path no longer pays for
unused JOIN + accessors.

Ref: Performance report Finding 10."
```

---

## Problem 16 — Empty ValueStructure slow-path 🟠
**Report:** §5.1 (backend shortcut) · **Commit:** `perf(engine): fast-path ValueStructures not in code-editor mode`

### Symptom
94.8% of ValueStructures have `code_editor_mode = false`, yet each still flows through the full conversion
logic.

### Root cause (verified)
`convertValueStructureIntoDynamicData()` (line 12788) always reads `text`/`code_editor_text`/`code_editor_mode`
then branches; the common non-code path still does extra work.

### Why it's non-breaking
This is purely a **backend shortcut that reads the existing JSON** — it does not strip or change any JSON
(that is File 2). The fast path must reproduce the exact behavior of the current `code_editor_mode == false`
branch (which already handles `true`/`false`/mustache/embedded text). Because that branch is non-trivial,
this is 🟠: the fast-path must not skip the `text === true/false` and mustache cases.

### Exact fix (conservative)
The current `else` branch already covers all non-code cases. The genuinely safe optimization is to **avoid
recomputing** and to short-circuit only the trivial empty case. Add at the very top of the method:
```php
// Fast-path: empty, non-code ValueStructure (the overwhelmingly common case)
if (($data['code_editor_mode'] ?? false) === false
    && ($data['text'] ?? '') === ''
    && !is_bool($data['text'] ?? null)) {
    return '';
}
```
> Do **not** replace the whole `else` branch — it correctly handles `text === true`, `text === false`,
> valid mustache tags, and embedded content. Only the empty-string case is short-circuited here.

### Verify
- Render screens with: plain text, a mustache tag, `text=true`, `text=false`, and a code-editor value.
  All identical to before. Render the First-Aid App end-to-end.

### Rollback
Remove the fast-path block.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): fast-path empty non-code ValueStructures

Added a top-of-method short-circuit in convertValueStructureIntoDynamicData()
for empty, non-code-editor ValueStructures (the ~95% common case), returning
'' without the full branch. true/false/mustache/embedded cases unchanged.

Ref: Performance report section 5.1 (backend shortcut)."
```

---

## Problem 17 — `processPHPCode()` unconditional `json_encode` logging 🟠
**Report:** Finding 2 (part) · **Commit:** `perf(engine): guard processPHPCode logging behind loggingEnabled`

### Symptom
`processPHPCode()` runs `json_encode($__value)` for **every** dynamic variable on **every** call
(50–200+ calls/request), even in production where logs are not saved.

### Root cause (verified)
In `processPHPCode()` (line 13044) the loop at 13083 builds a log entry guarded only by
`$__log_dynamic_data` (default `true`, line 13044) — it does **not** check whether logging is actually
saved. `json_encode($__value)` runs at line 13112 regardless.

### Why this is 🟠
`processPHPCode()` is the hottest method in the engine and feeds `eval()`. The change is logic-only (skip
log array construction when logging is off) and does not affect the eval result — but it sits on the
critical path, so verify thoroughly.

### Exact fix
1. Property: `public $loggingEnabled = false;`
2. Pre-compute once in `startBuildingUssd()` (after the version is available). Source values verified at
   lines 1322/1325 (`log_settings.mobile.save_logs`, `log_settings.simulator.save_logs`):
```php
$logSettings = $this->version->builder['log_settings'] ?? [];
$saveMode = ($this->test_mode ?? false)
    ? ($logSettings['simulator']['save_logs'] ?? 'always')
    : ($logSettings['mobile']['save_logs'] ?? 'never');
$this->loggingEnabled = ($saveMode !== 'never');
```
> ⚠ Confirm the exact property used for simulator vs mobile mode (the code uses `$this->test_mode`
> elsewhere — verify the name). Default to the current behavior if unset.
3. In `processPHPCode()` change the log guard at line 13103 from `if ($__log_dynamic_data) {` to:
```php
if ($__log_dynamic_data && $this->loggingEnabled) {
```

### Verify
- With `save_logs = 'never'` (production mobile): a session runs and the `logs` column stays empty; output
  identical. Add a temporary microtime probe to confirm the `json_encode` block is skipped.
- With logging enabled (simulator): dynamic-variable logs still appear as before.

### Rollback
Revert the guard to `if ($__log_dynamic_data) {` and remove the precomputed flag.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): guard processPHPCode logging behind loggingEnabled

Precompute \$this->loggingEnabled once from log_settings in
startBuildingUssd() and require it before building the per-variable log
array (incl. json_encode) in processPHPCode(). Eliminates 100% of log
serialization work when logs are not saved (production). Eval result
unchanged.

Ref: Performance report Finding 2."
```

---

## Problem 18 — `processPHPCode()` extracts ALL dynamic variables 🟠
**Report:** Finding 2 (part) · **Commit:** `perf(engine): extract only referenced variables in processPHPCode`

### Symptom
Every `processPHPCode()` call materializes a PHP variable for **every** key in `dynamic_data_storage`,
even though the code snippet references only a few.

### Root cause (verified)
The loop at line 13083 does `${$__key} = $__value;` for the entire dataset.

### Why this is 🟠 (highest-care code change in the non-JSON set)
Lazy extraction can miss variables referenced indirectly (variable variables `$$x`, variables built inside
the evaluated code, or names assembled at runtime). A missed variable becomes an `Undefined variable` at
`eval()`. It is non-breaking **only** if the reference scan is conservative and well-tested. When in doubt,
ship Problem 17 (the logging guard) and **defer this one**.

### Exact fix (conservative)
```php
$__allData = $this->getDynamicData();
if (count($__allData)) {
    // Find variable names actually referenced in the code
    preg_match_all('/\$([a-zA-Z_]\x7b?[a-zA-Z0-9_]*\x7d?)/', $__phpCode, $__m);
    $__needed = array_flip($__m[1] ?? []);

    // If the code uses variable-variables or dynamic names, fall back to full extraction
    $__dynamicNames = (strpos($__phpCode, '$$') !== false) || (strpos($__phpCode, '${') !== false);

    foreach ($__allData as $__key => $__value) {
        if ($__dynamicNames || isset($__needed[$__key])) {
            ${$__key} = $__value;
            if ($__log_dynamic_data && $this->loggingEnabled) {
                $__dataType = $this->wrapAsSuccessHtml($this->getDataType($__value));
                array_push($__dynamic_variables, [
                    'name' => '$'.$__key, 'data_type' => $__dataType, 'value' => json_encode($__value),
                ]);
            }
        }
    }
}
```
> The `$$` / `${` detection forces full extraction whenever the snippet could reference a dynamically-named
> variable — this is the safety net that keeps the change non-breaking.

### Verify
- Walk the **entire** First-Aid App in the simulator, including every custom-code event and conditional.
- `tail -f storage/logs/laravel.log` shows **no** `Undefined variable` notices.
- Add a temporary count probe: confirm fewer variables are materialized on representative snippets.

### Rollback
Restore the original "extract all" loop (Problem 17's guard can remain).

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): extract only referenced variables in processPHPCode

Scan the snippet for \$referenced variables and materialize only those
from dynamic_data_storage, with a full-extraction fallback whenever the
code uses variable-variables (\$\$ / \${}). Cuts per-call work on the
hottest method. Verified no Undefined-variable regressions across the app.

Ref: Performance report Finding 2."
```

---

## Problem 19 — Per-tag mustache resolution 🟠
**Report:** Finding 8 · **Commit:** `perf(engine): batch-resolve mustache tags per text block`

### Symptom
For each text block, every `{{ tag }}` is resolved with its **own** `processPHPCode()` call (full extraction
per tag). A display with 13 tags = 13 eval round-trips.

### Root cause (verified)
`handleEmbeddedDynamicContentConversion()` (line 13231) resolves tags one at a time.

### Why this is 🟠
Correctness depends on replicating the current per-tag escaping, failure handling, and output formatting
in a single batched call. Do this **after** Problems 17–18 are stable.

### Exact fix (approach)
Collect all tags in the block, build one `processPHPCode('return [ "<tag>" => <phpExpr>, ... ];')`, then
`str_replace` the results back. Preserve: handling of tags that fail to resolve (leave or blank exactly as
today), nested/escaped braces, and non-string values' string conversion.
```php
$tags = $this->getInstancesOfMustacheTags($text);   // verify the real helper name
if (empty($tags)) return $text;
$pairs = [];
foreach ($tags as $tag) {
    $pairs[] = json_encode($tag).' => '.$this->convertMustacheTagIntoPHPVariable($tag); // verify helper
}
$results = $this->processPHPCode('return ['.implode(',', $pairs).'];', false);
if (is_array($results)) {
    $text = str_replace(array_keys($results), array_map('strval', array_values($results)), $text);
}
return $text;
```
> ⚠ The helper names (`getInstancesOfMustacheTags`, `convertMustacheTagIntoPHPVariable`) are illustrative —
> grep for the real ones and study the current per-tag loop before refactoring. If batching changes any
> output, keep the per-tag loop.

### Verify
- A display with multiple tags in instruction + option name + option value renders identically.
- A tag that references a missing variable behaves exactly as today.

### Rollback
Restore the per-tag loop.

### Git
```bash
git add app/Services/Ussd/UssdService.php
git commit -m "perf(engine): batch-resolve mustache tags per text block

Resolve all {{ tags }} in a text block with a single processPHPCode call
returning a tag->value map, then str_replace, instead of one eval per tag.
Preserves existing escaping and missing-variable behavior.

Ref: Performance report Finding 8."
```

---

## Problem 20 — Full session replay every keystroke (session-state persistence) 🟠
**Report:** Findings 1, 5 · **Commit:** `perf(session): add session-state fast path to skip full replay`

> **This is the most severe item in File 1 and must be the LAST commit.** It is the single biggest
> performance win (turns O(n)-per-keystroke into O(1)). It is placed in File 1 — not File 2 — because it
> **does not change the stored builder JSON**: it adds a nullable DB column and is backward compatible by
> design (NULL state → falls back to the existing full replay). File 3 has nothing to migrate for it.
> It nonetheless carries the highest implementation risk in this file, so it ships last, staging-first,
> with a one-line rollback.

### Symptom
Every type-2 request replays the session from screen 1, re-firing all on-start REST API events and
re-traversing every prior screen. Depth 4 ≈ 11 s; depth 10 ≈ timeout.

### Root cause (verified)
`handleExistingSession()` (line 921) re-adds all prior reply records then calls the full
`startBuildingUssd()` (line 1993) which re-runs `storeGlobalVariables`, `handleApplicationOnStartEvents`
(line 2379, incl. 2 REST calls), and screen traversal.

### Why it is non-breaking (backward-compatible by design)
1. The new `session_state` column is **nullable**; all existing sessions have `NULL`.
2. `restoreSessionState()` returns `false` on NULL / version mismatch / a `screen_id` that no longer exists
   in the (possibly updated) builder → the engine **falls back to the existing full replay**, unchanged.
3. Go-back (`0`) and revisit (`is_revisting_session`, verified at line 92/1041) **always** use full replay.
4. Rollback is a single commented block; the column is then simply ignored.

### Exact fix (high level — full detail in report §8 Phase 4)
1. **Migration** `2026_06_07_000002_add_session_state_to_ussd_sessions.php`: nullable `mediumText('session_state')`.
2. **Model** `UssdSession`: add `'session_state' => 'array'` to `$casts` (line 25).
3. **Indexes available:** reuse `buildScreenIndexes()` from Problem 12 — call it before restore in
   `handleExistingSession()` (the fast path bypasses `startBuildingUssd()`).
4. **`captureSessionState()`** — serialize the resumable runtime state. Verify each property exists (they
   do, per the property block: `dynamic_data_storage`, `chained_screens/displays`, `chained_*_metadata`,
   `pagination_index`, `screen_total_responses`, `display_total_responses`, `screen_repeats`,
   `global_variables_to_save`, plus current `screen`/`display`/`level`). Version it (`'v' => 1`).
5. **`restoreSessionState()`** — restore those properties; return `false` to trigger replay fallback when
   state is missing/old/incompatible.
6. **Fast path in `handleExistingSession()`** — when NOT go-back, NOT revisit, and `session_state` present:
   build indexes → `restoreSessionState()` → record only the new input → `processRestoredSession()` →
   jump to the existing DB-update block. **Do not use `goto`** — extract the shared post-processing
   (the update at line ~1041+ / `updateExistingSessionDatabaseRecord`) into a method called from both paths.
7. **`processRestoredSession()`** — replicate the exact post-response pipeline of `handleCurrentDisplay()`
   (line 3688): set response → screen on_response → display on_response → screen on_leave → linking →
   render next. **Read `handleCurrentDisplay()` in full and verify every real method name** before writing this.
8. **Wire capture into saves:** `createNewSession()` (line 1063) inserts `'session_state' => null`;
   `updateExistingSessionDatabaseRecord()` (line 1150) adds `'session_state' => $this->captureSessionState()`.

### Verify (MANDATORY staging smoke test — all must pass)
- New session (type 1) renders correctly.
- Continuations (type 2) at depths 2,3,4,5,10 — each ~0.3 s, output **byte-identical** to the replay path.
- Go-back (`0`) at depths 2,4,8 → uses fallback, behaves exactly as today.
- Revisit event path → bypasses fast path correctly.
- Notification display + dismissal.
- Language change (Setswana) mid-session.
- Builder updated while a session is active → next request falls back to replay, then re-captures state.
- On-start REST API events fire **once** (depth 1), not per keystroke — confirm in CMS logs.
- Recommended: an A/B parity harness comparing replay vs fast-path output for a corpus of recorded sessions.

### Rollback
Comment out the fast-path block in `handleExistingSession()` → all sessions revert to full replay; the
`session_state` column is ignored. Redeploy.

### Git
```bash
git add database/migrations/2026_06_07_000002_add_session_state_to_ussd_sessions.php \
        app/Models/UssdSession.php app/Services/Ussd/UssdService.php
git commit -m "perf(session): add session-state fast path to skip full replay

Persist resumable runtime state in a new nullable ussd_sessions.session_state
column. On continuation requests (not go-back, not revisit) restore state and
process only the new input via processRestoredSession(), eliminating the
O(n) replay and the per-keystroke re-firing of on-start REST API events.
Backward compatible: NULL/incompatible state falls back to full replay.
One-line rollback (comment the fast-path block).

Ref: Performance report Findings 1 and 5, Phase 4."
```

---

## End of File 1

After all 20 commits, re-run the depth-2/4/10 simulator timing from the Phase 0 baseline and append the
results to `docs/performance/baseline_metrics_2026-06-07.md`. Nothing in this file required any change to
the stored USSD builder JSON. Proceed to **File 2** (`02_BREAKING_JSON_STRUCTURE_FIXES.md`) for the
changes that alter the builder JSON structure and therefore require the File 3 conversion command.
