import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { betterAuthOptions } from "./lib/auth/options";
import env from "./lib/env";

const { BETTER_AUTH_URL, BETTER_AUTH_SECRET } = env;

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter({} as any, { provider: "sqlite" }),
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
});
