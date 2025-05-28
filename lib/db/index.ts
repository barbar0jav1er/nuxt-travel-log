import { drizzle } from "drizzle-orm/libsql";

import * as schema from "~/lib/db/schema";
import env from "~/lib/env";

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_DATABASE_AUTH_TOKEN,
  },
  casing: "snake_case",
  schema,
});

export default db;
