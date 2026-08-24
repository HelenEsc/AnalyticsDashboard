import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  getFailureReasons,
  getFailuresByStation,
  getTestSummary,
  getTestTrend
} from "../services/dashboardService.js";

const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
}).refine(({ startDate, endDate }) => startDate <= endDate, {
  message: "startDate must be before or equal to endDate"
});

function parseDateRange(query: unknown) {
  return dateRangeSchema.safeParse(query);
}

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/summary", async (request, reply) => {
    const parsed = parseDateRange(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Invalid date range",
        details: parsed.error.issues.map(issue => issue.message)
      });
    }

    return getTestSummary(parsed.data);
  });

  app.get("/failures-by-station", async (request, reply) => {
    const parsed = parseDateRange(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Invalid date range",
        details: parsed.error.issues.map(issue => issue.message)
      });
    }

    return getFailuresByStation(parsed.data);
  });

  app.get("/failure-reasons", async (request, reply) => {
    const parsed = parseDateRange(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Invalid date range",
        details: parsed.error.issues.map(issue => issue.message)
      });
    }

    return getFailureReasons(parsed.data);
  });

  app.get("/trend", async (request, reply) => {
    const parsed = parseDateRange(request.query);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "Invalid date range",
        details: parsed.error.issues.map(issue => issue.message)
      });
    }

    return getTestTrend(parsed.data);
  });
}
