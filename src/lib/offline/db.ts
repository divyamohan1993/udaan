import {
  createRxDatabase,
  removeRxDatabase,
  type RxDatabase,
  type RxCollection,
} from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import type { UserProfile, Scheme, EmergencyContact } from "../../shared/types";

const profileSchema = {
  version: 0,
  primaryKey: "id",
  type: "object" as const,
  properties: {
    id: { type: "string", maxLength: 100 },
    state: { type: "string" },
    ageBracket: { type: "string" },
    incomeBracket: { type: "string" },
    category: { type: "string" },
    gender: { type: "string" },
    occupationType: { type: "string" },
    language: { type: "string" },
    crisisType: { type: "string" },
    createdAt: { type: "number" },
    updatedAt: { type: "number" },
  },
  required: ["id", "state", "ageBracket", "incomeBracket", "category", "gender", "occupationType", "language", "createdAt", "updatedAt"],
};

const schemeSchema = {
  version: 0,
  primaryKey: "id",
  type: "object" as const,
  properties: {
    id: { type: "string", maxLength: 200 },
    name: { type: "string" },
    nameHi: { type: "string" },
    ministry: { type: "string" },
    description: { type: "string" },
    descriptionHi: { type: "string" },
    benefits: { type: "string" },
    benefitsHi: { type: "string" },
    eligibility: { type: "object" },
    applyUrl: { type: "string" },
    applySteps: { type: "array", items: { type: "string" } },
    applyStepsHi: { type: "array", items: { type: "string" } },
    category: { type: "string" },
    scope: { type: "string" },
  },
  required: ["id", "name", "nameHi", "ministry", "description", "descriptionHi", "benefits", "benefitsHi", "applyUrl", "category", "scope"],
};

const emergencyContactSchema = {
  version: 0,
  primaryKey: "id",
  type: "object" as const,
  properties: {
    id: { type: "string", maxLength: 100 },
    name: { type: "string" },
    nameHi: { type: "string" },
    number: { type: "string" },
    type: { type: "string" },
    state: { type: "string" },
    available: { type: "string" },
  },
  required: ["id", "name", "nameHi", "number", "type", "state", "available"],
};

export type ProfileCollection = RxCollection<UserProfile>;
export type SchemeCollection = RxCollection<Scheme>;
export type EmergencyCollection = RxCollection<EmergencyContact>;

export type UdaanCollections = {
  profiles: ProfileCollection;
  schemes: SchemeCollection;
  emergencyContacts: EmergencyCollection;
};

export type UdaanDB = RxDatabase<UdaanCollections>;

// Hardcoded critical contacts -- defense in depth, always available even if DB init fails
const CRITICAL_CONTACTS: EmergencyContact[] = [
  { id: "hw-112", name: "Emergency", nameHi: "आपातकालीन", number: "112", type: "police", state: "all", available: "24/7" },
  { id: "hw-108", name: "Ambulance", nameHi: "एम्बुलेंस", number: "108", type: "ambulance", state: "all", available: "24/7" },
  { id: "hw-kiran", name: "KIRAN Mental Health", nameHi: "किरण मानसिक स्वास्थ्य", number: "1800-599-0019", type: "mental-health", state: "all", available: "24/7, toll-free" },
  { id: "hw-181", name: "Women Helpline", nameHi: "महिला हेल्पलाइन", number: "181", type: "women", state: "all", available: "24/7" },
  { id: "hw-1098", name: "Childline", nameHi: "चाइल्डलाइन", number: "1098", type: "child", state: "all", available: "24/7" },
];

let dbInstance: UdaanDB | null = null;

export async function getDatabase(useMemory = false): Promise<UdaanDB> {
  if (dbInstance) return dbInstance;

  let storage;
  if (useMemory || typeof window === "undefined") {
    storage = getRxStorageMemory();
  } else {
    const { getRxStorageDexie } = await import("rxdb/plugins/storage-dexie");
    storage = getRxStorageDexie();
  }

  const db = await createRxDatabase<UdaanCollections>({
    name: "udaan",
    storage,
    multiInstance: false,
  });

  await db.addCollections({
    profiles: { schema: profileSchema },
    schemes: { schema: schemeSchema },
    emergencyContacts: { schema: emergencyContactSchema },
  });

  // Pre-seed critical emergency contacts on first creation
  // These must always be available -- defense in depth
  const existing = await db.emergencyContacts.find().exec();
  if (existing.length === 0) {
    await db.emergencyContacts.bulkInsert(CRITICAL_CONTACTS);
  }

  dbInstance = db;
  return dbInstance;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const db = await getDatabase();
  await db.profiles.upsert(profile);
}

export async function getProfile(id: string): Promise<UserProfile | null> {
  const db = await getDatabase();
  const doc = await db.profiles.findOne(id).exec();
  return doc ? doc.toJSON() as unknown as UserProfile : null;
}

export async function cacheSchemes(schemes: Scheme[]): Promise<void> {
  const db = await getDatabase();
  await db.schemes.bulkUpsert(schemes);
}

export async function getCachedSchemes(): Promise<Scheme[]> {
  const db = await getDatabase();
  const docs = await db.schemes.find().exec();
  return docs.map((d) => d.toJSON() as unknown as Scheme);
}

/** Emergency contacts always return data. Falls back to hardcoded if DB fails. */
export async function getEmergencyContacts(state?: string): Promise<EmergencyContact[]> {
  try {
    const db = await getDatabase();
    const docs = await db.emergencyContacts.find().exec();
    let contacts = docs.map((d) => d.toJSON() as unknown as EmergencyContact);
    if (state) {
      contacts = contacts.filter((c) => c.state === "all" || c.state === state);
    }
    return contacts.length > 0 ? contacts : CRITICAL_CONTACTS;
  } catch {
    // DB failed? Still return hardcoded contacts. Nobody gets left without help.
    return CRITICAL_CONTACTS;
  }
}

export async function cacheEmergencyContacts(contacts: EmergencyContact[]): Promise<void> {
  const db = await getDatabase();
  await db.emergencyContacts.bulkUpsert(contacts);
}

export async function destroy(): Promise<void> {
  if (dbInstance) {
    await dbInstance.remove();
    dbInstance = null;
  }
}
