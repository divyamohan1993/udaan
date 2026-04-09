---
name: perf-audit
description: Full performance audit against Indian 2G network conditions using Lighthouse
---

## Performance Audit -- 2G India Profile

### Target user
Slow Android phone, 2G connection, small-town India. If it works there, it works everywhere.

### Setup
1. Start dev server: `bun dev &`
2. Wait for server ready on http://localhost:5173

### Run audit
3. Execute Lighthouse with 2G throttling:
```bash
bunx lighthouse http://localhost:5173 \
  --chrome-flags="--headless --no-sandbox" \
  --throttling.cpuSlowdownMultiplier=6 \
  --throttling.throughputKbps=450 \
  --throttling.rttMs=400 \
  --output=json \
  --output-path=./lighthouse-report.json
```

### Check targets (MUST ALL PASS)
| Metric | Target | Why |
|--------|--------|-----|
| LCP | < 2.5s | Content visible fast on 2G |
| INP | < 200ms | Taps feel instant |
| CLS | < 0.1 | No layout jumps |
| Initial JS | < 2KB | Qwik resumability guarantee |
| TTFB | < 100ms | Edge delivery from Indian PoP |
| Accessibility | 100 | WCAG AAA compliance |

### Per-page audit
Run on all 5 critical pages:
- `/` (landing)
- `/sahara/triage?crisis=job-loss` (crisis triage)
- `/sahara/mental-health` (mental health)
- `/khoj/compass` (purpose compass)
- `/sangam/circles` (community)

### If targets fail
4. Identify bottleneck from Lighthouse report
5. Common fixes: lazy-load non-critical JS, reduce font payload, optimize images
6. Re-run audit after fix
7. Report results with pass/fail per metric per page

### Cleanup
8. Kill dev server: `kill %1`
