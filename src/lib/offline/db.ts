import {
  createRxDatabase,
  removeRxDatabase,
  type RxDatabase,
  type RxCollection,
} from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import type { UserProfile, Scheme } from "../../shared/types";

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

export type ProfileCollection = RxCollection<UserProfile>;
export type SchemeCollection = RxCollection<Scheme>;

export type UdaanCollections = {
  profiles: ProfileCollection;
  schemes: SchemeCollection;
};

export type UdaanDB = RxDatabase<UdaanCollections>;

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
  });

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

export async function destroy(): Promise<void> {
  if (dbInstance) {
    await dbInstance.remove();
    dbInstance = null;
  }
}
