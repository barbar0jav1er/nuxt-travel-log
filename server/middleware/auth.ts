import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/dashboard")) {
    const { DB, ...cloudflareEnv } = event.context.cloudflare.env;
    const session = await auth(DB, cloudflareEnv).api.getSession({ headers: event.headers });

    if (!session) {
      await sendRedirect(event, "/", 302);
    }
  }
});
