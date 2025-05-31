import { drizzle } from "drizzle-orm/d1";

export default function db(D1: D1Database) {
  return drizzle(D1);
}
