import { auth } from "~/lib/auth";

export default defineEventHandler((event) => {
  const { DB, ...cloudflareEnv } = event.context.cloudflare.env;
  return auth(DB, cloudflareEnv).handler(toWebRequest(event));
});
