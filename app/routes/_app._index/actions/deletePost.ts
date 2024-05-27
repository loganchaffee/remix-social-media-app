import { PostService } from "~/services/Post.service";
import { handleErrorResponse } from "~/utils/handleError";
import { requireUserSession } from "~/utils/requireUserSession";

export async function deletePost(request: Request) {
  const { user } = await requireUserSession(request);

  try {
    const formData = await request.formData();

    const id = formData.get("id");

    if (typeof id !== "string" || !id) {
      return handleErrorResponse(
        new Error("Cannot delete post. Invalid post ID.")
      );
    }

    await new PostService().deleteUserOwnPost(user.id, id);

    return null;
  } catch (error) {
    return handleErrorResponse(error, "Failed to delete post");
  }
}
