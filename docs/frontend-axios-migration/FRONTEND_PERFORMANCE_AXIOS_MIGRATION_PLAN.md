# Frontend Performance & Axios Migration Plan

> **Goal:** Make the olfoclet frontend dramatically faster and more efficient by moving from an
> Inertia.js (server-driven, full-prop page loads) architecture to an Axios-driven model where
> almost every request is a lightweight JSON call — modelled on the proven `telcoflo-new` stack.
>
> **Author target:** Engineering (Julian / Brandon)
> **Status:** Proposed — not started
> **Last updated:** 2026-06-07
> **Reference implementation:** `/Users/juliantabona/Sites/telcoflo-new`

---

## 0. TL;DR

olfoclet currently renders pages with **Inertia.js + Laravel Mix (webpack 4)**. Every navigation
ships a full server-rendered prop payload, the build tool is slow (webpack cold start ~3–5s, full
page reload on change), and heavy UI libraries (Element Plus ~98 MB in `node_modules`, Flowbite,
Highcharts) bloat the bundle.

`telcoflo-new` already runs the architecture we want: a **Vue Router SPA** that fetches JSON over
**Axios**, builds with **Vite 7**, splits code into manual chunks, lazy-loads every route, caches
auth, dedupes requests, and fires parallel calls. We will migrate olfoclet to this model
**incrementally and reversibly**, so the app keeps working at every step.

The migration is **high-touch but low-risk**: ~170 Inertia call-sites to convert, but the backend
controllers already support `request()->expectsJson()`, the Pinia store does not call APIs (so it
survives untouched), and 12 files already use Axios — the patterns exist.

This plan is **independent of and complementary to** the existing backend work in
`docs/performance/` (USSD O(n²) replay fix, DB indexes, JSON schema migration). Those remain the
biggest raw-latency wins; this plan targets perceived speed, bundle size, build velocity, and the
request architecture.

---

## 1. Current State vs. Target State

| Dimension | olfoclet (now) | telcoflo-new (target) |
|---|---|---|
| Page loads | Inertia `Inertia::render()` + full props | Vue Router SPA + Axios JSON |
| HTTP client | 12 files axios; ~170 Inertia `Link`/`useForm`/`$page.props` | Axios everywhere, direct in Pinia stores |
| Routing | Server routes → Inertia page resolve | Client `vue-router` 4, lazy `() => import()` |
| Build tool | Laravel Mix / webpack 4 (vite.config.js present but **unused**) | Vite 7 + `@vitejs/plugin-vue` |
| CSS | Tailwind 3 + Flowbite (manual copy) | Tailwind 4 (`@tailwindcss/vite`) |
| State | Pinia, 1 store (`VersionBuilder.js`), **no API calls** | Pinia, 18 stores calling axios directly |
| Auth | Session / Inertia shared props | Sanctum Bearer token in `localStorage` |
| Code splitting | webpack default; everything bundled | manual chunks (vendor/charts/icons/editor) + lazy routes |
| Real-time | Echo present but inactive | Pusher instantiated lazily in stores |
| Heavy deps | element-plus (~98 MB), flowbite, highcharts, highlight.js | tailwind-only UI, lucide icons, lazy chart.js |

### Backend is already migration-friendly

Controllers in olfoclet already branch on content negotiation, e.g.:

```php
// SessionController::index()
return request()->expectsJson() ? $payload : Inertia::render('Sessions/List/index', $payload);
```

This means we can introduce a JSON API surface **without rewriting controllers** — we extract the
payload-building logic and expose it under `routes/api.php`, while Inertia routes keep working
during the transition.

---

## 2. Target Architecture (mirrors telcoflo-new)

```
resources/js/
├── app.js                  # createApp({}) + pinia + router, provide() stores globally
├── bootstrap.js            # axios defaults: Accept/Content-Type/X-Requested-With + Bearer token
├── echo.js                 # Pusher (lazy, opt-in per store)
├── router/
│   └── index.js            # vue-router 4: lazy routes, beforeEach auth guard, meta.requiresAuth
├── stores/                 # Pinia stores — call axios directly, cache + dedupe + guard flags
│   ├── auth-store.js
│   ├── ui-store.js         # global loader, sidebar
│   ├── form-store.js       # 422 validation error mapping
│   ├── notification-store.js
│   └── <feature>-store.js
├── pages/                  # route-level components, all lazy-loaded
├── layouts/                # Dashboard / Auth / Guest layouts
├── components/ partials/   # reusable UI (replace element-plus/flowbite over time)
└── utils/ config/
```

### Core patterns to copy from telcoflo-new

1. **Single global axios** (`bootstrap.js`):
   ```js
   import axios from 'axios';
   window.axios = axios;
   axios.defaults.headers.common['Accept'] = 'application/json';
   axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
   const token = localStorage.getItem('auth_token');
   if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ```

2. **Stores call axios directly** — no service-layer ceremony, but add cross-cutting concerns:
   - **Request dedup / caching** (auth user cached 5 min).
   - **Double-submit guards** (`if (this.isUpdating) return;`).
   - **Loading flags** per action for UI feedback.
   - **Per-request timeouts** (e.g. `timeout: 3000` on auth check).

3. **Parallel requests** with `Promise.all([...])` for independent data.

4. **Relationship query params** (`_relationships=logo,deployments`) to avoid over-fetching.

5. **Lazy routes + manual chunks** in `vite.config.js` (`auth`, `vue-vendor`, `charts`, `icons`,
   editor) so the initial bundle is tiny.

6. **Router guard** shows the loader after a 50ms delay (avoids flash), validates token before
   protected routes, redirects to login with `?redirect=`.

> **Note — one improvement over telcoflo-new:** telcoflo-new uses **no axios interceptors** and
> handles errors per-request. We will add a **lightweight response interceptor** for global 401
> handling (auto-logout/redirect) and a single place to normalize 422 validation errors, while
> still allowing per-request `try/catch`. This avoids scattering auth-expiry logic across stores.

---

## 3. Migration Phases

Each phase is shippable and reversible. Inertia and Axios **coexist** until Phase 6.

### Phase 0 — Foundations & Build Tooling (no behavior change)
**Why first:** faster builds accelerate every later phase; Vite enables real code-splitting.

- [ ] Adopt **Vite** as the build tool. The repo already has a `vite.config.js` — wire up
      `package.json` scripts (`"dev": "vite"`, `"build": "vite build"`), add
      `@vitejs/plugin-vue` + `laravel-vite-plugin`, and switch the Blade entry to `@vite([...])`.
- [ ] Decide on Tailwind: keep Tailwind 3 for now (Tailwind 4 upgrade is a separate, optional
      task — see Phase 7). Lower risk to defer.
- [ ] Add path aliases in `vite.config.js` (`@Pages`, `@Stores`, `@Components`, `@Layouts`,
      `@Utils`) matching telcoflo-new conventions.
- [ ] Configure `build.rollupOptions.output.manualChunks` to split: `vue-vendor` (vue, router,
      pinia), `charts` (highcharts — only used in Reports), `editor` (highlight.js /
      simple-code-editor), `icons`, and `element-plus` (so it can be removed later).
- [ ] Keep Laravel Mix temporarily as a fallback build until Vite output is verified in staging,
      then delete `webpack.mix.js` and remove `laravel-mix` from devDependencies.

**Exit criteria:** App builds and runs identically on Vite; production bundle is chunked; HMR works.

**Quick win regardless of migration:** Vite alone removes the webpack cold-start penalty and gives
instant HMR instead of full page reloads.

---

### Phase 1 — Axios Infrastructure (additive, no removals)
- [ ] Rewrite `resources/js/bootstrap.js` to the telcoflo-new axios setup (defaults + Bearer
      token bootstrap). Keep existing CSRF handling for any session-backed routes still in use.
- [ ] Add a **response interceptor**: on `401` → clear token + redirect to login; pass through
      `422` for form-store mapping; surface network errors to the notification store.
- [ ] Create core Pinia stores: `ui-store` (global loader/sidebar), `notification-store` (toasts),
      `form-store` (422 → field error map, copy telcoflo-new's `setServerFormErrors`).
- [ ] Add a thin `utils/` for query-string building (`_relationships`, pagination, filters).

**Exit criteria:** Axios + stores exist and are unit-exercised; nothing else changed yet.

---

### Phase 2 — JSON API Surface (backend, additive)
- [ ] For each feature area, expose JSON endpoints under `routes/api.php` (Sanctum-protected),
      reusing the payload-building code that controllers already produce for `expectsJson()`.
- [ ] Standardize list responses to `{ data, total, per_page, current_page }` (Laravel paginator)
      and adopt `_relationships` eager-load param to control payload size.
- [ ] Introduce **API Resources** (`JsonResource`) per model for stable, lean shapes — replaces
      ad-hoc prop arrays and prevents over-fetching.
- [ ] Keep existing Inertia/web routes intact.
- [ ] **Auth decision (needs confirmation):** choose between (a) **Sanctum SPA cookie** session
      auth (no token juggling, same-origin, CSRF-cookie) or (b) **Sanctum Bearer token** in
      `localStorage` (telcoflo-new's approach). See Open Questions §6.

**Exit criteria:** Every screen's data is available as JSON via `/api/...`, verified with a REST
client, without breaking existing pages.

---

### Phase 3 — Convert "leaf" interactions to Axios (low risk, high frequency)
These are already partially done — extend the pattern that 12 files use today.

- [ ] Convert all **search / filter / pagination** controls (Sessions, Accounts, Database
      Entries, Global Variables, Notifications, Reports list headers) to Axios + a feature store,
      removing full Inertia reloads. Several already do this — standardize them onto the store
      pattern.
- [ ] Convert **forms** (`useForm().post(...)`) to store actions calling `axios.post/put` with the
      `form-store` for 422 errors and double-submit guards.
- [ ] Add **parallel fetching** (`Promise.all`) where a screen needs multiple independent
      datasets (e.g. list + counts), copying `Apps.vue` from telcoflo-new.

**Exit criteria:** Interactions feel instant (no white-flash navigations); forms validate inline.

---

### Phase 4 — Introduce vue-router for SPA navigation (parallel to Inertia)
- [ ] Add `vue-router` 4 with lazy `() => import()` routes for one self-contained feature area
      first (recommend **Settings** or **Sessions** — fewer deep dependencies than the Builder).
- [ ] Port that area's pages to load data via stores/axios in route guards or `onMounted`.
- [ ] Add the `beforeEach` auth guard (token validation, `requiresAuth` meta, delayed loader) and
      `afterEach` loader teardown from telcoflo-new.
- [ ] Validate deep-linking, back/forward, and refresh behavior for the migrated area.

**Exit criteria:** One feature area runs fully as a router-driven SPA while the rest stays on
Inertia.

---

### Phase 5 — Migrate remaining feature areas
- [ ] Convert feature areas in dependency order, leaving the **Versions/Show/Builder** (the
      largest, ~2,558-line Pinia store, Monaco-like editors, simulator polling) for **last** — it
      is the highest-touch and already has the most axios usage.
- [ ] For each area: add routes, point pages at stores, delete the corresponding
      `Inertia::render()` props once the JSON endpoint is consumed.
- [ ] Replace `<Link>` with `<router-link>` and `router.visit` with `router.push`.

**Exit criteria:** All feature areas navigable via vue-router; Inertia only used by the app shell.

---

### Phase 6 — Remove Inertia
- [ ] Replace the Inertia app bootstrap with a plain `createApp({})` mounting `#app` (per
      telcoflo-new `app.js`), `app.use(pinia)`, `app.use(router)`, and global `provide()` of stores.
- [ ] Convert the single Blade entry to a minimal SPA shell (`<div id="app">` + `@vite`).
- [ ] Remove `@inertiajs/vue3`, Inertia middleware, `HandleInertiaRequests`, and shared-prop
      plumbing.
- [ ] Collapse web routes to a single SPA catch-all that serves the shell; keep `/api/*` for data.

**Exit criteria:** Zero Inertia references; app is a pure SPA over a JSON API.

---

### Phase 7 — Bundle & Dependency Diet (perf payoff)
- [ ] **Remove / replace Element Plus** (~98 MB in node_modules) — by far the largest win. Replace
      its components with Tailwind + lightweight `partials/` (Button, Input, Modal, Dropdown,
      Tooltip, Switch) as telcoflo-new does. Do this incrementally per component.
- [ ] **Lazy-load Highcharts** — only Reports uses it; move to a dynamically-imported chunk so it
      never loads on other pages. (Consider Chart.js if a lighter lib suffices.)
- [ ] **Drop Flowbite** once its components are replaced by Tailwind partials; removes the manual
      JS copy step.
- [ ] **Scope highlight.js** languages instead of the full bundle, or lazy-load the code editor.
- [ ] Replace any heavy icon usage with **lucide-vue-next** (tree-shakeable).
- [ ] Verify final chunking; set `chunkSizeWarningLimit`, `cssCodeSplit: true`, `sourcemap: false`
      in prod.
- [ ] (Optional) Upgrade to **Tailwind 4** via `@tailwindcss/vite`.

**Exit criteria:** Initial JS/CSS payload measurably smaller; Lighthouse / bundle-analyzer
confirms removal of element-plus/flowbite from the critical path.

---

### Phase 8 — Real-time & Polish (optional)
- [ ] Replace the USSD simulator **polling** with Pusher/Echo events where it improves latency
      (lazy Pusher instance in a store, as telcoflo-new does for `signal-scan`).
- [ ] Add request dedup/caching to hot stores (auth user 5-min cache; list caches with
      invalidation on mutate).
- [ ] Add an optimistic-UI pattern for fast-feedback mutations.

---

## 4. Performance Techniques to Adopt (checklist)

From telcoflo-new, ported as standards:

- **Lazy routes** — every route is `() => import()`; never eager-import pages.
- **Manual vendor chunks** — keep framework, charts, editor, icons in separate cacheable chunks.
- **CSS code splitting** — `cssCodeSplit: true`.
- **Request deduplication** — cache expensive reads (auth user) with a TTL.
- **Double-submit guards** — store action returns early if already in flight.
- **Loading flags** — per action, drive skeletons/spinners; show global loader only after 50ms.
- **Parallel requests** — `Promise.all` for independent datasets.
- **Targeted payloads** — `_relationships` + API Resources; never ship the whole model graph.
- **Per-request timeouts** — bound auth/critical calls so the UI never hangs.
- **Optimistic UI** — update local state from the response immediately.
- **No source maps in prod**, `modulePreload` polyfill for older browsers.

---

## 5. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| 170 Inertia call-sites is a lot of churn | High | Incremental per-area migration; Inertia + router coexist until Phase 6. |
| Auth model change breaks sessions | Medium | Decide Sanctum cookie vs token up front (§6); migrate auth first behind a guard. |
| Builder (2,558-line store) is fragile | Medium | Migrate it **last**; it already uses axios; store has no API calls so logic is stable. |
| SEO / first-paint regressions from SPA | Low | Internal dashboard app — SEO N/A; mitigate first paint with chunking + a shell skeleton. |
| Dual build tools cause confusion | Medium | Remove Laravel Mix immediately after Vite is verified (end of Phase 0). |
| Over-fetching persists if Resources skipped | Medium | Make API Resources + `_relationships` mandatory in Phase 2. |
| Element Plus removal touches many screens | Medium | Replace component-by-component behind shared `partials/`; no big-bang. |

---

## 6. Open Questions (need a decision before/within the listed phase)

1. **Auth strategy (Phase 2):** Sanctum **SPA cookie session** (simpler, same-origin, no token
   storage, CSRF cookie) vs **Bearer token in localStorage** (telcoflo-new's choice, works across
   origins, but XSS-exposed). *Recommendation: Sanctum SPA cookie for a same-origin dashboard.*
2. **Tailwind version (Phase 0/7):** stay on Tailwind 3 during migration and upgrade to 4 later,
   or jump to 4 now? *Recommendation: defer to Phase 7.*
3. **Real-time scope (Phase 8):** is replacing simulator polling with Pusher in scope, or
   defer? Requires Pusher/Echo credentials and broadcasting on the backend.
4. **Charts library (Phase 7):** keep Highcharts (lazy-loaded) or migrate Reports to Chart.js?
5. **Coexistence window:** acceptable to run Inertia + vue-router simultaneously for several
   releases? (Recommended for safety.)

---

## 7. Relationship to Existing `docs/performance/` Work

This plan is **frontend-architecture focused** and runs **in parallel** with the backend work
already documented:

- `PERFORMANCE_OPTIMIZATION_REPORT_AND_PLAN_OPUS_4_8.md` — full-stack audit; the **backend USSD
  O(n²) replay bug** is the single biggest raw-latency win and is independent of this migration.
- `01_SAFE_NON_BREAKING_FIXES.md` — backend-only (DB indexes, cache, PHP tuning).
- `02_BREAKING_JSON_STRUCTURE_FIXES.md` / `03_JSON_COMPATIBILITY_MIGRATION.md` — builder JSON
  schema change + one-time migration; touches the Pinia `VersionBuilder` store.

**Sequencing note:** if the builder JSON schema migration (files 02/03) is going to happen, do it
**before** migrating the Builder feature area (Phase 5/last), so we port the store to its final
shape once.

---

## 8. Suggested Execution Order (summary)

1. **Phase 0** — Vite + chunking (fast win, unblocks everything)
2. **Phase 1** — Axios infra + core stores
3. **Phase 2** — JSON API + Resources + auth decision
4. **Phase 3** — Convert leaf interactions (search/filter/forms) to axios
5. **Phase 4** — vue-router for one pilot area
6. **Phase 5** — Migrate remaining areas (Builder last)
7. **Phase 6** — Remove Inertia
8. **Phase 7** — Dependency diet (drop Element Plus/Flowbite, lazy charts)
9. **Phase 8** — Real-time + caching polish

Each phase ships independently and is reversible. Start with Phase 0 to get the build-speed and
code-splitting wins immediately, even before the architecture changes land.
