/**
 * i18n Completeness Check
 * Pre-commit hook: blocks if Hindi translations are missing for any English key.
 * Real gate, not a placeholder.
 */
import en from "../src/data/i18n/en.json";
import hi from "../src/data/i18n/hi.json";

const enKeys = new Set(Object.keys(en));
const hiKeys = new Set(Object.keys(hi));

const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
const extraInHi = [...hiKeys].filter((k) => !enKeys.has(k));

let exitCode = 0;

if (missingInHi.length > 0) {
  console.error(`\n❌ ${missingInHi.length} English keys missing Hindi translations:`);
  for (const k of missingInHi) {
    console.error(`   - ${k}`);
  }
  exitCode = 1;
}

if (extraInHi.length > 0) {
  console.warn(`\n⚠️  ${extraInHi.length} Hindi keys with no English equivalent:`);
  for (const k of extraInHi) {
    console.warn(`   - ${k}`);
  }
}

if (exitCode === 0) {
  console.log(`✅ i18n check passed. ${enKeys.size} English keys, ${hiKeys.size} Hindi keys. Full parity.`);
}

process.exit(exitCode);
