import { db } from "~/db";
import { destroySession, getSession } from "../sessions";
import { redirect } from "@remix-run/node";
import { session as sessionTable, user as userTable } from "drizzle/schema";
import { eq } from "drizzle-orm";

export async function requireUserSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionId = session.get("id");
  const userId = session.get("userId");

  if (!sessionId || !userId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  try {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));

    return { session, user, request };
  } catch (error) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
