import type { User } from "better-auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";

import type { CreateDB } from "./../db";

import { getEnv } from "./../env";
import { betterAuthOptions } from "./options";

// because we are using number instead the string provide by better auth
export type UserWithId = Omit<User, "id"> & {
  id: number;
};

export function auth(db: CreateDB, cloudflareEnv: Partial<Env>): ReturnType<typeof betterAuth> {
  const env = getEnv(cloudflareEnv);
  return betterAuth({
    ...betterAuthOptions,
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/get-session") {
          if (!ctx.context.session) {
            return ctx.json({
              session: null,
              user: null,
            });
          }
          return ctx.json(ctx.context.session);
        }
      }),
    },
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
