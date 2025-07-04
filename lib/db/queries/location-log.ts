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

export async function updateLocationLog(db: CreateDB, id: number, updatable: InsertLocationLog, useId: number) {
  const [updated] = await db.update(locationLog)
    .set(updatable)
    .where(and(
      eq(locationLog.id, id),
      eq(locationLog.userId, useId),
    ))
    .returning();

  return updated;
}

export async function deleteLocationLog(db: CreateDB, id: number, useId: number) {
  const [deleted] = await db.delete(locationLog).where(and(
    eq(locationLog.id, id),
    eq(locationLog.userId, useId),
  )).returning();

  return deleted;
}
