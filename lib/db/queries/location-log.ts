import type { CreateDB } from "..";
import type { InsertLocationLog } from "../schema";

import { locationLog } from "../schema";

export async function insertLocationLog(
  db: CreateDB,
  locationId: number,
  insertable: InsertLocationLog,
  userId: number,
) {
  const [inserted] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();

  return inserted;
}
