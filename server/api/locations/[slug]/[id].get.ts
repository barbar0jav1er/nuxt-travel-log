import { z } from "zod";

import { findLocationLogById } from "~/lib/db/queries/location-log";
import { findLocation } from "~/lib/db/queries/locations";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const db = event.context.db;
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(db, slug, event.context.user.id);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found",
    }));
  }

  const id = getRouterParam(event, "id") as string;

  if (!z.coerce.number().safeParse(id).success) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "Invalid Id",
    }));
  }

  const locationLog = await findLocationLogById(db, Number(id), event.context.user.id);

  if (!locationLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location Log not found",
    }));
  }

  return locationLog;
});
