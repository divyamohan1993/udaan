#!/usr/bin/env bun
/**
 * Import MyScheme Dataset from HuggingFace
 *
 * Downloads the official gov_myscheme dataset (723 schemes) from HuggingFace
 * and merges with our verified seed data in central.json.
 *
 * Source: https://huggingface.co/datasets/shrijayan/gov_myscheme
 * Official origin: https://www.myscheme.gov.in
 *
 * Usage: bun scripts/import-myscheme-dataset.ts
 */

import { writeFileSync, readFileSync, existsSync } from "fs";

const DATASET_URL =
  "https://huggingface.co/datasets/shrijayan/gov_myscheme/resolve/main/data/train.json";
const SEED_PATH = "src/data/schemes/central.json";
const OUTPUT_PATH = "src/data/schemes/full-dataset.json";

interface HFScheme {
  scheme_name: string;
  description: string;
  eligibility: string;
  benefits: string;
  application_process: string;
  url: string;
  ministry?: string;
  [key: string]: unknown;
}

async function main() {
  console.log("=== MyScheme Dataset Import ===\n");

  // Step 1: Load seed data
  console.log("1. Loading seed data...");
  const seedData = JSON.parse(readFileSync(SEED_PATH, "utf8"));
  console.log(`   Seed: ${seedData.length} verified schemes\n`);

  // Step 2: Download HuggingFace dataset
  console.log("2. Downloading HuggingFace dataset...");
  console.log(`   URL: ${DATASET_URL}`);

  try {
    const res = await fetch(DATASET_URL);
    if (!res.ok) {
      console.error(`   Download failed: ${res.status} ${res.statusText}`);
      console.log("   To download manually:");
      console.log(`   curl -L "${DATASET_URL}" > ${OUTPUT_PATH}`);
      console.log("\n   Continuing with seed data only.\n");
      return;
    }

    const rawData: HFScheme[] = await res.json();
    console.log(`   Downloaded: ${rawData.length} schemes\n`);

    // Step 3: Transform to our format
    console.log("3. Transforming to Udaan format...");
    const seedIds = new Set(seedData.map((s: { id: string }) => s.id));

    const imported = rawData
      .filter((s) => s.scheme_name && s.description)
      .map((s) => ({
        id: slugify(s.scheme_name),
        name: s.scheme_name,
        nameHi: s.scheme_name, // Needs Hindi translation
        ministry: s.ministry ?? "Unknown",
        description: s.description,
        descriptionHi: s.description, // Needs Hindi translation
        benefits: s.benefits ?? "",
        benefitsHi: s.benefits ?? "", // Needs Hindi translation
        eligibility: {
          states: "all" as const,
          ageBrackets: "all" as const,
          incomeBrackets: "all" as const,
          categories: "all" as const,
          genders: "all" as const,
          occupationTypes: "all" as const,
        },
        applyUrl: s.url ?? "",
        applySteps: parseSteps(s.application_process),
        applyStepsHi: parseSteps(s.application_process), // Needs Hindi
        category: guessCategory(s.scheme_name, s.description),
        scope: "central" as const,
        source: "myscheme.gov.in",
        verified: false, // Needs manual verification
        needsHindiTranslation: true,
      }))
      .filter((s) => !seedIds.has(s.id)); // Don't overwrite verified seed data

    console.log(`   New schemes (not in seed): ${imported.length}\n`);

    // Step 4: Merge
    console.log("4. Merging...");
    const merged = {
      seed: seedData,
      imported,
      metadata: {
        seedCount: seedData.length,
        importedCount: imported.length,
        totalCount: seedData.length + imported.length,
        source: "huggingface.co/datasets/shrijayan/gov_myscheme",
        importDate: new Date().toISOString(),
        note: "Seed data is verified with accurate Hindi translations and eligibility. Imported data needs verification.",
      },
    };

    writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2));
    console.log(`   Written to: ${OUTPUT_PATH}`);
    console.log(`   Total: ${merged.metadata.totalCount} schemes`);
    console.log(`   Verified: ${merged.metadata.seedCount}`);
    console.log(`   Needs verification: ${merged.metadata.importedCount}\n`);

    console.log("=== Import complete ===");
    console.log("Next steps:");
    console.log("  1. Review imported schemes for accuracy");
    console.log("  2. Add Hindi translations (use Claude with scheme-update skill)");
    console.log("  3. Verify eligibility criteria against official .gov.in sources");
    console.log("  4. Run: bun scripts/seed-d1.ts to update D1 database");

  } catch (err) {
    console.error("Download error:", err);
    console.log("\nTo download manually:");
    console.log(`curl -L "${DATASET_URL}" > raw-myscheme.json`);
    console.log("Then run this script again with --local flag.");
  }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function parseSteps(text: string): string[] {
  if (!text) return ["Visit the official scheme website for application details"];
  return text
    .split(/\d+\.\s*|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5)
    .slice(0, 8);
}

function guessCategory(name: string, desc: string): string {
  const text = `${name} ${desc}`.toLowerCase();
  if (text.includes("health") || text.includes("medical") || text.includes("hospital")) return "health";
  if (text.includes("education") || text.includes("scholarship") || text.includes("school")) return "education";
  if (text.includes("employment") || text.includes("job") || text.includes("rozgar")) return "employment";
  if (text.includes("food") || text.includes("ration") || text.includes("anna")) return "food";
  if (text.includes("housing") || text.includes("awas") || text.includes("house")) return "housing";
  if (text.includes("skill") || text.includes("training") || text.includes("kaushal")) return "skill";
  if (text.includes("pension") || text.includes("old age") || text.includes("retirement")) return "pension";
  if (text.includes("insurance") || text.includes("bima")) return "insurance";
  return "finance";
}

main();
