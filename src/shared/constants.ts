import type { CrisisType, Scheme } from "./types";

export const CRISIS_TO_SCHEME_CATEGORIES: Record<CrisisType, Scheme["category"][]> = {
  "job-loss": ["employment", "skill", "finance", "insurance"],
  "no-food": ["food", "employment", "finance"],
  "no-money": ["finance", "employment", "pension", "insurance"],
  "health": ["health", "insurance"],
  "lost": ["employment", "skill", "education"],
  "purpose": ["skill", "education"],
};

export const BLOOM_FILTER_SIZE = 1024;
export const BLOOM_HASH_COUNT = 7;
export const BLOOM_FALSE_POSITIVE_RATE = 0.01;

export const GEOHASH_PRECISION = 5;

export const MAX_PEER_BUCKET_SIZE = 50;
export const CIRCLE_MIN_SIZE = 3;
export const CIRCLE_MAX_SIZE = 8;

export const STATES_LIST = ["UP", "Bihar", "MP", "Rajasthan", "Maharashtra", "TamilNadu", "Delhi", "Karnataka", "WestBengal", "Gujarat"] as const;
export const AGE_BRACKETS = ["18-25", "26-35", "36-45", "46-60", "60+"] as const;
export const INCOME_BRACKETS = ["BPL", "LIG", "MIG", "HIG"] as const;
export const CATEGORIES_LIST = ["General", "OBC", "SC", "ST", "EWS"] as const;
export const GENDERS_LIST = ["male", "female", "other"] as const;
export const OCCUPATIONS_LIST = ["farmer", "laborer", "skilled", "service", "business", "student", "unemployed", "homemaker"] as const;
