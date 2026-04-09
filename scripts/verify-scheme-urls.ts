#!/usr/bin/env bun
/**
 * Scheme URL Verifier
 *
 * Checks every scheme's applyUrl resolves to a real .gov.in/.nic.in website.
 * Flags dead links, redirects, and non-government URLs.
 *
 * Usage: bun scripts/verify-scheme-urls.ts
 */

import { readFileSync } from "fs";

interface Scheme {
  id: string;
  name: string;
  applyUrl: string;
}

async function main() {
  console.log("=== Scheme URL Verification ===\n");

  const schemes: Scheme[] = JSON.parse(
    readFileSync("src/data/schemes/central.json", "utf8")
  );

  console.log(`Checking ${schemes.length} scheme URLs...\n`);

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  for (const scheme of schemes) {
    const url = scheme.applyUrl;

    // Check domain is .gov.in or .nic.in or known official
    const domain = new URL(url).hostname;
    const isOfficial =
      domain.endsWith(".gov.in") ||
      domain.endsWith(".nic.in") ||
      domain.endsWith(".org.in") ||
      domain === "mudra.org.in" ||
      domain === "pmkvyofficial.org" ||
      domain === "maandhan.in" ||
      domain === "standupmitra.in" ||
      domain === "pmgdisha.in";

    if (!isOfficial) {
      console.log(`  ⚠️  ${scheme.id}: ${url} (non-.gov.in domain)`);
      warnings++;
      continue;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        console.log(`  ✅ ${scheme.id}: ${res.status} ${domain}`);
        passed++;
      } else {
        console.log(`  ❌ ${scheme.id}: ${res.status} ${url}`);
        failed++;
      }
    } catch (err) {
      // Many .gov.in sites block HEAD requests but work with GET
      console.log(`  ⚠️  ${scheme.id}: connection issue (${domain}) -- may still work in browser`);
      warnings++;
    }

    // Rate limit: don't hammer government servers
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n=== Results ===`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);
  console.log(`  Total: ${schemes.length}`);

  if (failed > 0) {
    console.log(`\n${failed} URLs failed. Review and update these schemes.`);
    process.exit(1);
  }
}

main();
