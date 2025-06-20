import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";

import type { CreateDB } from "../index";
import type { InsertLocation } from "../schema";

import { location } from "../schema";

const nanoid = customAlphabet("123456890abcdefghijklmnopqrstuvwxyz", 5);

export async function findLocation(db: CreateDB, slug: string, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.slug, slug),
      eq(location.userId, userId),
    ),
    with: {
      locationLogs: {
        orderBy: (field, operators) => {
          return operators.desc(field.startedAt);
        },
      },
    },
  });
}

export async function findLocations(db: CreateDB, userId: number) {
  return db.query.location.findMany({
    where: eq(location.userId, userId),
  });
}

export async function findLocationByName(db: CreateDB, existing: InsertLocation, userId: number) {
  return db.query.location.findFirst({
    where: and(
      eq(location.name, existing.name),
      eq(location.userId, userId),
    ),
  });
}

export async function findLocationBySlug(db: CreateDB, slug: string) {
  return db.query.location.findFirst({
    where: eq(location.slug, slug),
  });
}

export async function findUniqueSlug(db: CreateDB, slug: string) {
  let existing = !!(await findLocationBySlug(db, slug));

  // FIX we can do it better (get all the slug tha startWith)
  while (existing) {
    const id = nanoid();
    const idSlug = `${slug}-${id}`;
    existing = !!(await findLocationBySlug(db, idSlug));
    if (!existing) {
      return idSlug;
    }
  }
  return slug;
}

export async function insertLocation(db: CreateDB, insertable: InsertLocation, slug: string, userId: number) {
  const [created] = await db.insert(location).values({
    ...insertable,
    slug,
    userId,
  }).returning();
  return created;
}

export async function updateLocationBySlug(db: CreateDB, updates: InsertLocation, slug: string, userId: number) {
  const [updated] = await db.update(location).set(updates).where(and(
    eq(location.slug, slug),
    eq(location.userId, userId),
  )).returning();
  return updated;
}

export async function removeLocationBySlug(db: CreateDB, slug: string, userId: number) {
  const [removed] = await db.delete(location).where(and(
    eq(location.slug, slug),
    eq(location.userId, userId),
  )).returning();
  return removed;
}
