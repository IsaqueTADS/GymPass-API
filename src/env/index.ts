import "dotenv/config";

import z from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  API_URL: z.string().default("http://localhost:3333"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables");
  console.log(JSON.stringify(z.treeifyError(_env.error)), null, 2);
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
