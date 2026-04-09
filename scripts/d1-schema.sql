-- Udaan D1 Database Schema
-- Cloudflare D1 (SQLite at edge)

CREATE TABLE IF NOT EXISTS schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  ministry TEXT NOT NULL,
  description TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  benefits TEXT NOT NULL,
  benefits_hi TEXT NOT NULL,
  eligibility_json TEXT NOT NULL,
  apply_url TEXT NOT NULL,
  apply_steps_json TEXT NOT NULL,
  apply_steps_hi_json TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('employment', 'food', 'housing', 'health', 'education', 'finance', 'skill', 'pension', 'insurance')),
  scope TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_schemes_scope ON schemes(scope);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_scope_category ON schemes(scope, category);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  number TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('police', 'ambulance', 'mental-health', 'women', 'child', 'legal', 'food')),
  state TEXT NOT NULL DEFAULT 'all',
  available TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_contacts_state ON emergency_contacts(state);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON emergency_contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_state_type ON emergency_contacts(state, type);
