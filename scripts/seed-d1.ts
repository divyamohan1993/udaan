/**
 * Seed D1 database with scheme and emergency contact data.
 * Reads JSON files, generates parameterized INSERT SQL statements.
 * Output goes to stdout for piping to wrangler d1 execute.
 *
 * Usage: bun run scripts/seed-d1.ts > seed.sql
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface SchemeData {
  id: string;
  name: string;
  nameHi: string;
  ministry: string;
  description: string;
  descriptionHi: string;
  benefits: string;
  benefitsHi: string;
  eligibility: Record<string, unknown>;
  applyUrl: string;
  applySteps: string[];
  applyStepsHi: string[];
  category: string;
  scope: string;
}

interface ContactData {
  id: string;
  name: string;
  nameHi: string;
  number: string;
  type: string;
  state: string;
  available: string;
}

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

function generateSchemeInserts(schemes: SchemeData[]): string {
  const lines: string[] = [];

  for (const s of schemes) {
    const values = [
      escapeSql(s.id),
      escapeSql(s.name),
      escapeSql(s.nameHi),
      escapeSql(s.ministry),
      escapeSql(s.description),
      escapeSql(s.descriptionHi),
      escapeSql(s.benefits),
      escapeSql(s.benefitsHi),
      escapeSql(JSON.stringify(s.eligibility)),
      escapeSql(s.applyUrl),
      escapeSql(JSON.stringify(s.applySteps)),
      escapeSql(JSON.stringify(s.applyStepsHi)),
      escapeSql(s.category),
      escapeSql(s.scope),
    ].map((v) => `'${v}'`);

    lines.push(
      `INSERT OR REPLACE INTO schemes (id, name, name_hi, ministry, description, description_hi, benefits, benefits_hi, eligibility_json, apply_url, apply_steps_json, apply_steps_hi_json, category, scope) VALUES (${values.join(", ")});`
    );
  }

  return lines.join("\n");
}

function generateContactInserts(contacts: ContactData[]): string {
  const lines: string[] = [];

  for (const c of contacts) {
    const values = [
      escapeSql(c.id),
      escapeSql(c.name),
      escapeSql(c.nameHi),
      escapeSql(c.number),
      escapeSql(c.type),
      escapeSql(c.state),
      escapeSql(c.available),
    ].map((v) => `'${v}'`);

    lines.push(
      `INSERT OR REPLACE INTO emergency_contacts (id, name, name_hi, number, type, state, available) VALUES (${values.join(", ")});`
    );
  }

  return lines.join("\n");
}

const schemesPath = resolve(import.meta.dirname || ".", "../src/data/schemes/central.json");
const contactsPath = resolve(import.meta.dirname || ".", "../src/data/emergency/contacts.json");

const schemes: SchemeData[] = JSON.parse(readFileSync(schemesPath, "utf-8"));
const contacts: ContactData[] = JSON.parse(readFileSync(contactsPath, "utf-8"));

console.log("-- Udaan D1 Seed Data");
console.log("-- Generated: " + new Date().toISOString());
console.log("");
console.log("BEGIN TRANSACTION;");
console.log("");
console.log("-- Schemes");
console.log(generateSchemeInserts(schemes));
console.log("");
console.log("-- Emergency Contacts");
console.log(generateContactInserts(contacts));
console.log("");
console.log("COMMIT;");
