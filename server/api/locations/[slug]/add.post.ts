import { insertLocationLog } from "~/lib/db/queries/location-log";
import { findLocation } from "~/lib/db/queries/locations";
import { InsertLocationLog } from "~/lib/db/schema";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const db = event.context.db;
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(db, slug, event.context.user.id);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    }));
  }

  const result = await readValidatedBody(event, InsertLocationLog.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  return insertLocationLog(db, location.id, result.data, event.context.user.id);
});
