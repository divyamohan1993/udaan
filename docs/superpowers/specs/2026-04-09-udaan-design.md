# Udaan (उड़ान) -- Design Specification

**Crisis Entry. Purpose Destination.**

A community purpose platform for post-labor India. Catches people in crisis, guides them to purpose, connects them to each other.

---

## 1. Problem

AI will automate 80% of work within a decade. India has 1.4B people, median age 28, massive workforce entering just as jobs vanish. The transition will be crisis-first, fulfillment-later. The gap between them kills people.

Government safety nets exist (700+ central schemes) but nobody knows about them. Purpose and community are the two things AI cannot provide. No platform connects crisis relief to purpose discovery to human community formation.

## 2. Users

**Primary:** Displaced workers in Tier 2/3/4 Indian cities and rural areas. Age 18-45. Feature phones to low-end Android. 2G-4G. Hindi/English/regional languages. Low digital literacy.

**Secondary:** Urban workers facing automation anxiety. Educated but purposeless. Looking for meaning beyond salary.

**Tertiary:** Community organizers, NGOs, local government officials who want to connect people to resources.

## 3. Three Layers

### Layer 1: Sahara (सहारा -- Support)
Crisis triage and stabilization.

**Entry points:**
- "I lost my job"
- "I can't feed my family"  
- "I don't know what to do"
- "I need help"

**What it does:**
- 8-question crisis assessment (income, location, family size, skills, urgency, language, education, category)
- O(1) scheme matching via pre-computed bloom filter + hash map keyed on profile vector (state, age_bracket, income_bracket, category, gender, occupation_type)
- Top 5 matching government schemes with eligibility confirmation, application steps, nearest office
- Mental health first-aid: grounding exercises, crisis helpline numbers, breathing techniques
- Peer SOS: connect to 3-5 nearby humans in similar situations (locality-sensitive hash, pre-bucketed by geo + crisis type)
- SMS/WhatsApp fallback for 2G users

**Data:**
- 700+ central government schemes (PM-KISAN, MGNREGA, Ayushman Bharat, PM Awas Yojana, etc.)
- State-level schemes (major states first: UP, Bihar, MP, Rajasthan, Maharashtra, Tamil Nadu)
- Emergency contacts by state: mental health helplines, women's helplines, legal aid
- Community kitchens, shelters, food banks (crowd-sourced, verified)

### Layer 2: Khoj (खोज -- Discovery)
Purpose compass and mission matching.

**Trigger:** User has stabilized (completed Layer 1, or arrives without crisis).

**What it does:**
- Purpose compass: 5 questions, not a career quiz. "What made you feel alive before work defined you?" "What does your neighborhood need?" "What would you do if money wasn't the question?"
- Maps answers to a 6-axis purpose vector: [people, nature, knowledge, craft, service, expression] each scored 0.0-1.0
- Matches to local "missions" -- concrete things to do:
  - Teach kids in your mohalla
  - Start a community garden
  - Repair electronics at a local hub
  - Organize cultural events
  - Run a neighborhood library
  - Cook community meals
  - Document local history/stories
- Micro-tasks for immediate engagement (today, not someday)
- Skill expression map: what you already know that others need

**Data:**
- Mission templates (pre-built, localizable)
- Skill taxonomy (mapped to micro-tasks)
- Local resource directory (spaces, tools, materials)

### Layer 3: Sangam (संगम -- Confluence)
Community circles and collective action.

**Trigger:** User has discovered a mission direction.

**What it does:**
- Forms circles: 5-8 people, one shared mission, same locality
- Weekly meetup rhythm (suggested, not enforced)
- Shared project board: what we're doing, what's done, what's next
- Progress visibility: not gamification, not points. Real impact. "Our circle taught 12 kids this month." "We grew 40kg of vegetables."
- Inter-circle discovery: see what other circles near you are doing
- Circle health monitoring: nudge if a circle goes quiet

**Data:**
- Circle state (members, mission, location, activity log)
- Project progress (tasks, completions, impact metrics)
- Inter-circle graph (proximity, shared interests)

## 4. Tech Architecture

### Runtime & Framework

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Runtime | Bun | 4x faster startup, 2-3x HTTP throughput vs Node |
| Frontend | Qwik | Resumability. ~1KB interactive. 0.6s TTI. O(1) startup regardless of app size |
| API | Elysia on Bun | Bun-native, end-to-end type safety, highest throughput TS backend |
| Offline DB | RxDB + CRDT | Field-level conflict resolution, OPFS, real offline-first with auto sync |
| UI | Radix primitives (headless) | Zero-runtime. WCAG AAA. Custom render layer |
| Styling | Tailwind v4 | Oxide engine, compile-time only, zero runtime CSS cost |
| Deploy | Cloudflare Workers + R2 + D1 + KV | Edge-first. 6+ Indian PoPs. 0ms cold start. Sub-50ms TTFB nationally |

### O(1) Guarantees

| Operation | Complexity | Implementation |
|-----------|-----------|----------------|
| Scheme eligibility lookup | O(1) | Pre-computed bloom filter + hash map per profile vector |
| Crisis triage routing | O(1) | Decision tree compiled to jump table at build time |
| User profile load | O(1) | Single key lookup in RxDB (OPFS) |
| Peer matching | O(1) amortized | Locality-sensitive hash. Pre-bucketed by geo + crisis type |
| Mission discovery | O(1) amortized | Inverted index, pre-built at sync time |
| i18n string resolution | O(1) | Flat key map, no nested lookups |
| Offline/online transition | O(1) | RxDB CRDT auto-merge |
| Component render | O(1) | Qwik resumability: attach listeners, no re-execution |
| Route navigation | O(1) | Qwik lazy loading: load only what's clicked |

### Data Architecture

```
CLOUDFLARE D1 (SQLite at edge)
├── schemes (id, name, ministry, eligibility_json, benefits, apply_url, state)
├── emergency_contacts (id, state, type, number, name, available_hours)
├── missions (id, template, category, requirements, impact_metric)
└── resources (id, type, location, verified, added_by)

CLOUDFLARE KV (globally replicated)
├── bloom:{profile_hash} -> scheme_ids (pre-computed eligibility)
├── geo:{geohash} -> peer_bucket_ids (locality-sensitive peer groups)
├── mission_index:{purpose_vector} -> mission_ids
└── i18n:{lang}:{key} -> string

RxDB CLIENT (OPFS)
├── user_profile (single doc, encrypted)
├── matched_schemes (synced subset)
├── circle (members, mission, activity)
├── offline_queue (pending syncs)
└── crisis_resources (cached, always available)

CLOUDFLARE R2
├── /offline-bundles/{version}/ (full offline PWA)
├── /assets/ (images, icons)
└── /data-snapshots/ (scheme DB snapshots for offline)
```

### Offline Strategy

1. Service worker caches entire crisis layer (Layer 1) on first visit
2. Scheme data snapshots in R2, pulled to RxDB on first sync
3. Emergency contacts always cached locally
4. Writes queue in RxDB, CRDT-sync when connection returns
5. Core functionality (crisis triage, scheme lookup, emergency contacts) works fully offline
6. Purpose compass works offline (local computation)
7. Circle activity syncs when connected, shows cached state when not

## 5. Accessibility (WCAG AAA)

- Semantic HTML, proper heading hierarchy, landmark regions
- Full keyboard navigation, visible focus indicators (3:1 contrast ratio)
- Screen reader tested: NVDA, TalkBack, VoiceOver
- Touch targets: minimum 48x48px (mobile), 44x44px (desktop)
- Color contrast: 7:1 minimum (AAA)
- Reduced motion: respects prefers-reduced-motion, no essential animations
- Text scaling: works up to 400% zoom
- RTL support: Hindi (LTR), Urdu (RTL), Arabic (RTL) ready
- Voice input compatible
- Captions on any audio/video content
- Alt text on every image
- Error messages: descriptive, actionable, associated with fields
- Forms: visible labels, not placeholder-only

## 6. i18n

- Hindi + English from day one
- String extraction: flat key map, ICU MessageFormat for pluralization
- Locale-aware: dates (Indian format DD/MM/YYYY), numbers (lakhs/crores), currency (INR)
- Unicode-safe: tested with Devanagari, Tamil, Bengali, Arabic
- Design for text expansion (Hindi strings ~40% longer than English)
- Regional languages: framework ready, add Tamil/Bengali/Marathi/Telugu as Phase 2

## 7. Privacy & Security (DPDP Act 2023 + GDPR)

- Consent: explicit, granular, revocable. No dark patterns.
- Data minimization: collect only what crisis triage and matching require
- PII never in logs, errors, URLs
- Profile data encrypted at rest (AES-256-GCM) in RxDB
- TLS 1.3 in transit, no exceptions
- India data stays in India (Cloudflare Mumbai/Chennai/Delhi routing)
- Real deletion: all stores (D1, KV, RxDB, R2 logs)
- No third-party analytics. Self-hosted only.
- Aadhaar: never stored. Used only as verification flow, token discarded after.

## 8. Claude MAX Orchestration

This section defines how every Claude MAX capability is used structurally in building and operating Udaan.

### Agent Teams (parallel build)

```
TEAM LEAD (Coordinator)
├── Agent: frontend    -- Qwik PWA, components, routing, offline
├── Agent: api         -- Elysia endpoints, D1 queries, KV ops
├── Agent: data        -- Scheme DB, eligibility engine, bloom filters
├── Agent: orchestration -- Hooks, skills, MCP, scheduled tasks, deploy
```

### MCP Servers

| Server | Purpose |
|--------|---------|
| Cloudflare D1 | Query/mutate scheme database directly from Claude |
| Cloudflare KV | Read/write bloom filters, geo buckets, i18n strings |
| Cloudflare R2 | Upload offline bundles, data snapshots, assets |
| GitHub | PR creation, issue tracking, code review |

### Scheduled Tasks

| Task | Schedule | Action |
|------|----------|--------|
| Scheme DB refresh | Daily 2am IST | Web search for new/updated government schemes, update D1 |
| Health check | Every 6 hours | Hit all edge endpoints, verify <50ms TTFB from Indian PoPs |
| Dependency audit | Weekly Monday | Scan for CVEs, auto-create fix PRs |
| Offline bundle regen | On scheme update | Rebuild R2 offline snapshots |
| Analytics digest | Weekly Friday | Aggregate usage, generate report |

### Hooks

| Hook | Trigger | Action |
|------|---------|--------|
| a11y-gate | Pre-commit | Run axe-core audit. Block if any AAA violations. |
| security-gate | Pre-commit | Run Semgrep scan. Block if any high/critical findings. |
| perf-gate | Pre-commit | Check bundle size <2KB initial. Block if exceeded. |
| i18n-check | Pre-commit | Verify all new strings have Hindi translations. |
| scheme-validate | Pre-push | Verify scheme data integrity, no broken links. |

### Skills

| Skill | Purpose |
|-------|---------|
| deploy | One-command Cloudflare Workers deploy with canary rollout |
| i18n-add | Add new language: extract strings, create locale file, validate |
| scheme-update | Fetch latest scheme data from web, validate, push to D1 |
| perf-audit | Full Lighthouse + Core Web Vitals audit against Indian 2G profile |
| crisis-test | Simulate crisis flows end-to-end, verify offline behavior |

### Other Capabilities

| Capability | Usage |
|-----------|-------|
| Web Search | Real-time scheme data updates, policy change detection |
| Computer Use | Automated e2e browser testing, screenshot regression |
| Persistent Memory | Architecture decisions, user preferences, project context |
| Compaction API | Long dev sessions without context window exhaustion |
| Extended Thinking | Complex eligibility logic design, CRDT conflict resolution strategy |
| Visualizations | Architecture diagrams, data flow charts, progress dashboards |
| Analytics API | Track dev productivity across agent teams |
| Dispatch | Mobile-initiated dev tasks |
| 300K output | Full module generation in single passes |
| Remote Tasks | Autonomous monitoring, scheduled code quality scans |

## 9. Performance Targets

| Metric | Target | How |
|--------|--------|-----|
| LCP | <1.0s on 4G, <2.5s on 2G | Qwik resumability, edge delivery |
| INP | <100ms | O(1) lookups, no heavy computation on interaction |
| CLS | <0.05 | No layout shifts, fixed component dimensions |
| TTFB | <50ms (India) | Cloudflare edge, 6+ Indian PoPs |
| Bundle (initial) | <2KB | Qwik, only load what's needed |
| Offline ready | <3s first visit | Aggressive SW precache of Layer 1 |
| Scheme lookup | <10ms | Pre-computed bloom + hash, client-side |

## 10. Project Structure

```
udaan/
├── CLAUDE.md                          # Project instructions for Claude
├── package.json                       # Bun workspace root
├── wrangler.toml                      # Cloudflare Workers config
├── .claude/
│   ├── settings.json                  # Hooks, permissions, MCP
│   └── skills/                        # Custom skills
│       ├── deploy/
│       ├── i18n-add/
│       ├── scheme-update/
│       ├── perf-audit/
│       └── crisis-test/
├── src/
│   ├── app/                           # Qwik app
│   │   ├── routes/
│   │   │   ├── index.tsx              # Landing / crisis entry
│   │   │   ├── sahara/               # Layer 1: Crisis
│   │   │   │   ├── triage.tsx
│   │   │   │   ├── schemes.tsx
│   │   │   │   ├── mental-health.tsx
│   │   │   │   └── peer-sos.tsx
│   │   │   ├── khoj/                 # Layer 2: Discovery
│   │   │   │   ├── compass.tsx
│   │   │   │   ├── missions.tsx
│   │   │   │   └── skills.tsx
│   │   │   ├── sangam/               # Layer 3: Community
│   │   │   │   ├── circles.tsx
│   │   │   │   ├── projects.tsx
│   │   │   │   └── discover.tsx
│   │   │   └── api/                  # Edge API routes
│   │   ├── components/
│   │   │   ├── ui/                   # Radix-based WCAG AAA components
│   │   │   ├── crisis/               # Crisis-specific components
│   │   │   ├── purpose/              # Purpose compass components
│   │   │   └── community/            # Circle/project components
│   │   └── lib/
│   │       ├── eligibility/          # Bloom filter + hash map engine
│   │       ├── matching/             # LSH peer + mission matching
│   │       ├── offline/              # RxDB setup, CRDT config, SW
│   │       ├── i18n/                 # Flat key map, locale loader
│   │       └── crypto/              # Profile encryption (AES-256-GCM)
│   ├── worker/                       # Cloudflare Worker (Elysia)
│   │   ├── index.ts                  # Elysia app entry
│   │   ├── routes/
│   │   │   ├── schemes.ts
│   │   │   ├── peers.ts
│   │   │   ├── missions.ts
│   │   │   ├── circles.ts
│   │   │   └── sync.ts
│   │   └── lib/
│   │       ├── d1.ts                 # D1 query helpers
│   │       ├── kv.ts                 # KV operations
│   │       └── auth.ts              # DigiLocker/Aadhaar flow
│   └── data/
│       ├── schemes/                  # Scheme JSON files
│       │   ├── central.json
│       │   └── states/
│       ├── emergency/                # Emergency contacts
│       ├── missions/                 # Mission templates
│       └── i18n/
│           ├── hi.json              # Hindi
│           └── en.json              # English
├── scripts/
│   ├── build-bloom-filters.ts        # Pre-compute eligibility bloom filters
│   ├── build-geo-buckets.ts          # Pre-compute LSH peer buckets
│   ├── build-mission-index.ts        # Pre-compute mission inverted index
│   ├── seed-d1.ts                    # Seed Cloudflare D1 with scheme data
│   └── validate-schemes.ts           # Validate scheme data integrity
├── tests/
│   ├── e2e/                          # Playwright e2e
│   │   ├── crisis-flow.spec.ts
│   │   ├── offline.spec.ts
│   │   ├── accessibility.spec.ts
│   │   └── peer-matching.spec.ts
│   ├── unit/
│   │   ├── eligibility.test.ts
│   │   ├── bloom-filter.test.ts
│   │   ├── lsh-matching.test.ts
│   │   └── crdt-sync.test.ts
│   └── load/
│       └── 2g-simulation.ts
└── docs/
    ├── showcase/                     # Claude orchestration showcase
    │   ├── capability-map.md
    │   └── orchestration-flow.md
    └── superpowers/
        └── specs/
            └── 2026-04-09-udaan-design.md
```

## 11. Scope for Showcase Build

The showcase build demonstrates the full orchestration. Not a production launch.

**In scope:**
- Complete Layer 1 (Sahara) with 50 central schemes, 5 states
- Purpose compass (Layer 2 entry)
- Circle formation UI (Layer 3 entry)
- Full offline support
- Hindi + English
- All Claude orchestration configs (hooks, skills, MCP, scheduled tasks, agent teams)
- WCAG AAA compliance
- O(1) eligibility engine with bloom filters
- Cloudflare Workers deployment
- e2e tests for crisis flow + offline + accessibility

**Out of scope (Phase 2):**
- Full 700+ scheme database
- All state-level schemes
- WhatsApp/SMS integration
- DigiLocker/Aadhaar auth
- Regional languages beyond Hindi
- Circle health monitoring AI
- Inter-circle discovery graph
- Production load testing
