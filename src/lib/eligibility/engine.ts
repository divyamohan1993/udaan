import type { Scheme, UserProfile, ProfileVector, CrisisType } from "../../shared/types";
import { profileToVector } from "../../shared/types";
import { CRISIS_TO_SCHEME_CATEGORIES } from "../../shared/constants";
import schemes from "../../data/schemes/central.json";

const schemeList = schemes as Scheme[];

// Pre-computed hash map: profileVector -> scheme IDs
const eligibilityIndex = new Map<string, string[]>();

function expandVectors(scheme: Scheme): string[] {
  const states = scheme.eligibility.states === "all"
    ? ["UP", "Bihar", "MP", "Rajasthan", "Maharashtra", "TamilNadu", "Delhi", "Karnataka", "WestBengal", "Gujarat"]
    : scheme.eligibility.states;
  const ages = scheme.eligibility.ageBrackets === "all"
    ? ["18-25", "26-35", "36-45", "46-60", "60+"]
    : scheme.eligibility.ageBrackets;
  const incomes = scheme.eligibility.incomeBrackets === "all"
    ? ["BPL", "LIG", "MIG", "HIG"]
    : scheme.eligibility.incomeBrackets;
  const categories = scheme.eligibility.categories === "all"
    ? ["General", "OBC", "SC", "ST", "EWS"]
    : scheme.eligibility.categories;
  const genders = scheme.eligibility.genders === "all"
    ? ["male", "female", "other"]
    : scheme.eligibility.genders;
  const occupations = scheme.eligibility.occupationTypes === "all"
    ? ["farmer", "laborer", "skilled", "service", "business", "student", "unemployed", "homemaker"]
    : scheme.eligibility.occupationTypes;

  const vectors: string[] = [];
  for (const state of states) {
    for (const age of ages) {
      for (const income of incomes) {
        for (const cat of categories) {
          for (const gender of genders) {
            for (const occ of occupations) {
              vectors.push(`${state}:${age}:${income}:${cat}:${gender}:${occ}`);
            }
          }
        }
      }
    }
  }
  return vectors;
}

// Build index at module load time
for (const scheme of schemeList) {
  const vectors = expandVectors(scheme);
  for (const vec of vectors) {
    const existing = eligibilityIndex.get(vec);
    if (existing) {
      existing.push(scheme.id);
    } else {
      eligibilityIndex.set(vec, [scheme.id]);
    }
  }
}

const schemeById = new Map<string, Scheme>(schemeList.map((s) => [s.id, s]));

/**
 * O(1) scheme lookup via pre-computed hash map.
 * Optionally ranks results by crisis type using CRISIS_TO_SCHEME_CATEGORIES.
 */
export function findSchemes(profile: UserProfile): Scheme[] {
  const vector: ProfileVector = profileToVector(profile);
  const ids = eligibilityIndex.get(vector) ?? [];
  const matched = ids.map((id) => schemeById.get(id)).filter(Boolean) as Scheme[];

  // Rank by crisis relevance using shared constants
  if (profile.crisisType) {
    const priorityCategories = CRISIS_TO_SCHEME_CATEGORIES[profile.crisisType] ?? [];
    const prioritySet = new Set(priorityCategories);
    const categoryOrder = new Map(priorityCategories.map((c, i) => [c, i]));

    // Partition into priority and non-priority
    const priority: Scheme[] = [];
    const rest: Scheme[] = [];
    for (const scheme of matched) {
      if (prioritySet.has(scheme.category)) {
        priority.push(scheme);
      } else {
        rest.push(scheme);
      }
    }

    // Sort priority by category order
    priority.sort((a, b) => (categoryOrder.get(a.category) ?? 99) - (categoryOrder.get(b.category) ?? 99));

    return [...priority, ...rest];
  }

  return matched;
}

/**
 * Get the index size (for testing/diagnostics).
 */
export function getIndexSize(): number {
  return eligibilityIndex.size;
}

export function getAllSchemes(): Scheme[] {
  return schemeList;
}
