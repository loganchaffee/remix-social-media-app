import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession } from "~/sessions";
import { requireUserSession } from "~/utils/requireUserSession";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await requireUserSession(request);

  if (!session.id) {
    return redirect("/login");
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
