import Fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env.js";
import { getDbPool } from "./config/database.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { chatRoutes } from "./routes/chat.js";

const app = Fastify({
  logger: true
});

await app.register(cors, {
  origin: env.CORS_ORIGIN
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "test-analytics-backend",
    timestamp: new Date().toISOString()
  };
});

app.get("/health/db", async (_request, reply) => {
  try {
    const pool = await getDbPool();
    await pool.request().query("SELECT 1 AS ok");

    return {
      status: "ok",
      database: "connected"
    };
  } catch (error) {
    app.log.error(error);

    return reply.code(503).send({
      status: "error",
      database: "unavailable"
    });
  }
});

await app.register(dashboardRoutes, {
  prefix: "/api/dashboard"
});

await app.register(chatRoutes, {
  prefix: "/api/chat"
});

try {
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0"
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
