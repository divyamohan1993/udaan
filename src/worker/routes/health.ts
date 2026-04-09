import { Elysia } from "elysia";

const VERSION = "0.1.0";

export const healthRoutes = new Elysia()
  .get("/health", ({ request }) => {
    const region = request.headers.get("cf-ipcountry");

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: VERSION,
      region: region || "unknown",
    };
  });
