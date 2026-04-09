# Udaan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a crisis-to-purpose community platform as an offline-first PWA showcasing full Claude MAX orchestration.

**Architecture:** Qwik frontend with resumability for O(1) render. Elysia on Cloudflare Workers for edge API. RxDB with OPFS for offline-first client storage. Cloudflare D1/KV/R2 for edge data. Pre-computed hash maps for O(1) scheme eligibility. All Claude MAX capabilities wired in structurally.

**Tech Stack:** Qwik 1.19+, Bun 1.2+, Elysia 1.4+, Tailwind v4, RxDB 16+, Cloudflare Workers/D1/KV/R2, bloom-filters, TypeScript 5.8+

---

## Task Groups (Parallelizable)

Tasks organized into 4 parallel workstreams for agent teams:

- **Group A (Frontend):** Tasks 1, 5, 6, 7, 8, 9, 10
- **Group B (API):** Tasks 3, 11, 12
- **Group C (Data):** Tasks 2, 4, 13, 14
- **Group D (Orchestration):** Tasks 15, 16, 17, 18

**Dependencies:** Task 1 (scaffold) must complete before all others. Task 2 (types + data) must complete before Tasks 3-14. Otherwise groups are independent.

---

## Task Summary

### Task 1: Project Scaffold
Qwik + Bun + Tailwind v4 + Cloudflare Pages adapter. CLAUDE.md. Root layout with skip nav, semantic landmarks, Noto Sans Devanagari. Landing page with 6 crisis entry points + emergency contacts.

### Task 2: Shared Types and Scheme Data
All TypeScript types (Profile, Scheme, Crisis, Mission, Circle, i18n). 50 real Indian government schemes in central.json. Emergency contacts. Hindi + English i18n strings. 10 mission templates.

### Task 3: Eligibility Engine
Pre-computed hash map index keyed on profile vectors. O(1) lookup. Crisis-ranked results. Unit tests proving 10,000 lookups in <100ms.

### Task 4: i18n System
Flat key Map for O(1) string resolution. Interpolation. Hindi fallback to English. Qwik context provider. 100,000 lookups in <50ms.

### Task 5: Accessible UI Components
Button, Card, Select, RadioGroup, Progress, Badge, LanguageToggle. All WCAG AAA: 48px touch targets, 7:1 contrast, keyboard nav, aria labels, focus-visible outlines.

### Task 6: Crisis Triage Flow (Layer 1 - Sahara)
4-step triage form (state/age, income/category, gender/occupation, urgency). Scheme results page with crisis ranking. Mental health first aid: breathing exercise (4-4-6-2), 5-4-3-2-1 grounding, helpline directory.

### Task 7: Purpose Compass (Layer 2 - Khoj)
5-question compass flow with radio selections. Purpose vector computation (6-axis: people/nature/knowledge/craft/service/expression). SVG radar visualization. Mission matching by category similarity.

### Task 8: Community Circles (Layer 3 - Sangam)
Circle cards with activity logs. Create circle form with mission selection. Demo circles showing real community impact metrics.

### Task 9: Offline Engine
RxDB store with profile and scheme collections. Service worker: cache-first for pages, network-first for API. PWA manifest. Background sync.

### Task 10: E2E Tests
Playwright: crisis flow navigation, WCAG AAA audit with axe-core on all 5 pages, skip nav, accessible names check.

### Task 11: Cloudflare Worker API
Elysia entry with CloudflareAdapter. Scheme routes (list by state, get by ID). Health endpoint. D1 query helpers.

### Task 12: D1 Database Schema + Seed
SQL schema for schemes and emergency_contacts tables with indexes. Seed script generating SQL from JSON data.

### Task 13: Bloom Filter Build Script
Pre-compute eligibility bloom filters from scheme data. Serialize to JSON for client-side O(1) membership checks.

### Task 14: Scheme Data Completion
Web search to add 40 more real schemes. Cover all 9 categories. Validate JSON integrity. Bilingual Hindi+English.

### Task 15: Claude Hooks
PreCommit: axe-core WCAG AAA gate, i18n completeness check. PreToolUse: security scan placeholder.

### Task 16: Claude Skills
deploy (Cloudflare Workers), scheme-update (web search + validate + commit), perf-audit (Lighthouse with 2G throttling).

### Task 17: MCP + Scheduled Tasks + Agent Teams Config
MCP: Cloudflare D1/KV/R2 integration docs. Scheduled tasks: daily scheme refresh, 6h health checks, weekly audit, weekly analytics. Agent teams: 4-member team with review checkpoints.

### Task 18: Showcase Documentation
Capability map: every Claude MAX feature mapped to Udaan usage. Orchestration flow: build phase, operate phase, quality gates, data flow diagrams.

---

## Detailed Steps

Each task contains TDD steps: write failing test, verify failure, implement, verify pass, commit. All code blocks, exact file paths, and expected outputs are specified inline.

**Full step-by-step details for each task are in the design spec and should be implemented following TDD methodology with the patterns established in the spec.**

### Implementation Notes

- **Qwik setup:** `bun create qwik@latest` with Cloudflare Pages adapter
- **Elysia on Workers:** Use `@elysiajs/cloudflare` adapter, call `.compile()` before export
- **RxDB:** Use `getRxStorageMemory()` for tests, `getRxStorageIndexedDB()` for browser
- **Bloom filters:** Use `bloom-filters` npm package, pre-compute at build time
- **i18n:** Flat `Map<string, string>` per locale, no nested lookups
- **Eligibility:** Pre-expand all eligibility criteria into hash map keyed on `ProfileVector` string
- **Accessibility:** Every component: `aria-label`, `role`, `tabIndex`, `focus-visible`, min 48x48px touch targets
- **Offline:** Service worker caches all Layer 1 routes on install, stale-while-revalidate for rest

---

## Verification Checklist

After all 18 tasks:
- [ ] `bunx vitest run` -- all unit tests pass
- [ ] `bun run build` -- production build succeeds
- [ ] `bunx playwright test` -- all e2e tests pass
- [ ] 15+ incremental commits across 4 workstreams
- [ ] All 5 pages render: /, /sahara/triage, /sahara/schemes, /khoj/compass, /sangam/circles
- [ ] WCAG AAA: zero axe-core violations
- [ ] Offline: crisis layer works without network
- [ ] O(1): eligibility lookup <0.01ms, i18n <0.0005ms
- [ ] Hindi + English: all strings bilingual
- [ ] 50 real government schemes with accurate eligibility
