// === Profile ===

export type State = "UP" | "Bihar" | "MP" | "Rajasthan" | "Maharashtra" | "TamilNadu" | "Delhi" | "Karnataka" | "WestBengal" | "Gujarat";
export type AgeBracket = "18-25" | "26-35" | "36-45" | "46-60" | "60+";
export type IncomeBracket = "BPL" | "LIG" | "MIG" | "HIG";
export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type Gender = "male" | "female" | "other";
export type OccupationType = "farmer" | "laborer" | "skilled" | "service" | "business" | "student" | "unemployed" | "homemaker";

export interface UserProfile {
  id: string;
  state: State;
  ageBracket: AgeBracket;
  incomeBracket: IncomeBracket;
  category: Category;
  gender: Gender;
  occupationType: OccupationType;
  language: "hi" | "en";
  crisisType?: CrisisType;
  createdAt: number;
  updatedAt: number;
}

// === Crisis ===

export type CrisisType = "job-loss" | "no-food" | "no-money" | "health" | "lost" | "purpose";

export interface CrisisAssessment {
  crisisType: CrisisType;
  urgency: "immediate" | "urgent" | "stable";
  profile: UserProfile;
  timestamp: number;
}

// === Schemes ===

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  ministry: string;
  description: string;
  descriptionHi: string;
  benefits: string;
  benefitsHi: string;
  eligibility: SchemeEligibility;
  applyUrl: string;
  applySteps: string[];
  applyStepsHi: string[];
  category: "employment" | "food" | "housing" | "health" | "education" | "finance" | "skill" | "pension" | "insurance";
  scope: "central" | State;
}

export interface SchemeEligibility {
  states: State[] | "all";
  ageBrackets: AgeBracket[] | "all";
  incomeBrackets: IncomeBracket[] | "all";
  categories: Category[] | "all";
  genders: Gender[] | "all";
  occupationTypes: OccupationType[] | "all";
}

// === Eligibility Engine ===

export type ProfileVector = `${State}:${AgeBracket}:${IncomeBracket}:${Category}:${Gender}:${OccupationType}`;

export function profileToVector(profile: UserProfile): ProfileVector {
  return `${profile.state}:${profile.ageBracket}:${profile.incomeBracket}:${profile.category}:${profile.gender}:${profile.occupationType}`;
}

// === Emergency ===

export interface EmergencyContact {
  id: string;
  name: string;
  nameHi: string;
  number: string;
  type: "police" | "ambulance" | "mental-health" | "women" | "child" | "legal" | "food";
  state: State | "all";
  available: string;
}

// === Purpose / Missions ===

export type PurposeAxis = "people" | "nature" | "knowledge" | "craft" | "service" | "expression";

export interface PurposeVector {
  people: number;
  nature: number;
  knowledge: number;
  craft: number;
  service: number;
  expression: number;
}

export interface Mission {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  category: PurposeAxis;
  requirements: string[];
  impactMetric: string;
  impactMetricHi: string;
  difficulty: "easy" | "medium" | "hard";
}

// === Circles ===

export interface Circle {
  id: string;
  name: string;
  mission: Mission;
  members: string[];
  location: string;
  createdAt: number;
  activityLog: CircleActivity[];
}

export interface CircleActivity {
  id: string;
  circleId: string;
  description: string;
  descriptionHi: string;
  timestamp: number;
  memberId: string;
}

// === i18n ===

export type Locale = "hi" | "en";

export interface I18nStrings {
  [key: string]: string;
}
