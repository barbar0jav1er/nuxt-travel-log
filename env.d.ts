/// <reference types="./worker-configuration.d.ts" />

import type { User } from "better-auth";

import type { CreateDB } from "./lib/db";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    cf: CfProperties;
    user?: Omit<User, "id"> & {
      id: number;
    };
    db: ReturnType<typeof CreateDB>;
    cloudflare: {
      request: Request;
      env: Env;
      context: ExecutionContext;
    };
  };
}

export {};
