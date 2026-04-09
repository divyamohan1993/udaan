import { Elysia } from "elysia";
import { schemesRoutes } from "./routes/schemes";
import { healthRoutes } from "./routes/health";

const app = new Elysia()
  .use(healthRoutes)
  .use(schemesRoutes)
  .get("/api/ping", () => ({
    pong: true,
    timestamp: new Date().toISOString(),
  }))
  .compile();

export default {
  fetch: app.fetch,
};
