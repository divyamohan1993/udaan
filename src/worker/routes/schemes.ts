import { Elysia, t } from "elysia";
import schemesData from "../../data/schemes/central.json";
import contactsData from "../../data/emergency/contacts.json";
import type { Scheme, EmergencyContact } from "../../shared/types";

const VALID_STATES = new Set<string>([
  "UP", "Bihar", "MP", "Rajasthan", "Maharashtra",
  "TamilNadu", "Delhi", "Karnataka", "WestBengal", "Gujarat"
]);

const schemes: Scheme[] = schemesData as unknown as Scheme[];
const contacts: EmergencyContact[] = contactsData as unknown as EmergencyContact[];

// Critical contacts always present -- defense in depth
const CRITICAL_CONTACTS = [
  { name: "Emergency", nameHi: "आपातकालीन", number: "112" },
  { name: "KIRAN Mental Health", nameHi: "किरण मानसिक स्वास्थ्य", number: "1800-599-0019" },
];

export const schemesRoutes = new Elysia({ prefix: "/api/schemes" })
  .get("/", async ({ query }) => {
    const state = query.state as string | undefined;

    if (state && !VALID_STATES.has(state)) {
      return {
        error: {
          code: "INVALID_STATE",
          message: `Invalid state: ${state}. Valid states: ${[...VALID_STATES].join(", ")}`,
          details: null,
        },
        emergency: CRITICAL_CONTACTS,
      };
    }

    let filtered = schemes;
    if (state) {
      filtered = schemes.filter(
        (s) => s.scope === "central" || s.scope === state
      );
    }

    // Emergency contacts for this state
    const stateContacts = state
      ? contacts.filter((c) => c.state === "all" || c.state === state)
      : contacts.filter((c) => c.state === "all");

    return {
      data: filtered,
      count: filtered.length,
      emergency: stateContacts.slice(0, 5),
      // Journey bridge: after schemes, suggest purpose discovery
      nextStep: {
        path: "/khoj/compass",
        label: { hi: "अब मकसद खोजें?", en: "Find purpose now?" },
        description: {
          hi: "आपकी मदद शुरू हो गई। अब जानें कि आपका असली मकसद क्या है।",
          en: "Your support has begun. Now discover what truly drives you.",
        },
      },
      care: {
        hi: "आप अकेले नहीं हैं। हम आपके साथ हैं।",
        en: "You are not alone. We are with you.",
      },
    };
  }, {
    query: t.Object({
      state: t.Optional(t.String()),
    }),
  })
  .get("/:id", async ({ params }) => {
    const scheme = schemes.find((s) => s.id === params.id);
    if (!scheme) {
      return {
        error: {
          code: "NOT_FOUND",
          message: {
            hi: "यह योजना नहीं मिली। कोई बात नहीं, और भी योजनाएं हैं।",
            en: "This scheme was not found. No worries, there are more schemes available.",
          },
          details: null,
        },
        emergency: CRITICAL_CONTACTS,
        // Even errors guide forward
        suggestion: {
          path: "/api/schemes",
          label: { hi: "सभी योजनाएं देखें", en: "View all schemes" },
        },
      };
    }

    // Find related schemes by category
    const related = schemes
      .filter((s) => s.id !== scheme.id && s.category === scheme.category)
      .slice(0, 3);

    return {
      data: scheme,
      related,
      emergency: CRITICAL_CONTACTS,
      nextStep: {
        path: "/khoj/compass",
        label: { hi: "अब मकसद खोजें?", en: "Find purpose now?" },
      },
    };
  }, {
    params: t.Object({
      id: t.String(),
    }),
  });
