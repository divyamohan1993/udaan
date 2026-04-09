import type { Scheme, EmergencyContact } from "../../shared/types";

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface SchemeRow {
  id: string;
  name: string;
  name_hi: string;
  ministry: string;
  description: string;
  description_hi: string;
  benefits: string;
  benefits_hi: string;
  eligibility_json: string;
  apply_url: string;
  apply_steps_json: string;
  apply_steps_hi_json: string;
  category: string;
  scope: string;
}

interface ContactRow {
  id: string;
  name: string;
  name_hi: string;
  number: string;
  type: string;
  state: string;
  available: string;
}

function rowToScheme(row: SchemeRow): Scheme {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi,
    ministry: row.ministry,
    description: row.description,
    descriptionHi: row.description_hi,
    benefits: row.benefits,
    benefitsHi: row.benefits_hi,
    eligibility: JSON.parse(row.eligibility_json),
    applyUrl: row.apply_url,
    applySteps: JSON.parse(row.apply_steps_json),
    applyStepsHi: JSON.parse(row.apply_steps_hi_json),
    category: row.category as Scheme["category"],
    scope: row.scope as Scheme["scope"],
  };
}

function rowToContact(row: ContactRow): EmergencyContact {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.name_hi,
    number: row.number,
    type: row.type as EmergencyContact["type"],
    state: row.state as EmergencyContact["state"],
    available: row.available,
  };
}

/** Get all schemes, optionally filtered by state. Uses parameterized queries only. */
export async function getSchemes(db: D1Database, state?: string): Promise<Scheme[]> {
  let stmt: D1PreparedStatement;

  if (state) {
    stmt = db
      .prepare("SELECT * FROM schemes WHERE scope = ? OR scope = 'central' ORDER BY name")
      .bind(state);
  } else {
    stmt = db.prepare("SELECT * FROM schemes ORDER BY name");
  }

  const result = await stmt.all<SchemeRow>();
  return result.results.map(rowToScheme);
}

/** Get a single scheme by ID. Uses parameterized query. */
export async function getSchemeById(db: D1Database, id: string): Promise<Scheme | null> {
  const row = await db
    .prepare("SELECT * FROM schemes WHERE id = ?")
    .bind(id)
    .first<SchemeRow>();

  return row ? rowToScheme(row) : null;
}

/** Get emergency contacts, optionally filtered by state. Uses parameterized queries only. */
export async function getEmergencyContacts(
  db: D1Database,
  state?: string
): Promise<EmergencyContact[]> {
  let stmt: D1PreparedStatement;

  if (state) {
    stmt = db
      .prepare("SELECT * FROM emergency_contacts WHERE state = ? OR state = 'all' ORDER BY type, name")
      .bind(state);
  } else {
    stmt = db.prepare("SELECT * FROM emergency_contacts ORDER BY type, name");
  }

  const result = await stmt.all<ContactRow>();
  return result.results.map(rowToContact);
}
