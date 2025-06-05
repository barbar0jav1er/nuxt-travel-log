import { createDB } from "~/lib/db";

export default defineEventHandler(async (event) => {
  const { DB } = event.context.cloudflare.env;
  const db = createDB(DB);
  event.context.db = db;
});
