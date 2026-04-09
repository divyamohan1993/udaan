/**
 * Journey State -- The thread connecting all 3 layers.
 *
 * A user's journey through Udaan is one continuous arc:
 * Crisis (Sahara) -> Purpose (Khoj) -> Community (Sangam)
 *
 * This module persists journey state across pages so each layer
 * knows what happened in the previous ones. Defense in depth:
 * each page works standalone, but WITH journey context it's richer.
 */

import type { UserProfile, CrisisType, PurposeVector, Locale } from "../../shared/types";

export interface JourneyState {
  // Layer 1: Crisis
  profile?: UserProfile;
  crisisType?: CrisisType;
  matchedSchemeCount?: number;
  completedTriage?: boolean;

  // Layer 2: Purpose
  purposeVector?: PurposeVector;
  topPurposeAxis?: string;
  completedCompass?: boolean;

  // Layer 3: Community
  circleId?: string;
  circleMission?: string;

  // Cross-cutting
  locale: Locale;
  lastActivity: number;
}

const STORAGE_KEY = "udaan-journey";

const DEFAULT_STATE: JourneyState = {
  locale: "hi",
  lastActivity: Date.now(),
};

/**
 * Load journey state. O(1) -- single localStorage read + JSON parse.
 * Returns default state if nothing saved (defense in depth: always works).
 */
export function loadJourney(): JourneyState {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/**
 * Save journey state. O(1) -- single localStorage write.
 * Silently fails if storage unavailable (defense in depth).
 */
export function saveJourney(state: Partial<JourneyState>): void {
  try {
    const current = loadJourney();
    const updated = { ...current, ...state, lastActivity: Date.now() };
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage unavailable. Journey continues without persistence.
  }
}

/**
 * Bridge suggestions: what should we suggest next based on journey so far?
 * This powers the "interleaved, not siloed" UX.
 */
export function getNextSuggestion(journey: JourneyState): {
  route: string;
  titleHi: string;
  titleEn: string;
  reason: string;
} | null {
  // Completed triage but not compass? Bridge to purpose.
  if (journey.completedTriage && !journey.completedCompass) {
    return {
      route: "/khoj/compass",
      titleHi: "अब मकसद खोजें?",
      titleEn: "Find your purpose?",
      reason: "You've found schemes. Now discover what lights you up.",
    };
  }

  // Completed compass but no circle? Bridge to community.
  if (journey.completedCompass && !journey.circleId) {
    return {
      route: "/sangam/circles",
      titleHi: "आपके जैसे लोग पास में हैं",
      titleEn: "People like you are nearby",
      reason: "Your purpose compass points somewhere. Others share that direction.",
    };
  }

  // Has circle but hasn't checked schemes recently? Bridge back to sahara.
  if (journey.circleId && !journey.completedTriage) {
    return {
      route: "/sahara/triage",
      titleHi: "सरकारी मदद उपलब्ध है",
      titleEn: "Government help is available",
      reason: "Your circle might benefit from government schemes too.",
    };
  }

  return null;
}

/**
 * Context-aware scheme suggestions based on circle activity.
 * "Your circle grows food? Here's PM-KISAN."
 */
export function getCircleSchemeHints(journey: JourneyState): string[] {
  const hints: string[] = [];

  if (journey.circleMission) {
    const missionToSchemes: Record<string, string[]> = {
      "community-garden": ["pm-kisan", "mgnrega"],
      "teach-kids": ["skill-india", "pm-vidya-lakshmi"],
      "repair-hub": ["mudra-loan", "skill-india"],
      "community-kitchen": ["pm-garib-kalyan-anna", "antyodaya-anna"],
      "elder-care": ["nsap-old-age", "ayushman-bharat"],
      "digital-literacy": ["skill-india", "pmgdisha"],
      "clean-water": ["mgnrega", "swachh-bharat"],
    };
    hints.push(...(missionToSchemes[journey.circleMission] ?? []));
  }

  return hints;
}
