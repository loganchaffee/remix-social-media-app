import { destroySession, getSession } from "../sessions";
import { redirect } from "@remix-run/node";
import { UserService, UserWithoutPassword } from "~/services/User.service";

type Options = {
  isAdminRoute?: boolean;
};

export async function requireUserSession(
  request: Request,
  options: Options = {}
) {
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

  let user: UserWithoutPassword;

  try {
    user = await new UserService().getUserById(userId);
  } catch (error) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  if (options.isAdminRoute && user.isAdmin === 0) {
    throw redirect("/");
  }

  return { session, user };
}
