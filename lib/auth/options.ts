import type { BetterAuthOptions } from "better-auth";

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  appName: "Nuxt Travel Log",
  advanced: {
    database: {
      generateId: false,
    },
  },
};
