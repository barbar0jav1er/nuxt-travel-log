import { findLocations } from "~/lib/db/queries/locations";
import { defineAuthenticatedEventHandler } from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const db = event.context.db;
  return findLocations(db, event.context.user.id);
});
