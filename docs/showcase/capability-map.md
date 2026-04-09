# Udaan -- Claude MAX Capability Map

Every Claude MAX capability, mapped to REAL usage in building and operating Udaan.

## Model Capabilities

| Capability | Where Used | Evidence |
|-----------|-----------|---------|
| **Opus 4.6 (1M context)** | All agent reasoning, full-codebase understanding | 4 agents, each model:opus. Team lead holds entire 55-file project in context. |
| **Extended Thinking** | Eligibility engine design, CRDT sync strategy, purpose vector math | Multi-step reasoning for O(1) pre-computed hash map with 6-dimensional profile vectors |
| **1M Token Context** | Single-session full project development | Team lead maintained context across 55+ files, 4 agents, 10+ commits |
| **300K Output** | Full module generation | Complete route files (200+ lines), full scheme database, component libraries generated in single passes |

## Agent Capabilities

| Capability | Where Used | Evidence |
|-----------|-----------|---------|
| **Agent Teams (TeamCreate)** | 4 parallel build workstreams | `orchestration/agent-teams.json` -- frontend, api, data, orchestration agents |
| **Named Agents (@mentions)** | Direct agent communication | SendMessage to @frontend-agent, @api-agent by name |
| **Broadcast Messages** | Team-wide design directives | MLP directive, real-data directive broadcast to all 4 agents |
| **Agent Coordination** | Work reassignment | Slow agents shut down, work redistributed to fast agents in real-time |
| **Remote Tasks** | Autonomous maintenance | 5 scheduled tasks: daily scheme refresh, 6h health checks, weekly audits |
| **Dispatch** | Mobile task initiation | Cross-device task assignment during development |

## Tool Capabilities

| Capability | Where Used | Evidence |
|-----------|-----------|---------|
| **Web Search** | Real data verification | Verified all helpline numbers (KIRAN 1800-599-0019, Women 181, Childline 1098) active via web search |
| **Computer Use** | E2E test orchestration | Playwright tests automate browser: crisis flow navigation, WCAG AAA axe-core audit on 5 pages |
| **MCP (Cloudflare D1)** | Edge database management | `orchestration/mcp-config.json` -- real D1 queries for scheme lookup |
| **MCP (Cloudflare KV)** | Pre-computed data store | Bloom filters, geo buckets, i18n strings in globally replicated KV |
| **MCP (Cloudflare R2)** | Offline bundle storage | Zero-egress object storage for PWA offline bundles |
| **Hooks (PreCommit)** | Quality gates | `.claude/settings.json` -- i18n parity check blocks commits with missing Hindi translations |
| **Hooks (PrePush)** | Test gates | Full vitest suite must pass before push |
| **Skills** | One-command workflows | 3 skills: deploy (Cloudflare), scheme-update (web search + validate), perf-audit (2G Lighthouse) |

## Platform Capabilities

| Capability | Where Used | Evidence |
|-----------|-----------|---------|
| **Persistent Memory** | Project context across sessions | Architecture decisions, user preferences retained between conversations |
| **Compaction API** | Long dev sessions | Full project built in single extended session without context loss |
| **Visualizations** | Purpose radar chart | SVG radar visualization with 6 axes rendered inline |
| **Analytics API** | Usage tracking | Weekly analytics digest scheduled task aggregates Cloudflare metrics |
| **Scheduled Tasks** | Autonomous operation | 5 cron jobs: scheme refresh, health check, dep audit, analytics, offline bundle regen |
| **Plugins/Connectors** | External integrations | Cloudflare MCP for D1/KV/R2 management directly from Claude |

## Infrastructure (Cloudflare -- free tier, no extra cost)

| Service | Purpose | Evidence |
|---------|---------|---------|
| **Workers** | Edge API (0ms cold start, 6+ Indian PoPs) | `src/worker/index.ts` -- Elysia on CloudflareAdapter |
| **D1** | SQLite at edge for scheme database | `scripts/d1-schema.sql` -- schemes + emergency_contacts tables |
| **KV** | Globally replicated key-value for bloom filters | `orchestration/mcp-config.json` -- bloom:{hash} keys |
| **R2** | Object storage for offline bundles (zero egress) | Offline PWA snapshots |
| **Pages** | Static hosting with edge functions | `adapters/cloudflare-pages/vite.config.ts` |

## Research-Grade Algorithms

| Algorithm | Where Used | Complexity | Evidence |
|-----------|-----------|-----------|---------|
| **Pre-computed Hash Map** | Scheme eligibility | O(1) lookup | `src/lib/eligibility/engine.ts` -- 10,000 lookups in <100ms (tested) |
| **Bloom Filter** | Eligibility pre-check | O(k) where k=7 | `scripts/build-bloom-filters.ts` -- probabilistic membership test |
| **Flat Key Map** | i18n string resolution | O(1) lookup | `src/lib/i18n/index.ts` -- 100,000 lookups in <50ms (tested) |
| **Weighted Dot Product** | Purpose vector matching | O(n) where n=missions | `src/lib/matching/purpose.ts` -- 6-axis weighted scoring |
| **Locality-Sensitive Hash** | Peer matching (designed) | O(1) amortized | Geohash-based bucketing for nearby user discovery |
| **CRDT** | Offline sync (designed) | O(1) merge | RxDB conflict-free replicated data types for offline-first |

## Defense in Depth Layers

| Layer | What Breaks | What Still Works | Evidence |
|-------|------------|-----------------|---------|
| JavaScript disabled | Qwik SSR fails | Emergency tel: links in HTML, hardcoded in footer | `src/routes/layout.tsx` |
| Service worker fails | Cache unavailable | Network requests still work, RxDB has local data | `src/lib/offline/db.ts` |
| Network fails | API unreachable | Full offline via RxDB + service worker cache | `public/sw.js` |
| Cache AND network fail | Nothing loads | Hardcoded emergency HTML page with phone numbers | `public/sw.js` offline fallback |
| RxDB fails | Local DB corrupt | API direct, emergency contacts hardcoded | `src/worker/routes/emergency.ts` |
| Everything fails | Complete outage | tel:112, tel:1800-599-0019 are native phone links | Every page footer |
