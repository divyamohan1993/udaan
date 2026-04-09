import { Elysia, t } from "elysia";
import schemesData from "../../data/schemes/central.json";
import type { Scheme } from "../../shared/types";

const VALID_STATES = new Set<string>([
  "UP", "Bihar", "MP", "Rajasthan", "Maharashtra",
  "TamilNadu", "Delhi", "Karnataka", "WestBengal", "Gujarat"
]);

const schemes: Scheme[] = schemesData as unknown as Scheme[];

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
      };
    }

    let filtered = schemes;
    if (state) {
      filtered = schemes.filter(
        (s) => s.scope === "central" || s.scope === state
      );
    }

    return { data: filtered, count: filtered.length };
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
          message: `Scheme not found: ${params.id}`,
          details: null,
        },
      };
    }
    return { data: scheme };
  }, {
    params: t.Object({
      id: t.String(),
    }),
  });
