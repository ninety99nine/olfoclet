// Telcoflo V1 — USSD load test (Phase 10).
//
// Drives the real gateway endpoint POST /api/launch/ussd with realistic session
// sequences: a new session (request_type 1) followed by menu continuations
// (request_type 2), with think-time between steps. Ramps load in stages to find
// which ceiling hits first (FPM max_children, MySQL connections, CPU, Redis).
//
// Run (local, against the Docker stack):
//   docker run --rm -i --network telcoflo-v1-net -e BASE_URL=http://nginx \
//     -v "$PWD/loadtest/k6:/scripts" grafana/k6 run /scripts/ussd-flow.js
//   # or from the host: k6 run -e BASE_URL=http://localhost:8080 loadtest/k6/ussd-flow.js
//
// Push metrics to Grafana Cloud (Phase 10):
//   K6_PROMETHEUS_RW_SERVER_URL=... K6_PROMETHEUS_RW_USERNAME=... \
//   K6_PROMETHEUS_RW_PASSWORD=... k6 run -o experimental-prometheus-rw ussd-flow.js
//
// Env knobs: BASE_URL, SERVICE_CODE, MSISDN_PREFIX, INPUTS (csv of replies),
//   THINK_MIN/THINK_MAX (seconds), SCENARIO (ramp|spike|smoke|soak).

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE_URL      = __ENV.BASE_URL      || 'http://localhost:8080';
const SERVICE_CODE  = __ENV.SERVICE_CODE  || '*217#';
const MSISDN_PREFIX = __ENV.MSISDN_PREFIX || '2677';
const INPUTS        = (__ENV.INPUTS || '1').split(',').map((s) => s.trim()).filter(Boolean);
const THINK_MIN     = parseFloat(__ENV.THINK_MIN || '1');
const THINK_MAX     = parseFloat(__ENV.THINK_MAX || '3');
const SCENARIO      = __ENV.SCENARIO || 'ramp';

// ---- Custom metrics --------------------------------------------------------
const sessionDuration = new Trend('ussd_session_duration', true);
const startDuration   = new Trend('ussd_start_duration', true);   // new-session latency (fires on-start REST)
const stepDuration    = new Trend('ussd_step_duration', true);    // continuation latency
const sessionsStarted = new Counter('ussd_sessions_started');
const sessionsOk      = new Counter('ussd_sessions_completed');
const sessionErrors   = new Rate('ussd_session_errors');

// ---- Load profiles ---------------------------------------------------------
// Sized so a single small box shows its knee early; scale targets to the box.
const SCENARIOS = {
  smoke: [ { duration: '20s', target: 5 } ],
  ramp: [
    { duration: '30s', target: 20 },    // warm caches / OPcache
    { duration: '1m',  target: 100 },
    { duration: '2m',  target: 300 },
    { duration: '1m',  target: 0 },
  ],
  spike: [
    { duration: '15s', target: 20 },
    { duration: '15s', target: 600 },   // SMS-campaign burst
    { duration: '1m',  target: 600 },
    { duration: '30s', target: 0 },
  ],
  soak: [
    { duration: '1m',  target: 150 },
    { duration: '20m', target: 150 },   // steady load — watch for leaks / drift
    { duration: '1m',  target: 0 },
  ],
};

export const options = {
  scenarios: {
    ussd: { executor: 'ramping-vus', startVUs: 0, stages: SCENARIOS[SCENARIO] || SCENARIOS.ramp, gracefulRampDown: '20s' },
  },
  thresholds: {
    http_req_failed:      ['rate<0.02'],          // <2% transport failures
    ussd_session_errors:  ['rate<0.01'],          // <1% sessions with a non-200 step
    ussd_start_duration:  ['p(95)<1500'],         // new session (incl. on-start REST) under 1.5s p95
    ussd_step_duration:   ['p(95)<800'],          // continuation under 800ms p95 (target ~300ms after opt)
    http_req_duration:    ['p(99)<3000'],
  },
};

// ---- Helpers ---------------------------------------------------------------
function think() { sleep(THINK_MIN + Math.random() * Math.max(0, THINK_MAX - THINK_MIN)); }

function randomMsisdn() {
  // e.g. 2677 + 7 digits
  return MSISDN_PREFIX + Math.floor(1000000 + Math.random() * 9000000);
}

function dial(payload, tag) {
  return http.post(`${BASE_URL}/api/launch/ussd`, JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    tags: { name: 'launch_ussd', step: tag },
  });
}

// ---- One subscriber session ------------------------------------------------
export default function () {
  const sessionId = uuidv4();
  const msisdn = randomMsisdn();
  const base = { msisdn, session_id: sessionId, service_code: SERVICE_CODE };
  const t0 = Date.now();
  let ok = true;

  // 1) New session — dials the short code. Fires on-start events (Get/Create user).
  let r = dial({ ...base, request_type: '1', msg: SERVICE_CODE }, 'start');
  startDuration.add(r.timings.duration);
  ok = check(r, { 'start: 200': (x) => x.status === 200, 'start: has screen': (x) => (x.body || '').length > 0 }) && ok;
  sessionsStarted.add(1);
  think();

  // 2) Continuations — walk the menu with the configured replies.
  for (let i = 0; i < INPUTS.length; i++) {
    r = dial({ ...base, request_type: '2', msg: INPUTS[i] }, 'continue');
    stepDuration.add(r.timings.duration);
    ok = check(r, { 'continue: 200': (x) => x.status === 200 }) && ok;
    // request_type 3 in the response means the app closed the session — stop.
    if ((r.body || '').includes('"request_type":"3"') || (r.body || '').includes('"request_type": "3"')) break;
    think();
  }

  sessionDuration.add(Date.now() - t0);
  sessionErrors.add(!ok);
  if (ok) sessionsOk.add(1);
}
