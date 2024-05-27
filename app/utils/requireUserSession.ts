import { destroySession, getSession } from "../sessions";
import { redirect } from "@remix-run/node";
import { UserService } from "~/services/User.service";

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
    const user = await new UserService().getUserById(userId);

    return { session, user };
  } catch (error) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}
