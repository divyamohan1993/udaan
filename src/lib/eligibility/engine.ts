import type { Scheme, UserProfile, ProfileVector } from "../../shared/types";
import { profileToVector } from "../../shared/types";
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

// Crisis type to scheme category mapping for ranking
const crisisToCategories: Record<string, string[]> = {
  "job-loss": ["employment", "skill", "finance"],
  "no-food": ["food", "finance", "employment"],
  "no-money": ["finance", "employment", "pension"],
  "health": ["health", "insurance"],
  "lost": ["health", "education", "skill"],
  "purpose": ["education", "skill", "employment"],
};

export function findSchemes(profile: UserProfile): Scheme[] {
  const vector: ProfileVector = profileToVector(profile);
  const ids = eligibilityIndex.get(vector) ?? [];
  const matched = ids.map((id) => schemeById.get(id)).filter(Boolean) as Scheme[];

  // Rank by crisis relevance
  if (profile.crisisType) {
    const priorityCategories = crisisToCategories[profile.crisisType] ?? [];
    matched.sort((a, b) => {
      const aIdx = priorityCategories.indexOf(a.category);
      const bIdx = priorityCategories.indexOf(b.category);
      const aRank = aIdx === -1 ? 999 : aIdx;
      const bRank = bIdx === -1 ? 999 : bIdx;
      return aRank - bRank;
    });
  }

  return matched.slice(0, 10);
}

export function getAllSchemes(): Scheme[] {
  return schemeList;
}
