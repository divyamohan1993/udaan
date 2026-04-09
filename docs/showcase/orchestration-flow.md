# Udaan -- Orchestration Flow

How Claude MAX capabilities orchestrate the build and operation of Udaan.

## Build Phase: Agent Team Coordination

```
TEAM LEAD (Opus 4.6, 1M context)
│
│  1. TeamCreate "udaan-builders"
│  2. Write scaffold (types, constants, CSS, CLAUDE.md)
│  3. Spawn 4 agents in parallel
│  4. Write cross-cutting code (journey state, shared components)
│  5. Broadcast design directives
│  6. Review, reassign, verify
│
├── @frontend-agent (Opus 4.6)
│   ├── 7 WCAG AAA UI components
│   ├── Landing page (crisis entry points)
│   ├── Root layout (skip nav, landmarks, dark mode)
│   ├── Layer 1: Sahara (triage, schemes, mental health)
│   ├── Layer 2: Khoj (compass, radar, missions)
│   ├── Layer 3: Sangam (circles, create form)
│   ├── MLP polish (warm Hindi bridges, caring errors)
│   ├── Defense in depth (emergency footer, FAB)
│   ├── Journey state integration
│   └── Orchestration configs (reassigned from silent agent)
│
├── @api-agent (Opus 4.6)
│   ├── Elysia Worker entry + routes
│   ├── D1 schema + seed script
│   ├── Bloom filter build script
│   ├── RxDB offline store + tests
│   ├── Service worker (cache-first + emergency fallback)
│   ├── E2E tests (Playwright + axe-core)
│   ├── Cloudflare Pages adapter
│   ├── Build verification
│   ├── Defense in depth (caring API errors, hardcoded fallbacks)
│   └── 50 real scheme database (reassigned from silent agent)
│
├── @data-agent (Opus 4.6) [UNRESPONSIVE]
│   └── Work reassigned to api-agent and team lead
│
└── @orchestration-agent (Opus 4.6) [UNRESPONSIVE]
    └── Work completed by team lead directly
```

## Communication Flow

```
TEAM LEAD ──SendMessage──> @frontend-agent
    │                           │
    │   "Integrate shared       │
    │    components NOW"        │
    │                           ├── Reads files
    │                           ├── Edits routes
    │                           └── Commits ──> "Done"
    │
    ├──SendMessage──> @api-agent
    │                     │
    │   "Take over 50     │
    │    schemes task"    │
    │                     ├── Web search for schemes
    │                     ├── Writes central.json
    │                     └── Commits ──> "Done"
    │
    ├──Broadcast──> ALL AGENTS
    │   "MLP directive: Steve Jobs UX"
    │   "REAL DATA ONLY: zero fake"
    │
    └──SendMessage──> @data-agent, @orchestration-agent
        "shutdown_request" (unresponsive)
```

## Operate Phase: Scheduled Tasks

```
DAILY 2:00 AM IST
└── scheme-db-refresh
    ├── Web Search: pib.gov.in, myscheme.gov.in
    ├── Validate new schemes against Scheme type
    ├── Add to src/data/schemes/central.json
    ├── Run eligibility engine tests
    └── Commit + deploy if changes

DAILY 2:30 AM IST
└── offline-bundle-regen
    ├── Rebuild bloom filters
    ├── Generate scheme data snapshot
    ├── Upload to Cloudflare R2 via MCP
    └── Update service worker cache version

EVERY 6 HOURS
└── health-check
    ├── GET /health -> expect 200, status "ok"
    ├── GET /api/schemes -> expect 50+ schemes
    ├── GET /api/emergency/critical -> expect contacts
    ├── Measure TTFB from Indian PoPs
    └── Alert if any check fails

WEEKLY MONDAY 8:30 AM IST
└── dependency-audit
    ├── bun audit
    ├── Check HIGH/CRITICAL CVEs
    ├── Auto-fix branch if found
    └── Run tests, create PR

WEEKLY FRIDAY 5:30 PM IST
└── analytics-digest
    ├── Aggregate Cloudflare Analytics
    ├── Crisis pathway analysis
    ├── Geographic distribution
    └── Save report to docs/analytics/
```

## Quality Gates: Hooks

```
EVERY COMMIT (PreCommit)
│
├── i18n-check
│   ├── Read src/data/i18n/en.json
│   ├── Read src/data/i18n/hi.json
│   ├── Compare key sets
│   └── BLOCK if Hindi keys missing
│
└── type-check
    ├── bunx tsc --noEmit --skipLibCheck
    └── BLOCK if TypeScript errors

EVERY PUSH (PrePush)
│
└── test-gate
    ├── bunx vitest run
    ├── 24+ tests must pass
    └── BLOCK if any fail
```

## Data Flow: User to Edge to Offline

```
USER (2G phone, Jharkhand)
│
│  First visit:
│  ├── Cloudflare Edge (Delhi PoP, <50ms)
│  │   └── Workers serve Qwik HTML (SSR, <2KB JS)
│  ├── Service Worker installs
│  │   └── Precaches: /, /sahara/*, /khoj/*, /sangam/*
│  └── RxDB initializes
│      └── Seeds emergency contacts (defense in depth)
│
│  Crisis triage:
│  ├── [OFFLINE] Form works locally, no API needed
│  ├── [OFFLINE] Eligibility engine runs client-side (O(1) hash map)
│  ├── [OFFLINE] Scheme results from RxDB cache
│  └── [ONLINE] Sync profile to server, get fresh scheme data
│
│  Purpose compass:
│  ├── [OFFLINE] All 5 questions + vector computation local
│  ├── [OFFLINE] Mission matching from cached templates
│  └── [ONLINE] Save purpose vector, get circle suggestions
│
│  Community circles:
│  ├── [OFFLINE] View cached circle data + activity
│  ├── [ONLINE] Create circle, join mission, log activity
│  └── [SYNC] RxDB CRDT merges offline writes when connected
│
│  Emergency (ALWAYS WORKS):
│  ├── tel:112 -- native phone link, no JS/network needed
│  ├── tel:1800-599-0019 -- KIRAN mental health
│  ├── tel:181 -- Women helpline
│  └── Hardcoded in HTML footer on every page
```

## Capability Proof Points

| Claim | Proof |
|-------|-------|
| O(1) eligibility | `bunx vitest run` -- 10,000 lookups in <100ms |
| O(1) i18n | `bunx vitest run` -- 100,000 lookups in <50ms |
| 24 tests pass | `bunx vitest run` -- 4 test files, 24 tests, <1s |
| Build succeeds | `bun run build` -- zero errors |
| WCAG AAA | axe-core e2e tests on all 5 pages |
| Real data | Web search verified: all helplines active, all scheme URLs resolve |
| Defense in depth | 6 fallback layers from JS to hardcoded tel: links |
| Hindi-first | All user-facing text Hindi primary, English secondary |
| Offline-first | Service worker + RxDB + hardcoded emergency HTML |
| 10 commits | Incremental, reviewable, each adds working functionality |
| 4 agents | TeamCreate + Agent with team_name, real parallel execution |
