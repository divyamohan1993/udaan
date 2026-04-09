<p align="center">
  <img src="https://img.shields.io/badge/उड़ान-Udaan-dc2626?style=for-the-badge&labelColor=1c1917&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2RjMjYyNiI+PHBhdGggZD0iTTIxIDN2MThINlYzbDE1IDB6TTkgMTJsMyAzIDMtMyIvPjwvc3ZnPg==" alt="Udaan" />
</p>

<h1 align="center">उड़ान Udaan</h1>

<p align="center">
  <strong>Crisis Entry. Purpose Destination.</strong><br/>
  <em>A community purpose platform for India's post-automation future.</em>
</p>

<p align="center">
  <a href="#what-it-does"><img src="https://img.shields.io/badge/What-It%20Does-2563eb?style=flat-square" alt="What" /></a>
  <a href="#why-it-exists"><img src="https://img.shields.io/badge/Why-It%20Exists-16a34a?style=flat-square" alt="Why" /></a>
  <a href="#how-it-works"><img src="https://img.shields.io/badge/How-It%20Works-dc2626?style=flat-square" alt="How" /></a>
  <a href="#built-with"><img src="https://img.shields.io/badge/Built-With-8b5cf6?style=flat-square" alt="Built With" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tests-60%20passing-16a34a?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/schemes-54%20verified%20%7C%204650%2B%20pipeline-2563eb?style=flat-square" alt="Schemes" />
  <img src="https://img.shields.io/badge/languages-Hindi%20%2B%20English-f59e0b?style=flat-square" alt="Languages" />
  <img src="https://img.shields.io/badge/accessibility-WCAG%20AAA-16a34a?style=flat-square" alt="WCAG AAA" />
  <img src="https://img.shields.io/badge/offline-first-dc2626?style=flat-square" alt="Offline First" />
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue?style=flat-square" alt="License" />
</p>

---

## The Problem

AI will automate 80% of work within a decade. India has 1.4 billion people, median age 28. The transition will be brutal for millions.

When you lose your job, you need three things:
1. **Immediate help** -- government schemes, food, money
2. **A reason to get up** -- purpose beyond a paycheck
3. **People who understand** -- community, not isolation

No platform connects all three. Until now.

---

## What It Does

**Three layers. One journey.**

```
Someone loses their job
        |
        v
  ┌─────────────┐     ┌──────────────┐     ┌───────────────┐
  │   SAHARA     │     │    KHOJ      │     │    SANGAM     │
  │   सहारा      │ --> │    खोज       │ --> │    संगम        │
  │              │     │              │     │               │
  │  54 govt     │     │  5 questions │     │  5-8 people   │
  │  schemes     │     │  find your   │     │  one mission  │
  │  matched     │     │  purpose     │     │  meet weekly  │
  │  instantly   │     │              │     │               │
  │  + mental    │     │  SVG radar   │     │  real impact  │
  │  health aid  │     │  of who you  │     │  tracked      │
  │              │     │  really are  │     │               │
  └─────────────┘     └──────────────┘     └───────────────┘
      Crisis              Discovery            Community
```

**Sahara** catches you. **Khoj** helps you find what matters. **Sangam** connects you to others who share it.

---

## Why It Exists

When robots serve you and AI thinks for you, three things become scarce:

**Purpose.** Work gave people identity. Strip that away and you get an existential crisis at civilizational scale.

**Connection.** Surrounded by digital twins and AI companions, real human contact becomes the rarest resource.

**Agency.** The feeling that YOUR choices matter. That YOU did something.

Udaan is infrastructure for staying human.

---

## How It Works

### For a farmer in Jharkhand on a 2G phone

1. Opens Udaan. Sees: **"आपकी मदद यहाँ है"** (Help is here)
2. Taps: **"मेरी नौकरी चली गई"** (I lost my job)
3. Answers 8 questions about themselves
4. Gets: **14 government schemes** they qualify for, ranked by urgency
5. Sees: **"अब मकसद खोजें?"** (Find purpose now?)
6. Answers 5 questions about what makes them feel alive
7. Gets: A **purpose radar** showing their 6 axes of meaning
8. Sees: **"आपके जैसे लोग पास में हैं"** (People like you are nearby)
9. Joins a **circle** of 5-8 people with a shared mission
10. Every week: they meet, they do, they grow

**Time from crisis to community: 10 minutes.**

### O(1) Everything

| Operation | Speed | Proof |
|-----------|-------|-------|
| Scheme eligibility | 10,000 lookups in <100ms | Pre-computed hash map. Tested. |
| Language resolution | 100,000 lookups in <50ms | Flat key Map. Tested. |
| Page load on 2G | <2.5s LCP | Qwik resumability. ~1KB initial JS. |
| Offline to online | Seamless | RxDB CRDT sync. No data loss. |

---

## Defense in Depth

Every layer assumes the layer above is broken.

| If this breaks... | This still works |
|-------------------|-----------------|
| JavaScript disabled | Emergency `tel:` links in raw HTML |
| Service worker fails | Network requests + RxDB local data |
| Network fails | Full offline via cached pages + local DB |
| Cache AND network fail | Hardcoded emergency HTML with phone numbers |
| Everything fails | `tel:112` is a native phone link. Always works. |

**Emergency contacts on every page.** Not in a menu. Not behind a click. Right there.

---

## Real Data. Not Demos.

| What | Count | Source |
|------|-------|--------|
| Government schemes (verified seed) | 54 | myscheme.gov.in, pib.gov.in |
| Government schemes (full pipeline) | 4,650+ | myscheme.gov.in sitemap + API Setu |
| Emergency helplines | 12 | Verified active: 112, KIRAN, 181, 1098, NALSA |
| i18n strings | 220 per language | Hindi + English, full parity |
| Mission templates | 10 | Real community activities |
| Scheme categories | 9 | Employment, food, health, housing, education, finance, skill, pension, insurance |

Every URL points to `.gov.in`. Every phone number is active. Every Hindi string is natural language.

MGNREGA was renamed to **VB-G RAM G** in April 2026 (125 days, 60:40 funding). We updated it. Because real data matters.

---

## Built With

### Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | **Qwik** | Resumability. ~1KB interactive. O(1) render. |
| Runtime | **Bun** | 4x faster startup than Node. |
| API | **Elysia** | Bun-native. Type-safe. Fastest TS backend. |
| Offline | **RxDB** | CRDT sync. IndexedDB. Real offline-first. |
| Styling | **Tailwind v4** | Compile-time only. Zero runtime CSS. |
| Edge | **Cloudflare Workers** | 0ms cold start. 6+ Indian cities. <50ms TTFB. |
| Data | **Bloom filters + Hash maps** | O(1) eligibility lookup. Research-grade. |

### Claude MAX Orchestration

This project was built using **every capability** of the Claude MAX subscription as a showcase of hyper-agentic development:

| Capability | How It Was Used |
|-----------|----------------|
| **Agent Teams** | 4 parallel agents (frontend, api, data, orchestration) |
| **MCP Servers** | Cloudflare D1/KV/R2 for edge data management |
| **Scheduled Tasks** | 5 autonomous cron jobs for scheme refresh, health checks |
| **Skills** | deploy, scheme-update, perf-audit |
| **Hooks** | i18n parity check, type check, test gate |
| **Web Search** | Verified helplines, MGNREGA rename, scheme URLs |
| **Computer Use** | 24 Playwright e2e tests on chromium + mobile |
| **Extended Thinking** | O(1) eligibility engine design |
| **1M Context** | Full 140-file project in single session |

See [docs/showcase/capability-map.md](docs/showcase/capability-map.md) for the complete mapping.

---

## Quick Start

```bash
# Clone
git clone https://github.com/divyamohan1993/udaan.git
cd udaan

# Install
bun install

# Run
bun dev

# Test (60 tests)
bun test                    # 36 unit tests
bunx playwright test        # 24 e2e tests

# Build
bun run build
```

---

## Project Structure

```
udaan/
├── src/
│   ├── routes/                    # Pages
│   │   ├── index.tsx              # Landing -- "आपकी मदद यहाँ है"
│   │   ├── sahara/                # Layer 1: Crisis
│   │   │   ├── triage.tsx         # 8-question eligibility form
│   │   │   ├── schemes.tsx        # O(1) scheme matching results
│   │   │   └── mental-health.tsx  # Breathing + grounding + helplines
│   │   ├── khoj/                  # Layer 2: Purpose
│   │   │   ├── compass.tsx        # 5-question purpose flow + radar
│   │   │   └── missions.tsx       # Community missions
│   │   └── sangam/                # Layer 3: Community
│   │       └── circles.tsx        # Circles + create + activity
│   ├── components/
│   │   ├── ui/                    # WCAG AAA component library
│   │   ├── crisis/                # Triage, scheme cards, breathing
│   │   ├── purpose/               # Compass, radar chart, missions
│   │   ├── community/             # Circles, create form
│   │   └── shared/                # Emergency footer, mental health FAB
│   ├── lib/
│   │   ├── eligibility/           # O(1) pre-computed hash map engine
│   │   ├── i18n/                  # O(1) flat key map, Hindi + English
│   │   ├── matching/              # Purpose vector + mission matching
│   │   ├── offline/               # RxDB store + CRDT sync
│   │   ├── schemes/               # MyScheme.gov.in live integration
│   │   └── state/                 # Cross-layer journey persistence
│   ├── data/
│   │   ├── schemes/central.json   # 54 verified government schemes
│   │   ├── emergency/contacts.json # 12 real helplines
│   │   ├── i18n/{en,hi}.json      # 220 keys, full parity
│   │   └── missions/templates.json # 10 community missions
│   └── shared/                    # Types + constants
├── .claude/
│   ├── settings.json              # Hooks (i18n check, type check, test gate)
│   └── skills/                    # deploy, scheme-update, perf-audit
├── orchestration/
│   ├── mcp-config.json            # Cloudflare D1/KV/R2
│   ├── scheduled-tasks.json       # 5 autonomous cron jobs
│   └── agent-teams.json           # 4-agent build documentation
├── scripts/
│   ├── ingest-myscheme.ts         # Full 4,650+ scheme pipeline
│   ├── verify-scheme-urls.ts      # URL health checker
│   ├── check-i18n.ts              # Hindi parity gate
│   ├── seed-d1.ts                 # Cloudflare D1 seeder
│   └── build-bloom-filters.ts     # O(1) eligibility pre-computation
└── tests/
    ├── e2e/                       # 24 Playwright tests (desktop + mobile)
    └── (unit tests colocated)     # 36 vitest tests
```

---

## Accessibility

WCAG AAA. Not as an afterthought. As line one.

- **7:1 contrast ratio** -- exceeds AAA requirements
- **48px minimum touch targets** -- works with motor impairments
- **Full keyboard navigation** -- Tab through everything
- **Screen reader tested** -- semantic HTML, ARIA labels, landmarks
- **Reduced motion** -- respects `prefers-reduced-motion`
- **High contrast mode** -- responds to `prefers-contrast: more`
- **Text scaling** -- works at 400% zoom
- **Hindi-first** -- primary user's language comes first

---

## Scheme Data Pipeline

```
myscheme.gov.in (4,650+ schemes)
        |
        v
  sitemap.xml (all scheme URLs)
        |
        v
  ingest-myscheme.ts (fetch + transform)
        |
        v
  ┌─────────────────┐     ┌──────────────┐     ┌───────────┐
  │ Tier 1: Offline  │     │ Tier 2: Edge │     │ Tier 3:   │
  │ 54 verified seed │     │ Cloudflare   │     │ Live API  │
  │ central.json     │     │ D1 (full DB) │     │ API Setu  │
  │ Always works.    │     │ <50ms TTFB   │     │ Real-time │
  └─────────────────┘     └──────────────┘     └───────────┘
  
  Daily refresh: Claude scheduled task at 2am IST
  Weekly audit: dependency CVE scan + URL verification
```

---

## Contributing

This is an open project for India. Contributions welcome:

- **Add state-level schemes** -- 4,020+ state schemes need verification
- **Improve Hindi translations** -- natural language, not machine
- **Add regional languages** -- Tamil, Bengali, Marathi, Telugu
- **Verify scheme eligibility** -- cross-reference with official guidelines
- **Build the peer matching** -- locality-sensitive hashing for nearby users

---

## License

[Apache 2.0](LICENSE) with [NOTICE](NOTICE).

---

<p align="center">
  <strong>उड़ान</strong> -- because when AI takes 80% of work,<br/>
  the platform that connects a farmer in Jharkhand<br/>
  to the 14 schemes he qualifies for<br/>
  becomes more critical every year, not less.
</p>

<p align="center">
  <em>#AatmanirbharBharat @India2047</em><br/>
  <em>Dream, Manifest and Journey, Together as One.</em>
</p>

<p align="center">
  <sub>Built with <a href="https://claude.ai/code">Claude Code</a> by <a href="https://dmj.one">dmj.one</a></sub>
</p>
