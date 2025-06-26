/* eslint-disable node/no-process-env */
import { z } from "zod";

import tryParseEnv from "./try-parse-env";

// TODO fix the default value on required env variables
const EnvSchema = z.object({
  NODE_ENV: z.string().default("production"),
  BETTER_AUTH_SECRET: z.string().default(""),
  BETTER_AUTH_URL: z.string().default(""),
  AUTH_GITHUB_CLIENT_ID: z.string().default(""),
  AUTH_GITHUB_CLIENT_SECRET: z.string().default(""),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_DATABASE_ID: z.string().optional(),
  CLOUDFLARE_D1_TOKEN: z.string().optional(),

  S3_ENDPOINT: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_ACCESS_SECRET: z.string(),
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

const defaultEnv = EnvSchema.parse(process.env);

export function getEnv(cloudflareEnv?: Partial<Env>): EnvSchema {
  if (cloudflareEnv && process?.env?.NODE_ENV !== "development") {
    return EnvSchema.parse({
      ...process.env,
      ...cloudflareEnv,
    });
  }

  return defaultEnv;
}

tryParseEnv(EnvSchema);
export default defaultEnv;
