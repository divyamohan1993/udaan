/**
 * Build bloom filters for O(1) scheme eligibility lookup.
 * Reads all schemes, expands eligibility to all possible ProfileVectors,
 * builds a bloom filter per scheme, serializes to JSON.
 *
 * Usage: bun run scripts/build-bloom-filters.ts
 * Output: src/data/bloom-filter.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { BloomFilter } from "bloom-filters";

import type {
  Scheme,
  SchemeEligibility,
  State,
  AgeBracket,
  IncomeBracket,
  Category,
  Gender,
  OccupationType,
  ProfileVector,
} from "../src/shared/types";

const ALL_STATES: State[] = ["UP", "Bihar", "MP", "Rajasthan", "Maharashtra", "TamilNadu", "Delhi", "Karnataka", "WestBengal", "Gujarat"];
const ALL_AGE_BRACKETS: AgeBracket[] = ["18-25", "26-35", "36-45", "46-60", "60+"];
const ALL_INCOME_BRACKETS: IncomeBracket[] = ["BPL", "LIG", "MIG", "HIG"];
const ALL_CATEGORIES: Category[] = ["General", "OBC", "SC", "ST", "EWS"];
const ALL_GENDERS: Gender[] = ["male", "female", "other"];
const ALL_OCCUPATION_TYPES: OccupationType[] = ["farmer", "laborer", "skilled", "service", "business", "student", "unemployed", "homemaker"];

function resolveField<T>(field: T[] | "all", allValues: T[]): T[] {
  return field === "all" ? allValues : field;
}

function expandEligibility(eligibility: SchemeEligibility): ProfileVector[] {
  const states = resolveField(eligibility.states, ALL_STATES);
  const ages = resolveField(eligibility.ageBrackets, ALL_AGE_BRACKETS);
  const incomes = resolveField(eligibility.incomeBrackets, ALL_INCOME_BRACKETS);
  const categories = resolveField(eligibility.categories, ALL_CATEGORIES);
  const genders = resolveField(eligibility.genders, ALL_GENDERS);
  const occupations = resolveField(eligibility.occupationTypes, ALL_OCCUPATION_TYPES);

  const vectors: ProfileVector[] = [];

  for (const state of states) {
    for (const age of ages) {
      for (const income of incomes) {
        for (const cat of categories) {
          for (const gender of genders) {
            for (const occ of occupations) {
              vectors.push(`${state}:${age}:${income}:${cat}:${gender}:${occ}` as ProfileVector);
            }
          }
        }
      }
    }
  }

  return vectors;
}

const schemesPath = resolve(import.meta.dirname || ".", "../src/data/schemes/central.json");
const schemes: Scheme[] = JSON.parse(readFileSync(schemesPath, "utf-8"));

// Build a single bloom filter containing "schemeId:profileVector" entries
// This allows O(1) check: "is this profile eligible for this scheme?"
const totalVectors = new Set<string>();

for (const scheme of schemes) {
  const vectors = expandEligibility(scheme.eligibility);
  for (const v of vectors) {
    totalVectors.add(`${scheme.id}:${v}`);
  }
}

// Size the bloom filter for expected entries with 0.01% false positive rate
const errorRate = 0.0001;
const filter = BloomFilter.create(totalVectors.size, errorRate);

for (const entry of totalVectors) {
  filter.add(entry);
}

// Also build a direct hash map: profileVector -> schemeId[] for exact lookups
const hashMap: Record<string, string[]> = {};

for (const scheme of schemes) {
  const vectors = expandEligibility(scheme.eligibility);
  for (const v of vectors) {
    if (!hashMap[v]) {
      hashMap[v] = [];
    }
    hashMap[v].push(scheme.id);
  }
}

const output = {
  bloomFilter: filter.saveAsJSON(),
  hashMap,
  metadata: {
    schemeCount: schemes.length,
    totalEntries: totalVectors.size,
    errorRate,
    generatedAt: new Date().toISOString(),
  },
};

const outputPath = resolve(import.meta.dirname || ".", "../src/data/bloom-filter.json");
writeFileSync(outputPath, JSON.stringify(output));

console.log(`Bloom filter built: ${totalVectors.size} entries from ${schemes.length} schemes`);
console.log(`Hash map keys: ${Object.keys(hashMap).length} unique profile vectors`);
console.log(`Output: ${outputPath}`);
