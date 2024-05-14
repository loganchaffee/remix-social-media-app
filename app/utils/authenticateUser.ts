import { user } from "drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { getSession } from "~/sessions";
import { session as sessionTable } from "~/db/scheme";

export async function authenticateUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));

  const sessionId = session.get("sessionId");

  if (!sessionId) {
    return null;
  }

  const [result] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, sessionId))
    .leftJoin(user, eq(sessionTable.user_id, user.id))
    .execute();

  return result.user;
}
