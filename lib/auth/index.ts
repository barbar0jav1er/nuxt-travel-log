import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { createDB } from "./../db";
import { getEnv } from "./../env";
import { betterAuthOptions } from "./options";

export function auth(DB: D1Database, cloudflareEnv: Partial<Env>): ReturnType<typeof betterAuth> {
  const db = createDB(DB);
  const env = getEnv(cloudflareEnv);
  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    socialProviders: {
      github: {
        clientId: env.AUTH_GITHUB_CLIENT_ID!,
        clientSecret: env.AUTH_GITHUB_CLIENT_SECRET!,
      },
    },
  });
}
