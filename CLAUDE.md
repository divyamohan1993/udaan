# Udaan

Community purpose platform for post-labor India. Crisis entry, purpose destination.

## Stack
- Qwik 1.19+ (frontend, resumability, O(1) render)
- Elysia on Bun (API, Cloudflare Workers)
- RxDB + IndexedDB (offline-first client DB)
- Cloudflare Workers + D1 + KV + R2 (edge infra)
- Tailwind v4 (compile-time CSS)
- bloom-filters (O(1) eligibility lookup)

## Architecture
- Three layers: Sahara (crisis), Khoj (discovery), Sangam (community)
- Every lookup O(1). Pre-computed hash map for eligibility. LSH for peer matching.
- Offline-first. Core works without network. CRDT sync when connected.
- WCAG AAA. 7:1 contrast. 48px touch targets. Full keyboard nav.
- Hindi + English. i18n via flat key map.

## Commands
- `bun dev` -- start dev server
- `bun run build` -- build for production
- `bun test` -- run vitest unit tests
- `bun run test:e2e` -- run playwright e2e tests

## Conventions
- Components in `src/components/`
- Routes in `src/routes/`
- Shared types in `src/shared/types.ts`
- i18n strings in `src/data/i18n/`
- All components must have `aria-label` or `aria-labelledby`
- All interactive elements must be keyboard accessible
- Never hardcode strings -- always use i18n keys
- Test files colocated: `foo.test.ts` next to `foo.ts`
