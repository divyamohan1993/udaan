import { Elysia, t } from "elysia";
import contactsData from "../../data/emergency/contacts.json";
import type { EmergencyContact } from "../../shared/types";

const contacts: EmergencyContact[] = contactsData as unknown as EmergencyContact[];

export const emergencyRoutes = new Elysia({ prefix: "/api/emergency" })
  .get("/", async ({ query }) => {
    const state = query.state as string | undefined;
    const type = query.type as string | undefined;

    let filtered = contacts;

    if (state) {
      filtered = filtered.filter(
        (c) => c.state === "all" || c.state === state
      );
    }

    if (type) {
      filtered = filtered.filter((c) => c.type === type);
    }

    return {
      data: filtered,
      count: filtered.length,
      message: {
        hi: "आप अकेले नहीं हैं। मदद उपलब्ध है।",
        en: "You are not alone. Help is available.",
      },
    };
  }, {
    query: t.Object({
      state: t.Optional(t.String()),
      type: t.Optional(t.String()),
    }),
  })
  .get("/critical", () => {
    // Always returns the 3 most critical numbers -- hardcoded, no DB dependency
    return {
      data: [
        { name: "Emergency", nameHi: "आपातकालीन", number: "112", type: "police" },
        { name: "Ambulance", nameHi: "एम्बुलेंस", number: "108", type: "ambulance" },
        { name: "KIRAN Mental Health", nameHi: "किरण मानसिक स्वास्थ्य", number: "1800-599-0019", type: "mental-health" },
        { name: "Women Helpline", nameHi: "महिला हेल्पलाइन", number: "181", type: "women" },
      ],
      message: {
        hi: "ये नंबर 24/7 उपलब्ध हैं, बिल्कुल मुफ्त।",
        en: "These numbers are available 24/7, completely free.",
      },
    };
  });
