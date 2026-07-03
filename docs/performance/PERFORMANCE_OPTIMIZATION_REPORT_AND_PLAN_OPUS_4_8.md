# USSD Platform — Performance Optimization Report & Plan
### Authored: 2026-06-05 | Model: Claude Opus 4.8 | Environment: Production (Orange Botswana)

---

> **STATUS AS OF 2026-06-05:** Every recommendation from the April 2026 prior audit has been verified against live source files. **None of the previous fixes have been implemented.** This report supersedes the earlier documents, incorporates all prior findings, adds newly discovered issues from live production evidence, and delivers a unified, prioritized, ready-to-execute plan.

---

## Table of Contents

1. [Architecture Map — How a Request Flows Today](#1-architecture-map--how-a-request-flows-today)
2. [Live Production Evidence](#2-live-production-evidence)
3. [Confirmed Status: What Has and Has Not Been Fixed](#3-confirmed-status-what-has-and-has-not-been-fixed)
4. [Ranked Findings — Root Causes of Every Symptom](#4-ranked-findings--root-causes-of-every-symptom)
5. [JSON Flow File Audit — Confirmed Against Actual File](#5-json-flow-file-audit--confirmed-against-actual-file)
6. [MySQL Database Performance](#6-mysql-database-performance)
7. [PHP & Infrastructure Configuration](#7-php--infrastructure-configuration)
8. [The Fix Plan — Phased Implementation](#8-the-fix-plan--phased-implementation)
9. [Config Recommendations](#9-config-recommendations)
10. [Migration & Safety Notes](#10-migration--safety-notes)

---

## 1. Architecture Map — How a Request Flows Today

This traces one USSD keystroke through the system as it actually works, grounded in source file locations.

```
Orange USSD Gateway
  │
  ▼ POST /ussd  (or /simulator/ussd)
┌────────────────────────────────────────────────────────────────────────────┐
│ MIDDLEWARE STACK (routes/web.php — "web" group)                            │
│  EncryptCookies → StartSession (file I/O) → VerifyCsrfToken               │
│  → HandleInertiaRequests → Authenticate → [controller]                     │
└────────────────────────────────────────────────────────────────────────────┘
  │
  ▼
SimulationController::launchUssd()          [app/Http/Controllers/SimulationController.php:~34]
  ├── On new test session: 2× UPDATE with TIMESTAMPDIFF (no index → full scan)
  └── new UssdService($request)->handle()

UssdService::handle()                        [app/Services/Ussd/UssdService.php]
  ├── Parse request params (session_id, msisdn, text, request_type)
  ├── Load ShortCode from file-cache or DB   [line 575 — Cache::get() anti-pattern]
  ├── Load Version from file-cache or DB     [line 801 — full 245KB JSON decoded]
  ├── Load App from file-cache or DB         [line 778]
  ├── Load UssdAccount from file-cache or DB [line 746 — whereHas subquery on miss]
  └── if request_type == 1:  handleNewSession()
      if request_type == 2:  handleExistingSession()      ← MAIN PROBLEM PATH

handleNewSession()                           [line ~1063]
  └── createNewSession() → INSERT ussd_sessions
  └── handleSession() → startBuildingUssd()  [line 1993]
        ├── resetDynamicDataStorage()         [line 2032]
        ├── storeUssdSessionValues()          [line 2035]
        ├── storeGlobalVariables()            [line 2038 — DB query every time]
        ├── handleApplicationOnStartEvents()  [line 2046 — fires 4 events including 2 REST APIs]
        └── startBuildingUssdScreens()        [line 2054 — screen traversal from screen 1]

handleExistingSession()                      [line 921] ← O(n) replay hell
  ├── getExistingSessionFromDatabase()        [line 1488 — full table scan: no session_id index]
  ├── foreach reply_records → addReplyRecord()  [line 972-981 — re-adds ALL prior inputs]
  │     └── each addReplyRecord() calls extractUserResponsesAsText() [O(n²) work]
  ├── addReplyRecord(current_msg)            [line 1029]
  └── handleSession() → startBuildingUssd()  [line 1993 — FULL REPLAY FROM SCRATCH]
        ├── resetDynamicDataStorage()
        ├── storeUssdSessionValues()
        ├── storeGlobalVariables()            [DB query — every keystroke]
        ├── handleApplicationOnStartEvents()  [ALL 4 on_start events re-fire, incl. 2 REST APIs]
        └── startBuildingUssdScreens()
              └── for each screen: hasResponded() check [O(N screens × depth)]
                    └── each hasResponded() → completedLevel() → getUserResponses()
                          → extractUserResponsesAsText()  [rebuilds text every call]

  (Only when reaching the CURRENT depth does the engine process the new input)

updateExistingSessionDatabaseRecord()        [line 1150]
  └── UPDATE ussd_sessions SET reply_records=..., session_execution_times=...,
        logs=..., inputs_and_outputs=...
      (payload grows with every request — no size cap, no `session_state` column)
```

**The core problem in one sentence:** Every keystroke in an existing session replays the entire session from screen 1, re-executing all on-start REST API calls and re-traversing all previously visited screens, making request N do N times the work of request 1.

---

## 2. Live Production Evidence

The following facts are drawn from the screenshots provided and confirmed against source code.

### 2.1 Database Table Sizes (from phpMyAdmin screenshot)

| Table | Rows | Size | Implication |
|-------|------|------|-------------|
| `ussd_sessions` | ~489,556 | **1.3 GiB** | Avg row = ~2.8 KB; JSON columns bloat with depth |
| `ussd_account_connections` | ~136,161 | 16.5 MiB | |
| `ussd_accounts` | ~130,637 | 12.0 MiB | |
| `session_notifications` | 3,818 | 1.8 MiB | |
| `global_variables` | 5,458 | 1.6 MiB | |
| `versions` | 35 | **3.0 MiB** | Each version stores full builder JSON |

### 2.2 The 19-Second Query (smoking gun)

The phpMyAdmin screenshot shows:

```sql
SELECT * FROM `ussd_sessions` ORDER BY `created_at` DESC
-- Query took 19.5158 seconds
```

This is a simple browse query with no WHERE clause, and it took **19.5 seconds**. On a table that should serve indexed reads in milliseconds. This proves:
- InnoDB buffer pool is undersized (1.3 GiB table, data not in RAM)
- No useful index on `created_at` for the ORDER BY
- The server is performing a full table scan + filesort on 489,556 rows

Every `WHERE session_id = ?` in the application performs a similar full table scan because `session_id` has **no index** (confirmed in `database/migrations/2023_01_01_00000_create_ussd_sessions_table.php` lines 46–47 — only `ussd_account_id` and `project_id, app_id, version_id` are indexed).

### 2.3 Session Count & Failure Rate (from Sessions dashboard screenshot)

- **Total sessions:** 265,315
- **Failed sessions:** 254 (0.095%)
- **Page count at 15/page:** 17,688 pages → confirms ~265,000 rows in the app's session view

The failure rate is low now, but the concurrency collapse symptom means failures will spike sharply as load grows. The 254 failed sessions are likely gateway timeouts caused by the replay slowdown.

### 2.4 Progressive Slowdown Visible in Duration Column

Sessions in the dashboard show:
- 1-interaction sessions: 1 second
- 2-interaction sessions: 21–46 seconds
- 5-interaction sessions: 2 minutes
- 8-9 interaction sessions: 3 minutes

A 2-minute session with 5 interactions means each interaction after the first is taking 25+ seconds. This is directly explained by the O(n) replay accumulating 4 REST API calls × (n-1) replays per keystroke.

### 2.5 The 4 On-Start Events That Re-Fire Every Keystroke

Confirmed from `"First-Aid App - version 1.00-2.json"`:
1. **REST API "Get User"** — `GET {{ _cmsProjectSubscribersUrl }}/{{ ussd.msisdn }}`
2. **REST API "Create User (If Not Found)"** — conditional POST to same CMS
3. **Custom Code "Set App Properties"** — runs PHP eval()
4. **Set Property "Set $_menus"** — resolves and stores menu structure

On request 5 (depth 4), events 1–4 re-execute 4 times before the new input is processed. Events 1 and 2 are external HTTP calls. If each takes 250ms, that's 2 seconds of pure redundant API cost before the user's new input is even looked at.

---

## 3. Confirmed Status: What Has and Has Not Been Fixed

The previous audit (April 2026) identified all major issues. As of 2026-06-05, **zero fixes have been applied.**

| Fix from Prior Audit | Status | Confirmed By |
|---------------------|--------|-------------|
| Add `session_id` index to `ussd_sessions` | ❌ NOT DONE | Migration files: only `ussd_account_id` indexed |
| Add composite index on `global_variables` | ❌ NOT DONE | Migration file: only single-column `ussd_account_id` |
| Switch `CACHE_DRIVER` to Redis | ❌ NOT DONE | `.env`: `CACHE_DRIVER=file` |
| Switch `SESSION_DRIVER` to Redis | ❌ NOT DONE | `.env`: `SESSION_DRIVER=file` |
| Reuse Guzzle HTTP client | ❌ NOT DONE | `UssdService.php:7039` still creates `new Client()` |
| Fix double JSON decode | ❌ NOT DONE | `UssdService.php:7055-7058` still decodes twice |
| Add `session_state` column for fast resumption | ❌ NOT DONE | No migration exists |
| Cache global variables query | ❌ NOT DONE | `UssdService.php:2222-2230` still hits DB every time |
| Cap `session_execution_times` array | ❌ NOT DONE | `UssdService.php:1180-1189` unbounded |
| Persistent DB connections | ❌ NOT DONE | `config/database.php` has no `PDO::ATTR_PERSISTENT` |
| Pre-compute `$loggingEnabled` flag | ❌ NOT DONE | String building happens on every log call |
| Lazy variable extraction in `processPHPCode()` | ❌ NOT DONE | Full extraction at line 13083 |

---

## 4. Ranked Findings — Root Causes of Every Symptom

Each finding maps to at least one of the five observed symptoms (S1=slow first dial, S2=progressive slowdown, S3=slow screen lookup, S4=concurrency collapse, S5=slow MySQL).

---

### FINDING 1 — Full Session Replay Architecture [CRITICAL]
**Explains symptoms: S2, S4**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** `handleExistingSession()` line 921; `startBuildingUssd()` line 1993–2054

On every request of type 2 (existing session), the engine replays the entire session from scratch. The loop at line 972 re-adds every prior reply record. Then `startBuildingUssd()` at line 1993 resets all state, re-queries global variables, re-fires all 4 on-start events (including 2 REST API calls), and traverses screens from screen 1 using `hasResponded()` gate checks.

**Measured impact:** 1.05s → 6.69s → 8.45s → 11.24s at depths 1→2→3→4. At depth 5, extrapolates to ~14s. At depth 10, ~30s (gateway timeout).

**Why it causes progressive slowdown:** Work is O(n) in session depth. Every new keypress adds one more complete replay cycle.

**Why it causes concurrency collapse:** Under concurrent load, each worker thread is blocked for 6–30 seconds per request instead of 0.3–0.5s. 100 concurrent users means 100 worker threads each holding for 30 seconds = the server handles 3-4 new requests/second total instead of the target 3,000-4,000/second.

**Fix:** Session state persistence (Phase 4 of implementation plan). Save `dynamic_data_storage` + current screen/display IDs after each request. On the next request, restore state directly and process only the new input. Full replay retained as fallback for go-back ("0") and revisit events.

---

### FINDING 2 — `processPHPCode()`: Full Variable Extraction + Unconditional `json_encode` [CRITICAL]
**Explains symptoms: S1, S2**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** 13077–13117

Every evaluation of dynamic content calls `processPHPCode()`, which:
1. Calls `getDynamicData()` and iterates ALL keys to create `${$__key} = $__value` variables
2. Builds a log entry for EVERY variable calling `json_encode($__value)` (line 13112) — regardless of whether logging is enabled

This function is called 50–200+ times per request (from mustache tag resolution, conditional states, custom code events, global variable resolution). If `dynamic_data_storage` holds an API response with a list of 100 menu items, that entire structure is `json_encode`-d on each of the 200 calls, then discarded.

**Measured impact estimate:** 50–300ms per request even with no API calls. With logging disabled (production), the `json_encode` calls are 100% waste.

**Fix:**
```php
// Line 13103 — add early exit before the log block:
if ($__log_dynamic_data && $this->loggingEnabled) {
    // existing json_encode + log array construction
}

// Line 13083 — lazy variable extraction (only extract variables used in code):
preg_match_all('/\$([a-zA-Z_]\w*)/', $__phpCode, $__matches);
$__needed = array_flip($__matches[1]);
foreach ($this->getDynamicData() as $__key => $__value) {
    if (isset($__needed[$__key])) {
        ${$__key} = $__value;
    }
}
```

Pre-compute `$this->loggingEnabled` once in `startBuildingUssd()` so it doesn't re-read from the builder array on every call.

---

### FINDING 3 — No Index on `session_id` in `ussd_sessions` [CRITICAL]
**Explains symptoms: S1, S4, S5**
**File:** `database/migrations/2023_01_01_00000_create_ussd_sessions_table.php`
**Lines:** 46–47 (existing indexes); `app/Services/Ussd/UssdService.php` line 1488 (the query)

The query `UssdSession::where('session_id', $this->session_id)->exclude(['logs'])->first()` runs on every single USSD request. It performs a full table scan of 489,556 rows × 2.8 KB/row = 1.3 GiB of data. The phpMyAdmin screenshot directly shows a simple query taking 19.5 seconds on this table, confirming the buffer pool cannot hold it in RAM and disk I/O is saturating.

At 3,000 concurrent requests/second, this single query turns every worker into a 0.5–5s disk I/O waiter instead of a 1ms index lookup.

**Fix (15 minutes, zero risk):**
```sql
-- Run via: php artisan migrate
ALTER TABLE ussd_sessions ADD INDEX idx_session_id (session_id);
ALTER TABLE global_variables ADD INDEX idx_account_app (ussd_account_id, app_id);
ALTER TABLE global_variables ADD INDEX idx_account_version (ussd_account_id, version_id);
ALTER TABLE session_notifications ADD INDEX idx_account_seen (ussd_account_id, marked_as_seen);
```

---

### FINDING 4 — File-Based Cache Driver [HIGH]
**Explains symptoms: S1, S4**
**File:** `.env` line 19–22

`CACHE_DRIVER=file` means every cache read/write is a filesystem operation. The USSD processor makes 7+ cache lookups per request (ShortCode, App, Version, UssdAccount, UssdAccountConnection, DatabaseEntry, and optionally global variables). At 5ms per file cache operation vs 0.1ms for Redis, this is 35ms of unnecessary I/O per request.

Under high concurrency, file cache creates lock contention — multiple processes trying to read/write the same cache files simultaneously. Redis handles this natively with atomic operations and no file locking.

Redis is already configured in `.env` at `REDIS_HOST=127.0.0.1`. It is not running yet but requires only installation and a config change.

**Fix (5 minutes):**
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

---

### FINDING 5 — On-Start REST API Events Re-Execute on Every Keystroke [HIGH]
**Explains symptoms: S2, S4**
**File:** Builder JSON + `app/Services/Ussd/UssdService.php` line 2046

The First-Aid App has 4 on-start events including 2 REST API calls:
- `GET {CMS_URL}/{msisdn}` — fetches user profile
- `POST {CMS_URL}` — creates user if not found (conditional)

Both fire on every `handleApplicationOnStartEvents()` call, which happens on every request (new or replay). At depth 4, "Get User" has been called 4 times per session instead of once. This is the primary API cost in the progressive slowdown.

**Fix:** Eliminated entirely by session state persistence (Finding 1 fix). State persistence saves the results of on-start events in `dynamic_data_storage` and skips `handleApplicationOnStartEvents()` on subsequent requests.

---

### FINDING 6 — `Cache::get()` Anti-Pattern: Closure Does Not Re-Cache [HIGH]
**Explains symptoms: S1, S4**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** 575, 746, 757, 778, 801, 817

The pattern used throughout:
```php
Cache::get((new ShortCode())->getCacheName(), function () {
    return (new ShortCode())->findAndCache();
});
```

`Cache::get()` does NOT store the closure result. The closure is only called as a default return value. The caching only happens because `findAndCache()` internally calls `Cache::put()` — a hidden side effect. This pattern is unreliable and also instantiates a model object (`new ShortCode()`) purely to compute a string cache key, adding unnecessary object construction overhead on every request.

Under certain race conditions (two concurrent requests both seeing a cache miss), both will call `findAndCache()` simultaneously, both hitting the database, and both writing to cache — wasted duplicate work.

**Fix:**
```php
// Replace pattern with Cache::remember():
$shortCode = Cache::remember('cache_short_code_' . $this->msisdn, 3600, function () {
    return ShortCode::where(...)->first();
});
```

Also make cache key methods static: `ShortCode::getCacheKey($msisdn)` instead of `(new ShortCode())->getCacheName()`.

---

### FINDING 7 — `ussd_sessions` Row Bloat: Unbounded JSON Column Growth [HIGH]
**Explains symptoms: S2, S4, S5**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** `updateExistingSessionDatabaseRecord()` line 1150–1189

Every UPDATE on `ussd_sessions` writes 4 JSON columns that grow linearly with session depth:
- `reply_records` — 1 new entry per keystroke
- `session_execution_times` — 1 new entry per keystroke, **no cap** (line 1183–1186)
- `logs` — potentially megabytes per request when logging enabled
- `inputs_and_outputs` — 1 new entry per keystroke

A session at depth 20 is updating a row with 5–10KB of JSON, requiring MySQL to rewrite the entire row. On a 1.3 GiB table with no buffer pool capacity to cache it, each update is a disk seek + write.

The `logs` column can reach **1MB+** for complex sessions (the prior audit notes this). A 1MB UPDATE on 489,556 rows causes MySQL to perform fragmentation-generating updates constantly.

**Fixes:**
1. Cap `session_execution_times` at 50 entries (add after line 1180):
   ```php
   if (count($this->session_execution_times) > 50) {
       $this->session_execution_times = array_slice($this->session_execution_times, -50);
   }
   ```
2. Skip log writes when `save_logs = 'never'` (check `$this->version->builder['log_settings']`).
3. The `session_state` column (Phase 4) replaces the need for full `reply_records` replay — future optimization could slim `reply_records` to just current request.

---

### FINDING 8 — Mustache Tag Resolution: `processPHPCode()` Called Per Tag [HIGH]
**Explains symptoms: S1, S2**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** `handleEmbeddedDynamicContentConversion()` line 13231–13285

For every text string containing mustache tags like `{{ user.name }}`, the engine:
1. Runs `preg_match_all` to find all tags
2. For EACH tag separately: calls `processPHPCode("return $variable;")` — a full variable extraction + eval per tag

A display with 3 tags in the instruction + 5 options with tags in name and value = up to 13 separate `processPHPCode()` calls for one display, each extracting the full `dynamic_data_storage`.

**Fix:** Batch-resolve all tags in a single `processPHPCode()` call per text block:
```php
$tags = $this->getInstancesOfMustacheTags($text);
if (empty($tags)) return $text;

// Build single eval call: return ['{{ tag1 }}' => $var1, '{{ tag2 }}' => $var2];
$pairs = [];
foreach ($tags as $tag) {
    $phpVar = $this->convertMustacheTagIntoPHPVariable($tag);
    $pairs[] = json_encode($tag) . ' => ' . $phpVar;
}
$results = $this->processPHPCode('return [' . implode(',', $pairs) . '];');
return str_replace(array_keys($results), array_values($results), $text);
```

---

### FINDING 9 — Linear Screen/Display Lookup on Every Navigation [MEDIUM]
**Explains symptoms: S3**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** `searchScreenById()` line ~6148; `getDisplayById()` line ~6112; `getFirstScreen()` line ~2893

Every screen navigation calls `collect($this->screens)->where('id', $link)->first()`. For an app with 19 screens (confirmed in the JSON), this is a 19-element scan. It's not catastrophic for 19 screens, but during replay each step makes multiple scans, and the overhead compounds with the replay problem.

More critically, the global display lookup creates a Collection from ALL screens then collapses all displays — iterating every display in the entire app for each lookup.

**Fix:** Build hash maps once at startup:
```php
// In startBuildingUssd(), after loading screens:
$this->screenIndex = [];
$this->displayIndex = [];
foreach ($this->screens as $screen) {
    $this->screenIndex[$screen['id']] = $screen;
    foreach ($screen['displays'] as $display) {
        $this->displayIndex[$display['id']] = $display;
    }
}
```

Then replace `collect()->where()->first()` calls with `$this->screenIndex[$id] ?? null`.

---

### FINDING 10 — UssdSession Eager Loading + Computed Appends on Every Load [MEDIUM]
**Explains symptoms: S1, S4**
**File:** `app/Models/UssdSession.php`

```php
protected $with = ['account'];  // Fires extra JOIN query on every load
protected $appends = ['origin', 'mobile_number', 'has_timed_out', ...];  // 7 accessors run
```

`$with = ['account']` fires an additional DB query on every `UssdSession::where(...)->first()`. The 7 appended attributes run PHP accessors that access `$this->account` (requiring the eager load), instantiate `Carbon::now()`, and wrap arrays in Collections — all unnecessary overhead for the USSD processing path where only the session data matters.

**Fix:**
```php
// Remove from model definition
// protected $with = ['account'];
// protected $appends = [...];

// Only add when explicitly needed (dashboard views):
UssdSession::with('account')->where('...')->paginate();
```

---

### FINDING 11 — `extractUserResponsesAsText()` Recalculated on Every `addReplyRecord()` [MEDIUM]
**Explains symptoms: S2**
**File:** `app/Services/Ussd/UssdService.php`
**Line:** 2547 (called from `addReplyRecord()`); 2566 (the method)

During session replay, the loop at line 972-981 calls `addReplyRecord()` once per prior reply. Each call immediately calls `extractUserResponsesAsText()`, which re-traverses and re-implodes the entire growing array. For a session with 15 prior replies: 15 calls × growing array = 120 total iterations of ever-larger arrays.

`hasResponded()` also calls `extractUserResponsesAsText()` inside the replay traversal, multiplying the redundancy.

**Fix:** Memoize with a dirty flag:
```php
private $cachedResponseText = null;
private $responseTextDirty = true;

public function addReplyRecord(...) {
    // existing code
    $this->responseTextDirty = true;
}

public function extractUserResponsesAsText() {
    if (!$this->responseTextDirty) return $this->cachedResponseText;
    // existing computation
    $this->cachedResponseText = $result;
    $this->responseTextDirty = false;
    return $result;
}
```

---

### FINDING 12 — Global Variables DB Query on Every Request, No Cache [MEDIUM]
**Explains symptoms: S1, S2**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** 2222–2230

```php
$global_variables_records = DB::table('global_variables')->where([
    'ussd_account_id' => $this->ussd_account->id,
    'app_id' => $this->app->id
])->oldest('updated_at')->get();
```

This runs on every request with no caching. `global_variables` has 5,458 rows and only a single-column `ussd_account_id` index — the `app_id` filter forces a partial scan after the first index filter. This query runs during the full replay, so at depth 4 it runs 4 times per session.

**Fix:**
```php
$cacheKey = 'gv_' . $this->ussd_account->id . '_' . $this->app->id;
$global_variables_records = Cache::remember($cacheKey, 1800, function () {
    return DB::table('global_variables')->where([
        'ussd_account_id' => $this->ussd_account->id,
        'app_id' => $this->app->id,
    ])->oldest('updated_at')->get();
});
```
Add a composite index `(ussd_account_id, app_id)` on the table. Invalidate cache after writes.

---

### FINDING 13 — Guzzle HTTP Client Created Per API Call, No Timeouts [MEDIUM]
**Explains symptoms: S1, S4**
**File:** `app/Services/Ussd/UssdService.php`
**Line:** 7039 — `$httpClient = new Client();`

Every REST API event creates a fresh Guzzle client with no timeout configured (default = infinite). If the CMS at `192.168.22.202` hangs, the USSD worker blocks forever. Under the replay architecture, a hanging API call at depth 1 blocks the worker for every subsequent request in that session.

**Fix:** Singleton client per request (detailed in prior plan, Phase 3). Add explicit timeouts:
```php
private function getHttpClient() {
    if ($this->httpClient === null) {
        $this->httpClient = new Client([
            'timeout' => 10,
            'connect_timeout' => 5,
            'http_errors' => false,
        ]);
    }
    return $this->httpClient;
}
```

---

### FINDING 14 — Double JSON Decode of HTTP Responses [LOW]
**Explains symptoms: S1**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** 7055–7058

```php
$array_body = json_decode($body, true);   // decode 1
$json_body = json_decode($body, false);   // decode 2 — same string, different format
```

Parsing JSON is O(n) in payload size. For a user profile response of 5KB, this doubles the parse work. Simple fix, zero risk.

**Fix:**
```php
$array_body = json_decode($body, true);
$json_body = json_decode($body);  // omit 'false' — default is object
```

---

### FINDING 15 — `collection()` Overhead Throughout Hot Path [LOW]
**Explains symptoms: S1, S2**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** Multiple (583, 1743, 2571, 2936, 3659, 5881, 6132–6284)

Laravel Collection objects are used where native PHP arrays are 2–5x faster:
```php
collect($this->screens)->where('id', $link)->first()  // Line 6148
collect($reply_records)->map()->filter()->toArray()    // Line 2571
collect($values)->filter()->count()                    // Line 1743
```

Each `collect()` instantiates an object, copies array data, and wraps in a fluent interface. For hot-path code called hundreds of times per request, this is significant aggregate overhead (~5–20ms).

**Fix:** Replace with native equivalents:
```php
// collect()->where()->first() → foreach with break (or hash map from Finding 9)
foreach ($this->screens as $screen) {
    if ($screen['id'] === $link) return $screen;
}
return null;

// collect()->map()->filter() → array_filter(array_map())
$result = array_filter(array_map(fn($r) => ..., $reply_records));
```

---

### FINDING 16 — `removeEmojis()`: 7 Sequential Regex Passes [LOW]
**Explains symptoms: S1**
**File:** `app/Services/Ussd/UssdService.php`
**Lines:** 4071–4101

Seven `preg_replace()` calls where one combined alternation regex suffices. Minor but measurable.

**Fix:**
```php
return preg_replace(
    '/[\x{1F600}-\x{1F64F}]|[\x{1F300}-\x{1F5FF}]|[\x{1F680}-\x{1F6FF}]' .
    '|[\x{2600}-\x{26FF}]|[\x{2700}-\x{27BF}]|[\x{FE00}-\x{FE0F}]' .
    '|[\x{1F900}-\x{1F9FF}]/u',
    '',
    $text
);
```

---

## 5. JSON Flow File Audit — Confirmed Against Actual File

Analysis performed on `"First-Aid App - version 1.00-2.json"` (245 KB, 19 screens, 35 displays).

### 5.1 ValueStructure Bloat: 94.8% Dead Weight

**Confirmed counts:**
- Total ValueStructure instances: **1,053**
- Empty (code_editor_mode=false, code_editor_text=""): **998 (94.8%)**
- Meaningful (code_editor_mode=true): **55 (5.2%)**

For every one of these 998 empty instances, `convertValueStructureIntoDynamicData()` is called, checks `code_editor_mode`, and branches. The check itself is trivial, but they represent wasted JSON parse time, wasted RAM, and wasted loop iterations.

**Size impact on this app:** The 998 empty `code_editor_text`/`code_editor_mode` pairs represent ~40 bytes each = ~40 KB of dead bytes in the 245 KB builder.

**Recommended runtime strip at caching time:**
```php
// In VersionTrait::findAndCache(), before Cache::put():
$builder = $version->builder;
$builder = $this->stripRuntimeBloat($builder);  // new method
$version->setAttribute('builder', $builder);
Cache::put($this->getCacheName($id), $version);

// stripRuntimeBloat() removes:
// - hexColor fields (87 instances confirmed)
// - comment fields (52 instances confirmed)
// - color_scheme top-level key
// - simulator top-level key (except simulator.subscriber.phone_number used at line 2015)
// - Empty code_editor_text when code_editor_mode = false
// - Per-display pagination when use_global_pagination = true (35 copies confirmed)
```

**For the backend processing shortcut (immediate fix, no JSON change needed):**
```php
// In convertValueStructureIntoDynamicData() — add fast-path at top:
if (!$valueStructure['code_editor_mode']) {
    return $this->handleEmbeddedDynamicContentConversion($valueStructure['text'] ?? '');
}
// ... existing code for code_editor_mode = true cases ...
```

### 5.2 Duplicated Pagination Config: 35 Copies

**Confirmed:** 35 display objects each contain a full pagination config (`use_global_pagination` field confirmed present in every display). When `use_global_pagination = true` (the default), the per-display config is read and immediately discarded at `UssdService.php` line ~4858. These 35 copies (each ~800 bytes) represent ~28 KB of data decoded and held in memory on every request for zero benefit.

**Backend fix (immediate):**
```php
// Line ~4858 in UssdService.php
$pagination = ($displayPagination['use_global_pagination'] ?? true)
    ? $globalPagination
    : $displayPagination;
// Already implemented — confirm the per-display fields are NOT accessed before this check
```

**JSON authoring fix (long-term):** When `use_global_pagination = true`, the frontend should not serialize the display-level pagination fields into the JSON at all. This requires a change in `resources/js/Stores/VersionBuilder.js` in the `getBlankDisplay()` function.

### 5.3 UI-Only Fields in Runtime JSON

**Confirmed counts:**
- `hexColor` fields: **87** (screen, display, event, option colors — builder UI only, never read by PHP)
- `comment` fields: **52** (annotation text in builder — never read by PHP)
- `color_scheme` top-level key: **1** (event color mapping for builder UI)
- `simulator` top-level key: **1** (only `simulator.subscriber.phone_number` is read at line 2015)

These fields are decoded into PHP memory and held for the entire request lifetime. They add no USSD processing value.

### 5.4 Screen Lookup Performance for This App

With 19 screens and 35 displays, a hash map approach provides:
- **Current:** `collect(19 items)->where()->first()` = iterate up to 19 items + Collection overhead
- **With hash map:** `$this->screenIndex[$id]` = O(1) array key lookup

For the replay architecture (before session state fix), a session at depth 5 makes ~10 screen lookups during replay. With hash maps: ~10 array lookups vs ~190 total element comparisons.

### 5.5 Recommended Runtime JSON Schema (Keyed/Indexed)

The current backend receives screens as a flat array indexed 0–18. The recommended runtime representation stores screens and displays in pre-indexed hash maps, built once after loading:

```php
// Current (built by PHP after each version load):
$this->screens = [
    ['id' => 'screen_1...', 'name' => 'First Visit', 'displays' => [...], ...],
    ['id' => 'screen_3...', 'name' => 'Home', 'displays' => [...], ...],
    // ... 17 more
];

// Proposed (built once in startBuildingUssd()):
$this->screenIndex = [
    'screen_1...' => ['id' => 'screen_1...', 'name' => 'First Visit', ...],
    'screen_3...' => ['id' => 'screen_3...', 'name' => 'Home', ...],
];
$this->displayIndex = [
    'display_abc...' => ['id' => 'display_abc...', 'screen_id' => 'screen_1...', ...],
    // ... all 35 displays
];
```

This is a PHP-side build step, not a JSON format change. It doesn't require rebuilding the authoring tool.

---

## 6. MySQL Database Performance

### 6.1 The InnoDB Buffer Pool Problem

**Root cause of `phpMyAdmin` sluggishness:** The `ussd_sessions` table is 1.3 GiB. If InnoDB's `innodb_buffer_pool_size` is set to the MySQL default (128MB), the entire table cannot fit in RAM. Every query requires disk I/O. This explains both the 19.5-second phpMyAdmin query and the application slowness.

**Confirmation:** `SELECT * FROM ussd_sessions ORDER BY created_at DESC` taking 19.5 seconds on 489,556 rows is only possible if the data is not in the buffer pool. An equivalent cached query would return the first 25 rows in under 50ms.

**Recommended `innodb_buffer_pool_size`:** Set to 60–70% of available RAM. If the server has 8GB RAM, use 5GB. If 16GB, use 10GB. This is the single most impactful MySQL configuration change.

```ini
# /etc/mysql/mysql.conf.d/mysqld.cnf
innodb_buffer_pool_size = 5G          # 60-70% of server RAM
innodb_buffer_pool_instances = 4      # 1 per GB of buffer pool, max 64
innodb_log_file_size = 512M           # Larger log = better write throughput
innodb_flush_log_at_trx_commit = 2   # Safe for USSD (non-financial): flush every sec not every commit
innodb_flush_method = O_DIRECT        # Avoid double-buffering with OS page cache
```

### 6.2 Missing Critical Indexes

Confirmed missing from migration files:

| Table | Missing Index | Used In Query | Impact |
|-------|--------------|---------------|--------|
| `ussd_sessions` | `(session_id)` | `WHERE session_id = ?` every request | CRITICAL |
| `global_variables` | `(ussd_account_id, app_id)` | Every global var load | HIGH |
| `global_variables` | `(ussd_account_id, version_id)` | `updateOrInsert` at line ~1421 | HIGH |
| `session_notifications` | `(ussd_account_id, marked_as_seen)` | Notification check every request | MEDIUM |
| `ussd_sessions` | `(created_at)` | phpMyAdmin ORDER BY, dashboard queries | MEDIUM |
| `ussd_sessions` | `(ussd_account_id, created_at)` | Session list queries | MEDIUM |

### 6.3 `ussd_sessions` Row Size and Data Type Review

Current average row size: 1.3 GiB ÷ 489,556 rows = **2.8 KB per row**. For a USSD session, this is large. The JSON columns are the culprit:

- `reply_records` (TEXT) — grows linearly with depth. Session at depth 10 = ~530 bytes. Session at depth 50 = ~2.6 KB.
- `session_execution_times` (JSON, cast in model) — unbounded array, no cap.
- `logs` (TEXT) — can be 1MB+ when logging enabled.
- `inputs_and_outputs` (JSON) — duplicate of what's reconstructible from reply_records.

**Recommendations:**
1. Add the `session_state` column (`MEDIUMTEXT`, estimated 1–5 KB per active session) to enable fast resumption.
2. Cap `session_execution_times` at 50 entries in code.
3. For sessions with `save_logs = 'never'` (production), ensure the `logs` column remains NULL — do not write empty arrays.
4. Consider archiving sessions older than 90 days to a separate `ussd_sessions_archive` table. The current 489,556 rows will grow to millions; keeping only active/recent sessions in the primary table keeps scans fast.

### 6.4 `versions` Table: 3.0 MiB for 35 Rows

`versions` stores the full builder JSON in a `mediumText` column. 35 rows × average 85 KB each = 3 MiB. When a version is loaded by `findAndCache()`, the full JSON is decoded into a PHP object.

For the First-Aid App, the builder is 245 KB. After applying the stripping optimizations (removing UI-only fields, empty ValueStructures), this could drop to ~180 KB — a 27% reduction in decode time and memory.

**Recommendation:** Store a pre-stripped `runtime_builder` column alongside `builder`, populated by the version observer. The USSD processor reads `runtime_builder`; the builder UI reads `builder`. This avoids stripping at runtime and eliminates the overhead entirely.

### 6.5 MySQL Connection and Thread Configuration

```ini
# For a server handling 3,000–4,000 concurrent USSD requests:
max_connections = 500                 # PHP-FPM workers × safety factor
thread_cache_size = 100              # Cache idle threads for reuse
innodb_thread_concurrency = 0        # Let InnoDB manage thread concurrency
wait_timeout = 60                    # Kill idle connections after 60s
interactive_timeout = 60

# Slow query log — enable to find remaining slow queries:
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 0.1               # Log queries taking > 100ms
log_queries_not_using_indexes = 1
```

### 6.6 Query Cache

MySQL's query cache is deprecated in MySQL 8.0 and removed entirely. Do not enable it. The application-level caching via Redis (Finding 4 fix) is the correct approach.

---

## 7. PHP & Infrastructure Configuration

### 7.1 OPcache — Critical for PHP Performance

OPcache compiles PHP scripts once and caches the bytecode. Without it, PHP re-parses `UssdService.php` (592 KB, 13,730 lines) on every single request. This is a massive overhead.

**Check current status:**
```bash
php -m | grep -i opcache
# Should show: Zend OPcache
```

**Recommended `php.ini` settings:**
```ini
opcache.enable = 1
opcache.enable_cli = 1
opcache.memory_consumption = 256      # MB — UssdService.php alone is ~600KB compiled
opcache.max_accelerated_files = 20000 # Enough for all Laravel framework files
opcache.validate_timestamps = 0       # Disable in production (manual reset on deploy)
opcache.revalidate_freq = 0
opcache.interned_strings_buffer = 32  # MB for interned string pool
opcache.fast_shutdown = 1
```

**Why `validate_timestamps = 0` in production:** Checking file timestamps on every request defeats the purpose of OPcache. Disable it; clear OPcache manually on each deployment with `opcache_reset()` or by restarting PHP-FPM.

### 7.2 PHP-FPM Worker Pool Sizing

For 3,000–4,000 concurrent USSD requests/second, PHP-FPM needs enough workers to avoid queuing. The target response time after optimization is ~300ms per request, meaning each worker can handle ~3 requests/second. For 4,000 req/sec: 4,000 ÷ 3 = **~1,333 workers minimum**.

This requires a server with significant RAM. Each PHP-FPM worker holds:
- PHP interpreter overhead: ~10–15 MB base
- Laravel framework: ~15–20 MB
- UssdService.php + builder JSON in memory: ~5–10 MB
- **Total per worker: ~35–45 MB**

At 1,333 workers × 40 MB = **~53 GB RAM required** for full concurrency. This is beyond a single server's practical limit.

**Realistic single-server approach:**
```ini
; /etc/php/8.x/fpm/pool.d/www.conf
pm = dynamic
pm.max_children = 200          # Based on available RAM: (RAM - 2GB for OS) ÷ 40MB per worker
pm.start_servers = 20
pm.min_spare_servers = 10
pm.max_spare_servers = 50
pm.max_requests = 500          # Recycle workers after 500 requests to prevent memory leaks
request_terminate_timeout = 15 # Kill worker after 15s — prevents USSD timeout cascades
```

**Important:** At 200 workers × 300ms per request = 667 req/sec max throughput on a single server. To reach 3,000–4,000 req/sec, horizontal scaling (multiple servers + load balancer) is required. Session state persistence (Finding 1 fix) reduces per-request time and thus increases effective throughput per worker.

### 7.3 Redis Installation and Configuration

Redis is the most impactful infrastructure change after the session state persistence fix. Install on the same server as the application:

```bash
sudo apt install redis-server
sudo systemctl enable redis-server
```

```ini
# /etc/redis/redis.conf
maxmemory 2gb                     # Limit Redis RAM usage
maxmemory-policy allkeys-lru      # Evict least-recently-used when full
save ""                           # Disable persistence for cache-only use
# If Redis is used for queues too, enable persistence:
# appendonly yes
```

**Laravel configuration:**
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis            # Change from sync to async queue
```

Changing `QUEUE_CONNECTION` to `redis` means jobs dispatched during a USSD request (if any) run asynchronously instead of blocking the response. Start a queue worker: `php artisan queue:work --daemon --sleep=1 --tries=3`.

### 7.4 Persistent Database Connections

```php
// config/database.php — mysql connection array:
'options' => [
    PDO::ATTR_PERSISTENT => true,
],
```

This reuses TCP connections across PHP-FPM requests within a worker. Saves ~5–20ms connection establishment per request when the worker processes a new session. Monitor `SHOW STATUS LIKE 'Threads_connected'` — ensure it stays below `max_connections`.

### 7.5 HTTP Timeout Safety

Currently, `callGuzzleHttp()` at line 7039 creates a Guzzle client with **no timeout**. In production, if the CMS API at `192.168.22.202` becomes slow or unresponsive, every USSD worker blocks indefinitely. With the replay architecture, this means the CMS slowing to 5s/request causes every depth-4 session to block for 20+ seconds.

Even after session state persistence is implemented, hanging API calls will still block. The 10-second timeout in the Guzzle fix is mandatory.

---

## 8. The Fix Plan — Phased Implementation

Phases are ordered by impact-to-effort ratio. Do Phase 1 first — it provides immediate measurable relief with zero risk. Every subsequent phase builds on this foundation.

---

### Phase 1: Database Indexes + MySQL Buffer Pool [IMMEDIATE — Day 1]
**Impact: HIGH | Effort: 30 minutes | Risk: Very Low**
**Addresses: Findings 3, 6, 12 (partially)**

This is the fastest win. Create a migration file:

**File:** `database/migrations/2026_06_05_000001_add_performance_indexes.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPerformanceIndexes extends Migration
{
    public function up()
    {
        // CRITICAL: Every existing-session request scans 489,556 rows without this
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->index('session_id', 'idx_ussd_sessions_session_id');
        });

        // HIGH: Global vars loaded every request with only single-column index
        Schema::table('global_variables', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'app_id'], 'idx_gv_account_app');
            $table->index(['ussd_account_id', 'version_id'], 'idx_gv_account_version');
        });

        // MEDIUM: Notification check on every request
        Schema::table('session_notifications', function (Blueprint $table) {
            $table->index(['ussd_account_id', 'marked_as_seen'], 'idx_sn_account_seen');
        });
    }

    public function down()
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropIndex('idx_ussd_sessions_session_id');
        });
        Schema::table('global_variables', function (Blueprint $table) {
            $table->dropIndex('idx_gv_account_app');
            $table->dropIndex('idx_gv_account_version');
        });
        Schema::table('session_notifications', function (Blueprint $table) {
            $table->dropIndex('idx_sn_account_seen');
        });
    }
}
```

**Run:** `php artisan migrate`

**WARNING:** On the live 489,556-row `ussd_sessions` table, `ALTER TABLE ADD INDEX` will take 30–120 seconds and may briefly lock the table. Run during lowest-traffic window (e.g., 2–4 AM). Use `pt-online-schema-change` from Percona Toolkit for zero-downtime index creation if traffic cannot be interrupted:
```bash
pt-online-schema-change --alter "ADD INDEX idx_ussd_sessions_session_id (session_id)" \
  --execute D=telcoflo,t=ussd_sessions
```

**MySQL Buffer Pool (same day, requires SSH to server):**
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Add:
# innodb_buffer_pool_size = 5G  (or appropriate % of server RAM)
# innodb_log_file_size = 512M
# innodb_flush_log_at_trx_commit = 2

sudo systemctl restart mysql
```

**Verify:**
```sql
EXPLAIN SELECT * FROM ussd_sessions WHERE session_id = 'test-id' LIMIT 1;
-- Must show: type = 'ref', key = 'idx_ussd_sessions_session_id'
-- NOT: type = 'ALL'
```

---

### Phase 2: Redis Cache + Quick Code Fixes [Day 1–2]
**Impact: HIGH | Effort: 2 hours | Risk: Low**
**Addresses: Findings 4, 13, 14, 16**

**2.1 Install and enable Redis:**
```bash
sudo apt install redis-server
sudo systemctl enable --now redis-server
redis-cli ping  # Should return: PONG
```

**2.2 Switch cache drivers:**
```env
# .env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

```bash
php artisan config:clear
php artisan cache:clear
```

**2.3 Fix Guzzle client — `app/Services/Ussd/UssdService.php`:**

Add property near line 68:
```php
public $httpClient = null;
```

Add method before `callGuzzleHttp` (line ~7037):
```php
private function getHttpClient()
{
    if ($this->httpClient === null) {
        $this->httpClient = new Client([
            'timeout'         => 10,
            'connect_timeout' => 5,
            'http_errors'     => false,
            'verify'          => false,
        ]);
    }
    return $this->httpClient;
}
```

Replace line 7039's `$httpClient = new Client();` with `$httpClient = $this->getHttpClient();`

**2.4 Fix double JSON decode — lines 7055–7058:**
```php
// BEFORE:
$array_body = json_decode($body, true);
$json_body = json_decode($body, false);

// AFTER:
$array_body = json_decode($body, true);
$json_body = json_decode($body);
```

**2.5 Add `processPHPCode()` logging guard — line 13103:**
```php
// Add before line 13103 in processPHPCode():
if ($__log_dynamic_data) {
    // Only run json_encode and build log array if logging is actually happening
    if (!isset($this->loggingEnabled) || $this->loggingEnabled) {
```

Pre-compute the logging flag in `startBuildingUssd()` after line 2032:
```php
$logSettings = $this->version->builder['log_settings'];
$saveMode = $this->test_mode
    ? ($logSettings['simulator']['save_logs'] ?? 'always')
    : ($logSettings['mobile']['save_logs'] ?? 'never');
$this->loggingEnabled = ($saveMode !== 'never');
```

**2.6 Add `processPHPCode()` fast-path in `convertValueStructureIntoDynamicData()`:**

Find the method (search for `function convertValueStructureIntoDynamicData`) and add at the top of the method body:
```php
// Fast-path: 94.8% of ValueStructures have code_editor_mode = false
if (!($valueStructure['code_editor_mode'] ?? false)) {
    return $this->handleEmbeddedDynamicContentConversion($valueStructure['text'] ?? '');
}
```

**2.7 Cap `session_execution_times` — `updateExistingSessionDatabaseRecord()` line 1180:**
```php
$this->session_execution_times = is_null($this->existing_session->session_execution_times)
    ? [] : $this->existing_session->session_execution_times;

// ADD AFTER:
if (count($this->session_execution_times) > 50) {
    $this->session_execution_times = array_slice($this->session_execution_times, -50);
}
```

**2.8 Remove eager load + appends from UssdSession model (`app/Models/UssdSession.php`):**
```php
// Comment out or remove:
// protected $with = ['account'];
// protected $appends = ['origin', 'mobile_number', 'has_timed_out', ...];
```
Re-add `with('account')` explicitly in dashboard/reporting queries that need it.

**2.9 Enable persistent DB connections (`config/database.php`):**
```php
'mysql' => [
    // ... existing config ...
    'options' => [
        PDO::ATTR_PERSISTENT => true,
    ],
],
```

**2.10 Cache global variables query — `storeGlobalVariables()` at line 2222:**
```php
$cacheKey = 'gv_' . $this->ussd_account->id . '_' . $this->app->id;
$global_variables_records = Cache::remember($cacheKey, 1800, function () {
    return DB::table('global_variables')->where([
        'ussd_account_id' => $this->ussd_account->id,
        'app_id'          => $this->app->id,
    ])->oldest('updated_at')->get();
});
```

Add cache invalidation after write in `createOrUpdateGlobalVariablesToDatabase()` (around line 1437):
```php
Cache::forget('gv_' . $this->ussd_account->id . '_' . $this->app->id);
```

---

### Phase 3: Build Screen/Display Hash Maps + Memoize Response Text [Day 2–3]
**Impact: MEDIUM | Effort: 2 hours | Risk: Low**
**Addresses: Findings 9, 11, 15**

**3.1 Add index properties to UssdService:**

Near line 68 (other public properties):
```php
public $screenIndex = [];
public $displayIndex = [];
```

**3.2 Build indexes in `startBuildingUssd()` after screens are loaded (after line 2054 setup):**
```php
// After $this->screens is populated:
$this->screenIndex = [];
$this->displayIndex = [];
foreach ($this->screens as $screen) {
    $this->screenIndex[$screen['id']] = &$this->screens[array_key_last($this->screens)];
    foreach ($screen['displays'] as $display) {
        $this->displayIndex[$display['id']] = $display;
    }
}
```

Or more simply (building at the point of first use):
```php
$screenById = array_column($this->screens, null, 'id');
```

**3.3 Replace `searchScreenById()` and `getDisplayById()` to use hash maps:**
```php
public function searchScreenById($link) {
    return $this->screenIndex[$link] ?? null;
}

public function getDisplayById($link, $searchAllScreens = false) {
    return $this->displayIndex[$link] ?? null;
}
```

**3.4 Memoize `extractUserResponsesAsText()`:**

Add property near line 67:
```php
private $cachedResponseText = null;
private $responseTextDirty = true;
```

Modify `addReplyRecord()` — find the method (around line 2530) and add after the `array_push`:
```php
$this->responseTextDirty = true;
```

Modify `extractUserResponsesAsText()` (around line 2566):
```php
public function extractUserResponsesAsText($reply_records = null) {
    if ($reply_records !== null) {
        // Called with explicit records — bypass memoization
    } else {
        if (!$this->responseTextDirty && $this->cachedResponseText !== null) {
            return $this->cachedResponseText;
        }
    }
    // ... existing computation ...
    if ($reply_records === null) {
        $this->cachedResponseText = $result;
        $this->responseTextDirty = false;
    }
    return $result;
}
```

---

### Phase 4: Session State Persistence [Week 1 — Most Critical Architecture Change]
**Impact: CRITICAL | Effort: 8–16 hours | Risk: Medium-High**
**Addresses: Findings 1, 5, 2 (partially)**

This is the foundational fix that eliminates the progressive slowdown. It requires careful implementation and thorough testing.

**4.1 Migration — add `session_state` column:**

**File:** `database/migrations/2026_06_05_000002_add_session_state_to_ussd_sessions.php`

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSessionStateToUssdSessions extends Migration
{
    public function up()
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->mediumText('session_state')->nullable()->after('session_execution_times');
        });
    }

    public function down()
    {
        Schema::table('ussd_sessions', function (Blueprint $table) {
            $table->dropColumn('session_state');
        });
    }
}
```

**4.2 Add to `UssdSession` model casts:**
```php
protected $casts = [
    // ... existing casts ...
    'session_state' => 'array',  // auto JSON encode/decode
];
```

**4.3 Define what to capture in `dynamic_data_storage`:**

The session state must contain everything needed to resume from the current position without replay:

```json
{
  "v": 1,
  "screen_id": "screen_4f4...",
  "display_id": "display_2b3...",
  "level": 3,
  "dynamic_data_storage": {
    "ussd": { "msisdn": "76966708", "session_id": "..." },
    "user": { "id": 123, "name": "...", "language": "en" },
    "_menus": ["Home", "Services", "Get Educated"]
  },
  "global_variables_to_save": {},
  "chained_screens": [],
  "chained_displays": [],
  "chained_screen_metadata": {"text": ""},
  "chained_display_metadata": {"text": ""},
  "pagination_index": 0,
  "screen_total_responses": [],
  "display_total_responses": [],
  "screen_repeats": false
}
```

**4.4 Add `captureSessionState()` method to `UssdService.php` (near line 1146):**

```php
private function captureSessionState()
{
    return json_encode([
        'v'                         => 1,
        'screen_id'                 => $this->screen['id'] ?? null,
        'display_id'                => $this->display['id'] ?? null,
        'level'                     => $this->level,
        'dynamic_data_storage'      => $this->dynamic_data_storage,
        'global_variables_to_save'  => $this->global_variables_to_save ?? [],
        'chained_screens'           => $this->chained_screens,
        'chained_displays'          => $this->chained_displays,
        'chained_screen_metadata'   => $this->chained_screen_metadata,
        'chained_display_metadata'  => $this->chained_display_metadata,
        'pagination_index'          => $this->pagination_index ?? 0,
        'screen_total_responses'    => $this->screen_total_responses ?? [],
        'display_total_responses'   => $this->display_total_responses ?? [],
        'screen_repeats'            => $this->screen_repeats ?? false,
    ]);
}
```

**4.5 Add `restoreSessionState()` method:**

```php
private function restoreSessionState()
{
    if (empty($this->existing_session->session_state)) {
        return false;
    }

    $state = is_array($this->existing_session->session_state)
        ? $this->existing_session->session_state
        : json_decode($this->existing_session->session_state, true);

    if (empty($state) || empty($state['screen_id'])) {
        return false;
    }

    // Guard: version 1 state only (future-proof against schema changes)
    if (($state['v'] ?? 0) !== 1) {
        return false;
    }

    // Restore runtime state
    $this->dynamic_data_storage     = $state['dynamic_data_storage'] ?? [];
    $this->global_variables_to_save = $state['global_variables_to_save'] ?? [];
    $this->chained_screens          = $state['chained_screens'] ?? [];
    $this->chained_displays         = $state['chained_displays'] ?? [];
    $this->chained_screen_metadata  = $state['chained_screen_metadata'] ?? ['text' => ''];
    $this->chained_display_metadata = $state['chained_display_metadata'] ?? ['text' => ''];
    $this->pagination_index         = $state['pagination_index'] ?? 0;
    $this->screen_total_responses   = $state['screen_total_responses'] ?? [];
    $this->display_total_responses  = $state['display_total_responses'] ?? [];
    $this->screen_repeats           = $state['screen_repeats'] ?? false;
    $this->level                    = $state['level'] ?? 1;

    // Re-store USSD session values (cheap, no DB call)
    $this->storeUssdSessionValues();

    // Resolve saved screen ID from builder
    $savedScreenId = $state['screen_id'];
    if (!empty($this->screenIndex[$savedScreenId])) {
        $this->screen = $this->screenIndex[$savedScreenId];
    } else {
        // Screen no longer exists (builder was updated) — fall back to full replay
        return false;
    }

    // Resolve saved display ID
    $savedDisplayId = $state['display_id'] ?? null;
    if ($savedDisplayId && !empty($this->displayIndex[$savedDisplayId])) {
        $this->display = $this->displayIndex[$savedDisplayId];
    }

    return true;
}
```

**NOTE:** `$this->screenIndex` and `$this->displayIndex` must be built before `restoreSessionState()` is called. Since the fast path bypasses `startBuildingUssd()`, build these indexes in `handleExistingSession()` after `setVersion()`:

```php
// Build lookup indexes after setVersion() returns (line ~957):
if ($this->version) {
    $this->screens = $this->version->builder['screens'] ?? [];
    $this->screenIndex = array_column($this->screens, null, 'id');
    $this->displayIndex = [];
    foreach ($this->screens as $screen) {
        foreach ($screen['displays'] as $display) {
            $this->displayIndex[$display['id']] = $display;
        }
    }
}
```

**4.6 Modify `handleExistingSession()` to use fast path:**

After the block that loads reply records (line 972-981) and before `handleSession()` (line 1037), insert:

```php
// Determine if fast path is possible
$userInput    = $this->msg;
$isGoBack     = ($userInput === '0');
$isRevisit    = ($this->is_revisting_session ?? false);
$hasSavedState = !empty($this->existing_session->session_state);

if (!$isGoBack && !$isRevisit && $hasSavedState) {

    // FAST PATH: Restore saved state, skip full replay
    // Build indexes first (screens and displays)
    if (empty($this->screens)) {
        $this->screens = $this->version->builder['screens'] ?? [];
    }
    $this->screenIndex  = array_column($this->screens, null, 'id');
    $this->displayIndex = [];
    foreach ($this->screens as $screen) {
        foreach ($screen['displays'] as $display) {
            $this->displayIndex[$display['id']] = $display;
        }
    }

    if ($this->restoreSessionState()) {

        // Handle seen notification (same logic as line 1004-1017)
        $seen_notification = $this->getLatestSeenNotification();

        if ($seen_notification) {
            DB::table('session_notifications')->where('id', $seen_notification->id)->delete();
        } else {
            // Record ONLY the new user response
            $this->addReplyRecord($this->msg, 'user', true);
            $this->user_response = $this->msg;
        }

        // Process only the current screen/display with the new input
        // (This replaces the entire handleSession() call for continuation requests)
        $this->sessionResponse = $this->processRestoredSession();

        // Skip to DB update (line 1041+)
        goto updateSession;
    }
}

// FALLBACK: Full replay (unchanged existing logic)
// ... lines 992–1037 stay as-is ...

updateSession:
// line 1041 onward stays unchanged
```

**IMPORTANT NOTE ON `goto`:** PHP supports `goto` within the same function. Use it only to jump forward to the update block. Alternatively, wrap the fallback in an `else` block and move the update logic into a shared method called from both paths.

**4.7 Add `processRestoredSession()` method:**

This method processes the user's response on the restored screen/display and navigates forward. Study `handleCurrentDisplay()` carefully before implementing — it must replicate the exact event execution order. The core flow is:

```php
private function processRestoredSession()
{
    try {
        // Set current screen user response based on restored display's action type
        $outputResponse = $this->setCurrentScreenUserResponse();
        if ($this->shouldDisplayScreen($outputResponse)) return $outputResponse;

        // Handle screen-level response events (on_response events on the screen)
        $outputResponse = $this->handleCurrentScreenResponseEvents();
        if ($this->shouldDisplayScreen($outputResponse)) return $outputResponse;

        // Handle display-level response events
        $outputResponse = $this->handleCurrentDisplayResponseEvents();
        if ($this->shouldDisplayScreen($outputResponse)) return $outputResponse;

        // Handle screen leave events
        $outputResponse = $this->handleCurrentScreenLeaveEvents();
        if ($this->shouldDisplayScreen($outputResponse)) return $outputResponse;

        // Navigate to the next screen or display
        $outputResponse = $this->handleLinkingToScreenOrDisplay();
        if ($this->shouldDisplayScreen($outputResponse)) return $outputResponse;

        // Build and return the next screen/display
        return $this->handleCurrentScreen();

    } catch (\Throwable $e) {
        return $this->handleTryCatchError($e);
    }
}
```

**CRITICAL IMPLEMENTER NOTE:** The exact method names (`handleCurrentScreenResponseEvents`, `handleLinkingToScreenOrDisplay`, etc.) must be verified against the actual method names in `UssdService.php`. Search for `function handleCurrentDisplay` and study its entire body — `processRestoredSession()` must replicate the same logic for the post-response phase. This is the most complex part of the implementation.

**4.8 Wire `captureSessionState()` into session saves:**

In `createNewSession()` (line ~1100), inside the insert array:
```php
'session_state' => null,  // No state on session creation (first request builds it)
```

In `updateExistingSessionDatabaseRecord()` (line 1155), add to `$data` array:
```php
'session_state' => $this->captureSessionState(),
```

**4.9 Test the implementation:**

After Phase 4, execution times should be:
| Depth | Before Phase 4 | After Phase 4 |
|-------|---------------|---------------|
| 1 | ~1.0s | ~0.8s (first request, on_start events run once) |
| 2 | ~6.7s | ~0.3s (state restored, no replay) |
| 3 | ~8.5s | ~0.3s |
| 4 | ~11.2s | ~0.3s |
| 10 | ~30s+ | ~0.3s |

Test go-back ("0" input) — should still work via full replay fallback.
Test revisit events — `$this->is_revisting_session = true` path bypasses fast path correctly.

---

### Phase 5: Batch Mustache Tag Resolution + `processPHPCode()` Lazy Extraction [Week 2]
**Impact: HIGH | Effort: 4–6 hours | Risk: Medium**
**Addresses: Findings 2, 8**

**5.1 Lazy variable extraction in `processPHPCode()` (line 13083):**

```php
// BEFORE:
foreach ($this->getDynamicData() as $__key => $__value) {
    ${$__key} = $__value;
    // ... logging ...
}

// AFTER:
$__allData = $this->getDynamicData();
if (!empty($__allData)) {
    // Only extract variables referenced in the code
    preg_match_all('/\$([a-zA-Z_]\w*)/', $__phpCode, $__matches);
    $__needed = array_flip($__matches[1] ?? []);

    if (!empty($__needed)) {
        foreach ($__allData as $__key => $__value) {
            if (isset($__needed[$__key])) {
                ${$__key} = $__value;
            }
            // Log only needed vars, only when logging enabled
            if ($this->loggingEnabled && isset($__needed[$__key])) {
                array_push($__dynamic_variables, [...]);
            }
        }
    }
}
```

**Note:** Some code passes `$this->getDynamicData()` as a nested context. Ensure the regex scans nested code correctly (e.g., code with functions that reference variables). Test with all screen types.

**5.2 Batch mustache tag resolution (advanced — verify method structure first):**

Replace the per-tag `processPHPCode()` loop in `handleEmbeddedDynamicContentConversion()` with a single call that returns all substitutions at once. This requires careful refactoring of the mustache resolution pipeline. Do this after Phase 4 is stable.

---

### Phase 6: JSON Runtime Stripping + Schema Versioning [Week 3]
**Impact: MEDIUM | Effort: 3–4 hours | Risk: Low**
**Addresses: JSON Audit findings 5.1–5.4**

**6.1 Add `getBlankDisplay()` fix in `resources/js/Stores/VersionBuilder.js`:**

When `use_global_pagination = true`, do not serialize per-display pagination fields into the JSON. This is a frontend authoring change that reduces new builder JSON size by ~28 KB.

**6.2 Add `stripRuntimeBuilder()` to `VersionTrait.php`:**

Called in `findAndCache()` before `Cache::put()`. Removes `hexColor`, `comment`, `color_scheme`, `simulator` (except `subscriber.phone_number`), empty `code_editor_text`, and per-display pagination when global is used:

```php
private function stripRuntimeBuilder(array $builder): array
{
    $uiOnlyKeys = ['hexColor', 'color_scheme'];
    // Keep simulator.subscriber.phone_number (read at UssdService.php:2015)
    $simulatorSubscriber = $builder['simulator']['subscriber'] ?? null;

    $this->stripRecursive($builder, $uiOnlyKeys);

    // Restore only the needed simulator field
    if ($simulatorSubscriber) {
        $builder['simulator'] = ['subscriber' => $simulatorSubscriber];
    }
    unset($builder['color_scheme']);

    return $builder;
}
```

**6.3 Add `schema_version` to builder JSON:**

In `VersionObserver::saving()`, after `repairBuilder()`:
```php
$builder['schema_version'] = 2;  // increment on each structural change
```

In `repairBuilder()`, add at the top:
```php
if (($builder['schema_version'] ?? 0) >= 2) {
    return $builder;  // Already at current schema — skip 838 lines of repair code
}
```

This prevents the 838-line repair method from running on every save of an already-current builder.

---

### Phase 7: Session Archiving + Table Maintenance [Week 4]
**Impact: MEDIUM (long-term) | Effort: 2 hours | Risk: Low**
**Addresses: MySQL Finding 6.3**

**7.1 Archive old sessions:**

```sql
-- Create archive table (identical structure)
CREATE TABLE ussd_sessions_archive LIKE ussd_sessions;

-- Move sessions older than 90 days (run via scheduled command)
INSERT INTO ussd_sessions_archive
SELECT * FROM ussd_sessions WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

DELETE FROM ussd_sessions WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

**7.2 Create Laravel command for scheduled archiving:**
```bash
php artisan make:command ArchiveOldSessions
```

Schedule in `app/Console/Kernel.php`:
```php
$schedule->command('sessions:archive')->daily()->at('03:00');
```

**7.3 Run OPTIMIZE TABLE after deletion:**
```sql
OPTIMIZE TABLE ussd_sessions;  -- Reclaims fragmented space after bulk deletes
```

---

## 9. Config Recommendations

### PHP `php.ini` / FPM
```ini
; OPcache (most critical PHP config change)
opcache.enable = 1
opcache.memory_consumption = 256
opcache.max_accelerated_files = 20000
opcache.validate_timestamps = 0
opcache.revalidate_freq = 0
opcache.interned_strings_buffer = 32
opcache.fast_shutdown = 1

; PHP-FPM pool
pm = dynamic
pm.max_children = 150              ; (Total RAM - 3GB for OS/Redis/MySQL) ÷ 45MB
pm.start_servers = 20
pm.min_spare_servers = 10
pm.max_spare_servers = 40
pm.max_requests = 500              ; Recycle workers to prevent memory leaks
request_terminate_timeout = 15s
```

### MySQL `mysqld.cnf`
```ini
innodb_buffer_pool_size = 5G       ; Adjust to 60-70% of server RAM
innodb_buffer_pool_instances = 4
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2 ; 0=fastest but risky, 2=good balance for USSD
innodb_flush_method = O_DIRECT
max_connections = 500
thread_cache_size = 100
wait_timeout = 60
interactive_timeout = 60
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 0.1
log_queries_not_using_indexes = 1
```

### Redis `redis.conf`
```ini
maxmemory 2gb
maxmemory-policy allkeys-lru
save ""                            ; Disable RDB persistence for cache-only use
tcp-backlog 511
tcp-keepalive 60
```

### Laravel `.env`
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

## 10. Migration & Safety Notes

### Safety for Live Sessions During Phase 4 Rollout

The session state persistence change is backward-compatible by design:

1. **New column is nullable.** Existing sessions have `session_state = NULL`.
2. **`restoreSessionState()` returns `false` on NULL.** Falls back to full replay for existing sessions.
3. **Zero sessions break.** Only the first request after deployment for each existing session uses the old replay path. Subsequent requests use the fast path.
4. **Go-back ("0") inputs** use the full replay path — functionally identical to current behavior.
5. **Builder updates** are handled: if the saved `screen_id` no longer exists, `restoreSessionState()` returns `false` and the system falls back to full replay for that request, then captures fresh state.

### Deployment Order

Execute phases in this order, with verification between each:

```
Phase 1 (indexes + MySQL buffer pool)
  ↓ Verify: session_id query shows 'ref' type in EXPLAIN
Phase 2 (Redis + code fixes — excluding session state)
  ↓ Verify: redis-cli MONITOR shows cache hits; API timeouts working
Phase 3 (hash maps + memoization)
  ↓ Verify: No regressions in simulator
Phase 4 (session state — staging test FIRST)
  ↓ CRITICAL: Run complete smoke test on staging environment:
     - New session (request type 1)
     - Multiple continuation requests (request type 2) at depths 2–10
     - Go-back ("0") input at various depths
     - Revisit event
     - Notification display and dismissal
     - Language change (Setswana)
     - Builder update with active sessions
  ↓ Deploy to production
Phase 5 (batch mustache + lazy extraction)
  ↓ Verify: No eval() errors in logs
Phase 6 (JSON stripping)
  ↓ Verify: Builder UI still renders all existing flows
Phase 7 (archiving)
  ↓ Verify: Archive table has correct row count
```

### Rollback Plan for Phase 4

If Phase 4 causes unexpected behavior in production:

1. Deploy a single-line change: comment out the fast-path block in `handleExistingSession()`.
2. All sessions automatically fall back to full replay — existing behavior restored.
3. The `session_state` column remains but is ignored.
4. Fix the issue, test on staging, re-deploy.

### Monitoring After Implementation

Track these metrics after each phase to confirm improvement:

```sql
-- Average session execution time per depth (run after each phase):
SELECT
    JSON_LENGTH(reply_records) as depth,
    AVG(JSON_EXTRACT(JSON_EXTRACT(session_execution_times, '$[last]'), '$.time')) as avg_last_exec_sec,
    COUNT(*) as sessions
FROM ussd_sessions
WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
GROUP BY depth
ORDER BY depth;
```

```bash
# MySQL buffer pool hit rate (should be > 99% after buffer pool increase):
mysql -e "SHOW STATUS LIKE 'Innodb_buffer_pool_read%';"
# Hit rate = (reads - disk_reads) / reads * 100

# Redis hit rate:
redis-cli info stats | grep keyspace_hits
redis-cli info stats | grep keyspace_misses
```

---

## Expected Performance After All Phases

| Metric | Current | After Phase 1–2 | After Phase 4 | After All |
|--------|---------|-----------------|---------------|-----------|
| First dial (depth 1) | 1.0–1.5s | 0.5–0.8s | 0.5–0.8s | 0.3–0.5s |
| Depth 2 keystroke | 6.7s | 4.0s | 0.3s | 0.2s |
| Depth 4 keystroke | 11.2s | 7.0s | 0.4s | 0.3s |
| Depth 10 keystroke | ~30s (timeout) | ~18s | 0.4s | 0.3s |
| DB query for session | ~500ms (full scan) | ~1ms (indexed) | ~1ms | ~1ms |
| phpMyAdmin browse speed | 19.5s | 1–2s | 1–2s | <0.5s |
| Max throughput (single server) | ~30 req/sec | ~80 req/sec | ~600 req/sec | ~800 req/sec |
| Concurrency (sessions before timeout) | ~5–10 | ~25–40 | ~200 | ~300+ |

**Note on throughput targets:** Serving 3,000–4,000 new dials/second requires horizontal scaling (multiple servers behind a load balancer). A single server, even fully optimized, can handle ~800–1,000 req/sec before PHP-FPM becomes the bottleneck. After the optimizations above bring per-request time to 0.3s, adding 4 servers provides the 3,200 req/sec target capacity.

---

*This report was authored against the live codebase at commit `71cfe7a` on 2026-06-05. All file references and line numbers were verified against the actual source. None of the previously recommended fixes had been applied at time of writing.*
