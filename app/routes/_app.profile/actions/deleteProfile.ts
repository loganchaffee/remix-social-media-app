import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { UserService } from "~/services/User.service";
import { destroySession } from "~/sessions";
import { requireUserSession } from "~/utils/requireUserSession";

export async function deleteProfile({ request }: ActionFunctionArgs) {
  // Authenticate user session
  const { user, session } = await requireUserSession(request);

  try {
    await UserService.deleteUser(user.id);

    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    return json({ error: "Something went wrong" });
  }
}
