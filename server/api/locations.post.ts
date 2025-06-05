import { InsertLocationSchema, location } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    },
    ));
  }
  const result = await readValidatedBody(event, InsertLocationSchema.safeParse);

  if (!result.success) {
    const statusMessage = result
      .error
      .issues
      .map(issue => `${issue.path.join("")}: ${issue.message}`)
      .join("; ");

    const data = result
      .error
      .issues
      .reduce((errors, issue) => {
        errors[issue.path.join("")] = issue.message;
        return errors;
      }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    },
    ));
  }

  const db = event.context.db;
  const [created] = await db.insert(location).values({
    ...result.data,
    slug: result.data.name.replace(" ", "-").toLowerCase(),
    userId: event.context.user.id,
  }).returning();

  return created;
});
