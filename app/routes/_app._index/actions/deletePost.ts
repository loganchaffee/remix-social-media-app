import { requireUserSession } from "~/utils/requireUserSession";
import { PostService } from "~/services/Post.service";
import { handleErrorResponse } from "~/utils/handleError";
import { ActionFunctionArgs, json } from "@remix-run/node";

export async function deletePost({ request }: ActionFunctionArgs) {
  const { user } = await requireUserSession(request);

  try {
    const formData = await request.formData();

    const id = formData.get("id");

    if (typeof id !== "string" || !id) {
      return handleErrorResponse(
        new Error("Cannot delete post. Invalid post ID.")
      );
    }

    await PostService.deleteUserOwnPost(user.id, id);

    return json(null);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
