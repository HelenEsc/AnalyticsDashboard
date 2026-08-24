import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),

  DB_SERVER: z.string().min(1),
  DB_PORT: z.coerce.number().default(1433),
  DB_DATABASE: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_ENCRYPT: z.enum(["true", "false"]).default("true"),
  DB_TRUST_SERVER_CERTIFICATE: z.enum(["true", "false"]).default("false"),
  DB_POOL_MAX: z.coerce.number().default(10),
  DB_POOL_MIN: z.coerce.number().default(0),
  DB_POOL_IDLE_TIMEOUT: z.coerce.number().default(30000),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional()
});

export const env = envSchema.parse(process.env);
