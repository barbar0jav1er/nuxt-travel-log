import { z } from "zod";

import { updateLocationLog } from "~/lib/db/queries/location-log";
import { findLocation } from "~/lib/db/queries/locations";
import { InsertLocationLog } from "~/lib/db/schema";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const db = event.context.db;
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(db, slug, event.context.user.id);

  const result = await readValidatedBody(event, InsertLocationLog.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

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

  const locationLog = await updateLocationLog(db, Number(id), result.data, event.context.user.id);

  if (!locationLog) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location Log not found",
    }));
  }

  return locationLog;
});
