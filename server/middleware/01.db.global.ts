import { CreateDB } from "~/lib/db";

export default defineEventHandler(async (event) => {
  const { DB } = event.context.cloudflare.env;
  const db = CreateDB(DB);
  event.context.db = db;
});
