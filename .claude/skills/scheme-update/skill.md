---
name: scheme-update
description: Fetch latest Indian government scheme data using web search and update the database
---

## Update Government Scheme Database

### Research phase
1. Use web search to find newly announced or updated Indian government schemes
2. Focus on: new PM schemes, budget announcements, state-level additions
3. Verify each scheme is REAL: check .gov.in or .nic.in official source
4. Cross-reference eligibility with official guidelines

### Data phase
5. Read `src/data/schemes/central.json`
6. For each new scheme, add entry with ALL required fields:
   - id, name, nameHi (natural Hindi, not transliterated)
   - ministry, description, descriptionHi
   - benefits, benefitsHi
   - eligibility (states, ageBrackets, incomeBrackets, categories, genders, occupationTypes)
   - applyUrl (must be real .gov.in/.nic.in URL)
   - applySteps, applyStepsHi
   - category, scope
7. Validate JSON: `bun -e "JSON.parse(require('fs').readFileSync('src/data/schemes/central.json','utf8'))"`

### Verification phase
8. Run eligibility engine tests: `bunx vitest run src/lib/eligibility/`
9. Run i18n check: `bun scripts/check-i18n.ts`
10. Rebuild bloom filters: `bun scripts/build-bloom-filters.ts`
11. Commit: `git add src/data/ && git commit -m "data: update scheme database with latest government schemes"`

### Quality gates
- Every URL must resolve to a real government website
- Every Hindi string must be natural language, not machine translation
- Eligibility must match official government criteria
- Scheme count must only increase, never decrease
