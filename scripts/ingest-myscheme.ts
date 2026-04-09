#!/usr/bin/env bun
/**
 * MyScheme.gov.in Full Ingestion Pipeline
 *
 * Ingests ALL 4,650+ government schemes from the official platform.
 *   - 620+ Central Government schemes
 *   - 4,020+ State/UT Government schemes
 *
 * Data sources (all official Government of India):
 *   1. myscheme.gov.in/sitemap.xml -- full URL list of every scheme page
 *   2. directory.apisetu.gov.in/api-collection/myscheme -- official API
 *   3. huggingface.co/datasets/shrijayan/gov_myscheme -- pre-extracted dataset
 *
 * Usage:
 *   bun scripts/ingest-myscheme.ts                    # Full ingestion via sitemap
 *   bun scripts/ingest-myscheme.ts --central-only     # 620+ central only
 *   bun scripts/ingest-myscheme.ts --state UP         # Single state
 *   bun scripts/ingest-myscheme.ts --from-huggingface # Use pre-extracted dataset
 *
 * Rate limiting: 1 request/second to respect government servers.
 * Expected runtime: ~2 hours for full 4,650+ (with rate limiting).
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";

const MYSCHEME_BASE = "https://www.myscheme.gov.in";
const SITEMAP_URL = `${MYSCHEME_BASE}/sitemap.xml`;
const HUGGINGFACE_URL = "https://huggingface.co/datasets/shrijayan/gov_myscheme/resolve/main/data/train.json";
const OUTPUT_DIR = "src/data/schemes";
const RATE_LIMIT_MS = 1000;

interface RawScheme {
  url: string;
  slug: string;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  applicationProcess: string;
  ministry: string;
  state: string | null;
  tags: string[];
}

// Step 1: Fetch sitemap to discover all scheme URLs
async function fetchSitemap(): Promise<string[]> {
  console.log("Step 1: Fetching sitemap from myscheme.gov.in...");
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error("Sitemap fetch failed: " + res.status);

  const xml = await res.text();
  const urlRegex = /<loc>(https:\/\/www\.myscheme\.gov\.in\/schemes\/[^<]+)<\/loc>/g;
  const urls: string[] = [];
  let match;
  while ((match = urlRegex.exec(xml)) !== null) urls.push(match[1]);
  console.log("  Found " + urls.length + " scheme URLs in sitemap\n");
  return urls;
}

// Step 2: Fetch individual scheme page and extract data
async function fetchScheme(url: string): Promise<RawScheme | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Udaan/1.0 (community-purpose-platform; contact@dmj.one)",
        "Accept": "text/html",
      },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const slug = url.split("/schemes/")[1] || "";

    // Extract from meta tags and page structure
    const nameMatch = /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i.exec(html);
    const descMatch = /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i.exec(html);
    const name = nameMatch?.[1] || slug;
    const description = descMatch?.[1] || "";

    return {
      url,
      slug,
      name: name.replace(/<[^>]*>/g, "").trim(),
      description: description.replace(/<[^>]*>/g, "").trim(),
      eligibility: "",
      benefits: "",
      applicationProcess: "",
      ministry: "",
      state: null,
      tags: [],
    };
  } catch {
    return null;
  }
}

// Step 3: Transform to Udaan format
function transformScheme(raw: RawScheme): Record<string, unknown> {
  return {
    id: raw.slug,
    name: raw.name,
    nameHi: raw.name,
    ministry: raw.ministry || "Government of India",
    description: raw.description,
    descriptionHi: raw.description,
    benefits: raw.benefits,
    benefitsHi: raw.benefits,
    eligibility: {
      states: raw.state ? [raw.state] : "all",
      ageBrackets: "all",
      incomeBrackets: "all",
      categories: "all",
      genders: "all",
      occupationTypes: "all",
    },
    applyUrl: raw.url,
    applySteps: ["Visit " + raw.url + " for application details"],
    applyStepsHi: ["आवेदन के लिए " + raw.url + " पर जाएं"],
    category: guessCategory(raw.name, raw.description),
    scope: raw.state || "central",
    source: "myscheme.gov.in",
    verified: false,
    needsHindiTranslation: true,
    ingestedAt: new Date().toISOString(),
  };
}

function guessCategory(name: string, desc: string): string {
  const text = (name + " " + desc).toLowerCase();
  if (text.includes("health") || text.includes("medical") || text.includes("arogya")) return "health";
  if (text.includes("education") || text.includes("scholarship") || text.includes("vidya")) return "education";
  if (text.includes("employment") || text.includes("rozgar") || text.includes("job")) return "employment";
  if (text.includes("food") || text.includes("ration") || text.includes("anna")) return "food";
  if (text.includes("housing") || text.includes("awas") || text.includes("ghar")) return "housing";
  if (text.includes("skill") || text.includes("kaushal") || text.includes("training")) return "skill";
  if (text.includes("pension") || text.includes("vridha")) return "pension";
  if (text.includes("insurance") || text.includes("bima")) return "insurance";
  return "finance";
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const centralOnly = args.includes("--central-only");
  const fromHuggingFace = args.includes("--from-huggingface");
  const stateIdx = args.indexOf("--state");
  const stateFilter = stateIdx >= 0 ? args[stateIdx + 1] : null;

  console.log("=== MyScheme.gov.in Full Ingestion Pipeline ===");
  console.log("4,650+ Total | 620+ Central | 4,020+ State/UT\n");

  const startTime = Date.now();
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  // Load seed data (54 verified schemes -- always preserved)
  const seedPath = OUTPUT_DIR + "/central.json";
  const seedData = existsSync(seedPath) ? JSON.parse(readFileSync(seedPath, "utf8")) : [];
  const seedIds = new Set(seedData.map((s: { id: string }) => s.id));
  console.log("Seed: " + seedData.length + " verified schemes (preserved)\n");

  let rawSchemes: RawScheme[] = [];

  if (fromHuggingFace) {
    console.log("Using HuggingFace dataset: " + HUGGINGFACE_URL + "\n");
    const res = await fetch(HUGGINGFACE_URL);
    if (!res.ok) { console.error("Download failed: " + res.status); return; }
    const hfData: unknown[] = await res.json();
    console.log("Downloaded: " + hfData.length + " records\n");
    rawSchemes = hfData.filter((item: any) => item.scheme_name).map((item: any) => ({
      url: item.url || MYSCHEME_BASE + "/schemes/" + slugify(item.scheme_name || ""),
      slug: item.slug || slugify(item.scheme_name || ""),
      name: item.scheme_name || "",
      description: item.description || "",
      eligibility: item.eligibility || "",
      benefits: item.benefits || "",
      applicationProcess: item.application_process || "",
      ministry: item.ministry || "",
      state: null,
      tags: [],
    }));
  } else {
    const urls = await fetchSitemap();
    let filtered = urls;
    if (centralOnly) filtered = urls.filter((u) => !u.includes("/state/"));
    if (stateFilter) filtered = urls.filter((u) => u.toLowerCase().includes(stateFilter.toLowerCase()));
    console.log("Fetching " + filtered.length + " scheme pages (" + RATE_LIMIT_MS + "ms rate limit)...\n");

    for (let i = 0; i < filtered.length; i++) {
      const url = filtered[i];
      const slug = url.split("/schemes/")[1] || "";
      if (seedIds.has(slug)) continue;

      const raw = await fetchScheme(url);
      if (raw) rawSchemes.push(raw);
      else console.log("  Failed: " + slug);

      if (i % 50 === 0 && i > 0) console.log("  Progress: " + i + "/" + filtered.length);
      await sleep(RATE_LIMIT_MS);
    }
  }

  // Transform
  const transformed = rawSchemes
    .filter((r) => r.name)
    .filter((r) => !seedIds.has(r.slug))
    .map(transformScheme);

  // Output
  const output = {
    metadata: {
      source: "myscheme.gov.in",
      total: seedData.length + transformed.length,
      verifiedSeed: seedData.length,
      imported: transformed.length,
      ingestedAt: new Date().toISOString(),
      duration: Math.round((Date.now() - startTime) / 1000) + "s",
    },
    seed: seedData,
    imported: transformed,
  };

  const outPath = OUTPUT_DIR + "/full-dataset.json";
  writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log("\n=== Complete ===");
  console.log("Total: " + output.metadata.total);
  console.log("Verified seed: " + output.metadata.verifiedSeed);
  console.log("Imported: " + output.metadata.imported);
  console.log("Output: " + outPath);
  console.log("Duration: " + output.metadata.duration);
  console.log("\nNext: bun scripts/seed-d1.ts | bun scripts/build-bloom-filters.ts");
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

main().catch((err) => { console.error("Error:", err); });
