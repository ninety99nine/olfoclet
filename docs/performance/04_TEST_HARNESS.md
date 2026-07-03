# File 04 — TEST HARNESS (safety net for files 01 / 02 / 03)
### Created: 2026-07-03 · Codebase: commit `71cfe7a` · Status: IN PLACE (pre-implementation)

---

## What this is

A test harness built **before** any performance fix is applied, so that once we
start implementing `01_SAFE_NON_BREAKING_FIXES.md`, `02_BREAKING_JSON_STRUCTURE_FIXES.md`
and `03_JSON_COMPATIBILITY_MIGRATION.md`, we can prove:

1. **We did not change behaviour we meant to preserve** (the USSD engine still
   produces byte-identical output for real flows), and
2. **We did implement each fix as specified** (indexes, columns, settings store,
   builder purity, the JSON converter, etc.).

It runs the **real production First-Aid builder** (version 4, the exact 251 KB
builder the performance report audited) end-to-end through the engine, with the
on-start REST calls stubbed for determinism.

---

## Two kinds of tests

| Kind | Group | State today | After a fix lands |
|------|-------|-------------|-------------------|
| **Regression** (behaviour-preservation + harness integrity) | *(none)* | **green** | must **stay green** |
| **Target** (executable acceptance criteria for each fix) | `@group target` | **skipped (pending)** | **activates → must pass** |

Today: **25 regression tests green, 33 target tests pending, 0 failures.**

A target test skips until it detects a cheap **structural marker** of its fix
(a new column, index, method, config value, command, or absence of a relocated
key). The moment the fix is implemented the marker appears, the test wakes up and
must pass. `MarkerDetectionTest` proves the markers detect both present and absent
state correctly, so a target test can never "skip forever" by mistake.

---

## One-time setup

```bash
# Dedicated MySQL test schema (NEVER the live telcoflo database).
mysql -h127.0.0.1 -uroot -e "CREATE DATABASE IF NOT EXISTS telcoflo_test \
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Config cache must not pin the DB name (tests read DB_DATABASE from phpunit.xml).
php artisan config:clear
```

`RefreshDatabase` migrates `telcoflo_test` fresh and wraps each test in a
transaction. The live `telcoflo` DB is never touched (asserted by
`HarnessSanityTest::test_it_runs_against_the_dedicated_test_schema`).

---

## Running

```bash
vendor/bin/phpunit                          # everything (green + pending)
vendor/bin/phpunit --exclude-group target   # regression only — must be all green
vendor/bin/phpunit --group target           # acceptance criteria — pending today
vendor/bin/phpunit --group golden           # behaviour-preservation snapshots
vendor/bin/phpunit --group file01           # target tests for File 01 (or file02 / file03)

# After a DELIBERATE, reviewed behaviour change, regenerate the golden snapshots:
UPDATE_GOLDEN=1 vendor/bin/phpunit --group golden
```

**Workflow while implementing a fix:** implement Problem N → run
`vendor/bin/phpunit --exclude-group target` (behaviour still green?) and the
relevant `--group fileNN` (did Problem N's target test go green?). Repeat.

---

## Layout

```
tests/
├── Support/
│   ├── FirstAidApp.php            # seeds the real app graph (project→app→version4→shortcode)
│   ├── TestableUssdService.php    # overrides callGuzzleHttp() → deterministic on-start REST stubs
│   ├── DialsUssd.php              # dial the engine like the gateway does; normalise responses
│   ├── GoldenMaster.php           # snapshot assertion (UPDATE_GOLDEN=1 to regenerate)
│   └── PendingUntilImplemented.php# structural-marker helpers for target tests
├── Fixtures/
│   ├── first-aid-app-v4-builder.json   # exact production builder (golden fixture)
│   └── golden/*.json                   # committed behaviour snapshots
├── Unit/Ussd/
│   ├── EngineHelpersTest.php      # removeEmojis / extract / search — output pinned (File 01 P2,P12,P14)
│   └── BuilderUpgraderTest.php    # File 03 converter spec (incl. golden invariants on the real builder)
└── Feature/Ussd/
    ├── HarnessSanityTest.php      # DB isolation + migrations + columns
    ├── FixtureSeederTest.php      # the seeder + documented audit counts (19/35, etc.)
    ├── EngineSmokeTest.php        # engine runs the real builder end-to-end, no fatal
    ├── MarkerDetectionTest.php    # proves the pending-markers detect real state
    ├── GoldenMasterFlowTest.php   # behaviour-preservation for files 01 & 02  (@group golden)
    ├── File01TargetTest.php       # acceptance criteria for File 01           (@group target)
    ├── File02TargetTest.php       # acceptance criteria for File 02           (@group target)
    └── File03CommandTest.php      # ussd:upgrade-builders command             (@group target)
```

---

## How the engine is driven deterministically

- `FirstAidApp::create()` inserts the real builder through the `VersionObserver`
  (repair + cache) exactly as production does — so the engine sees the builder it
  would serve live.
- The First-Aid app fires on-start REST events (`Get User`, `Create User`) with a
  raw `new GuzzleHttp\Client()`, which `Http::fake()` cannot intercept.
  `TestableUssdService` overrides the single public `callGuzzleHttp()` method to
  return a canned subscriber (shape matches the app's "Set App Properties" custom
  code: `metadata.profile`, `metadata.language`, `latestSubscription`) and
  reproduces the exact `$this->api_response` contract. **Zero production changes.**
- Golden snapshots capture the user-visible `msg` + `request_type` + persisted
  session row, and deliberately **exclude** volatile/efficiency fields (timings,
  logs, random session id, and the on-start REST-call *count* — that count is the
  very thing File 01 Problem 20 changes, so it lives in the P20 target test).

---

## Coverage map

### 01_SAFE_NON_BREAKING_FIXES.md
| Problem | Test | Marker / method |
|---|---|---|
| P1 double JSON decode | GoldenMasterFlow (join path drives a REST call) | behaviour |
| P2 removeEmojis 1 regex | `EngineHelpersTest` | output pinned |
| P3/§7.4 persistent PDO | File01 `test_problem3...` | `config(...options.ATTR_PERSISTENT)` |
| P5 Guzzle reuse + timeouts | File01 `test_problem5...` | `getHttpClient()` + client config |
| P6 indexes | File01 `test_problem6...` (5 cases) | information_schema index check |
| P7 cap execution times | File01 `test_problem7...` | count ≤ 50 after an oversized array |
| P9 Cache::remember, P13 native arrays, P16–19 ValueStructure/mustache/processPHPCode | GoldenMasterFlow | behaviour |
| P12 hash-map lookups | `EngineHelpersTest` (search/display) | output pinned |
| P14 memoise extract | `EngineHelpersTest` | output pinned |
| P15 drop eager-load/appends | File01 `test_problem15...` | `UssdSession::$with` reflection |
| P20 session-state fast path | File01 `test_problem20...` (column + 0 on-start calls on continuation + output unchanged) | `session_state` column |
| P4 buffer pool, P8 Redis | **not automatable** (server/infra) — see notes | — |

### 02_BREAKING_JSON_STRUCTURE_FIXES.md
| Problem | Test | Marker |
|---|---|---|
| P1 schema_version | File02 `test_problem1...` | `builder.schema_version >= 2` on a new version |
| P2 versions.settings + independent save | File02 `test_problem2...` (column, cast, **builder bytes unchanged on settings save**, `versionSetting()`) | `versions.settings` column / `versionSetting()` |
| P4 debugger from settings, P5 timeout from settings | File02 `test_problem5...` + accessor test | `versionSetting()` present |
| P3 appearance relocated | File02 `test_problem3...` | new builder has no `color_scheme` |
| P6 simulator key gone | File02 `test_problem6...` | new builder has no `simulator` |
| P7 pagination / P8 ValueStructure (existing builders) | File03 converter tests + GoldenMasterFlow | see File 03 |
| Real-session behaviour unchanged after relocation | **GoldenMasterFlow** | behaviour |

### 03_JSON_COMPATIBILITY_MIGRATION.md
| Concern | Test |
|---|---|
| `BuilderUpgrader` transform (schema stamp, idempotency, key removal, timeout/simulator/appearance relocation, pagination normalise, ValueStructure compaction, `validate()`) | `BuilderUpgraderTest` |
| Golden invariants on the **real** First-Aid builder (19/35 topology, 55 code-mode kept, 998 empty compacted → 0, timeout & subscriber preserved) | `BuilderUpgraderTest::test_golden_...` |
| `ussd:upgrade-builders` command (upgrade, `--dry-run` no-write, idempotent) | `File03CommandTest` |

> The `BuilderUpgrader` tests were validated by temporarily dropping in the File 03
> reference implementation: **all 11 passed (40 assertions), including the golden
> invariants on the real 251 KB builder.** The temporary class was then removed —
> implementing it for real is the File 03 work. This confirms the tests are correct,
> not merely skipping.

---

## Notes & caveats

- **Not automated here (infrastructure):** InnoDB buffer pool sizing (File 01 P4),
  Redis cache/session/queue drivers (P8), OPcache / PHP-FPM / MySQL server config.
  These are server changes; verify them with the report's own SQL/CLI checks.
- **Config cache:** if `bootstrap/cache/config.php` is regenerated, run
  `php artisan config:clear` before testing or the `DB_DATABASE=telcoflo_test`
  override is ignored and tests would hit the live DB name.
- **Determinism:** the golden snapshots depend on the stubbed subscriber persona in
  `TestableUssdService::$defaultResponse`. Changing it changes the snapshots.
- **Depth:** the First-Aid flow is shallow (Welcome → Join/Exit). The repeated
  invalid-input sequence (`flow_invalid_replay`) provides multiple continuation
  requests on one session — the replay path that P20 optimises. Adding a second,
  deeper app fixture later would strengthen the P20 guard further.
```
