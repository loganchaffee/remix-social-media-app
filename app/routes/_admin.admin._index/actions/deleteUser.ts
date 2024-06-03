import { ActionFunctionArgs } from "@remix-run/node";
import { UserService } from "~/services/User.service";
import { handleErrorResponse } from "~/utils/handleError";
import { requireUserSession } from "~/utils/requireUserSession";

export async function deleteUser({ request }: ActionFunctionArgs) {
  await requireUserSession(request, { isAdminRoute: true });

  const formData = await request.formData();

  try {
    const id = formData.get("userId");

    if (typeof id !== "string" || !id) {
      return handleErrorResponse(new Error("Invalid session ID"));
    }

    await new UserService().deleteUser(id);

    return null;
  } catch (error) {
    return handleErrorResponse(error, "Failed to delete user");
  }
}
