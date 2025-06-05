import { auth } from "~/lib/auth";

export default defineEventHandler((event) => {
  const { db, cloudflare } = event.context;
  const { DB: _, ...cloudflareEnv } = cloudflare.env;
  return auth(db, cloudflareEnv).handler(toWebRequest(event));
});
