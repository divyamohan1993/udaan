import { Elysia, t } from "elysia";
import { getSchemes, getSchemeById } from "../lib/d1";
import type { D1Database } from "../lib/d1";
import schemesData from "../../data/schemes/central.json";
import type { Scheme, State } from "../../shared/types";

const VALID_STATES = new Set<string>([
  "UP", "Bihar", "MP", "Rajasthan", "Maharashtra",
  "TamilNadu", "Delhi", "Karnataka", "WestBengal", "Gujarat"
]);

export const schemesRoutes = new Elysia({ prefix: "/api/schemes" })
  .get("/", async ({ query, env }) => {
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

    const db = (env as Record<string, unknown>)?.DB as D1Database | undefined;

    if (db) {
      const schemes = await getSchemes(db, state);
      return { data: schemes, count: schemes.length };
    }

    let schemes: Scheme[] = schemesData as unknown as Scheme[];
    if (state) {
      schemes = schemes.filter(
        (s) =>
          s.scope === "central" ||
          s.scope === state
      );
    }

    return { data: schemes, count: schemes.length };
  }, {
    query: t.Object({
      state: t.Optional(t.String()),
    }),
  })
  .get("/:id", async ({ params, env }) => {
    const db = (env as Record<string, unknown>)?.DB as D1Database | undefined;

    if (db) {
      const scheme = await getSchemeById(db, params.id);
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
    }

    const scheme = (schemesData as unknown as Scheme[]).find(
      (s) => s.id === params.id
    );
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
