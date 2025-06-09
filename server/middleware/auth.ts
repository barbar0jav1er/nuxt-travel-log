import type { UserWithId } from "~/lib/auth";

import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const { db, cloudflare } = event.context;
  const { DB: _, ...cloudflareEnv } = cloudflare.env;
  const session = await auth(db, cloudflareEnv).api.getSession({ headers: event.headers });
  event.context.user = session?.user as unknown as UserWithId;
  if (event.path.startsWith("/dashboard")) {
    //
    if (!session?.user) {
      await sendRedirect(event, "/", 302);
    }
  }
});
