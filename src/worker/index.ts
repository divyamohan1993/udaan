import { Elysia } from "elysia";
import { schemesRoutes } from "./routes/schemes";
import { healthRoutes } from "./routes/health";
import { emergencyRoutes } from "./routes/emergency";

const app = new Elysia()
  .onError(({ code }) => {
    // Errors are moments of care, not dead ends
    return {
      error: {
        code: code || "UNKNOWN",
        message: {
          hi: "कुछ गड़बड़ हुई, लेकिन चिंता न करें। हम यहाँ हैं।",
          en: "Something went wrong, but don't worry. We are here.",
        },
        details: null,
      },
      emergency: [
        { name: "Emergency", nameHi: "आपातकालीन", number: "112" },
        { name: "KIRAN Mental Health", nameHi: "किरण मानसिक स्वास्थ्य", number: "1800-599-0019" },
      ],
      help: {
        path: "/",
        label: { hi: "वापस शुरू करें", en: "Start over" },
      },
    };
  })
  .use(healthRoutes)
  .use(schemesRoutes)
  .use(emergencyRoutes)
  .get("/api/ping", () => ({
    pong: true,
    timestamp: new Date().toISOString(),
  }))
  .compile();

export default {
  fetch: app.fetch,
};
