import { ActionFunctionArgs } from "@remix-run/node";
import { UserService } from "~/services/User.service";
import { handleErrorResponse } from "~/utils/handleError";
import { requireUserSession } from "~/utils/requireUserSession";

export async function deleteSession({ request }: ActionFunctionArgs) {
  await requireUserSession(request, { isAdminRoute: true });

  await requireUserSession(request);

  const formData = await request.formData();

  const id = formData.get("sessionId");

  if (typeof id !== "string" || !id) {
    return handleErrorResponse(new Error("Invalid session ID"));
  }

  await UserService.deleteUserSession(id);

  return null;
}
