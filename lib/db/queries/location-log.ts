import { and, eq } from "drizzle-orm";

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

export async function findLocationLogById(db: CreateDB, id: number, useId: number) {
  const foundLocationLog = await db.query.locationLog.findFirst({
    where: and(
      eq(locationLog.id, id),
      eq(locationLog.userId, useId),
    ),
  });
  return foundLocationLog;
}
