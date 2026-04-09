---
name: deploy
description: Deploy Udaan to Cloudflare Workers with full verification pipeline
---

## Deploy Udaan to Production

### Pre-deploy checks
1. Run full test suite: `bunx vitest run`
2. Run i18n check: `bun scripts/check-i18n.ts`
3. Build production bundle: `bun run build`
4. Verify bundle size: initial JS must be under 2KB (Qwik resumability)

### Deploy
5. Deploy to Cloudflare Pages: `bunx wrangler pages deploy dist/`
6. Verify health endpoint: `curl -s https://udaan.pages.dev/health | jq .status`
7. Expected response: `{"status":"ok","timestamp":"...","version":"1.0.0"}`

### Post-deploy verification
8. Test crisis flow: navigate / -> /sahara/triage -> /sahara/schemes
9. Verify offline: disconnect network, confirm /sahara/mental-health loads from cache
10. Verify emergency contacts render on every page (defense in depth)
11. Check TTFB from Indian PoP: should be under 50ms from Mumbai/Delhi

### Rollback
If any post-deploy check fails:
- `bunx wrangler pages deployment rollback`
- Investigate, fix, re-deploy
