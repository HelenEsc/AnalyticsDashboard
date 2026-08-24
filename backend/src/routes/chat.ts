import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { answerQuestion } from "../services/aiService.js";

const chatSchema = z.object({
  question: z.string().min(1).max(2000)
});

export async function chatRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const parsed = chatSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.code(400).send({
        error: "question is required"
      });
    }

    return answerQuestion(parsed.data.question);
  });
}
