import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { destroySession, getSession } from "~/sessions";
import { session as sessionTable } from "~/db/scheme";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const id = session.get("sessionId");

  if (!id) {
    return redirect("/login");
  }

  await db.delete(sessionTable).where(eq(sessionTable.id, id));

  await destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
