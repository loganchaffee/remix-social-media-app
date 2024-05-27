import { json } from "@remix-run/node";
import { requireUserSession } from "~/utils/requireUserSession";
import { PostService } from "~/services/Post.service";
import { handleErrorResponse } from "~/utils/handleError";

export async function createPost(request: Request) {
  const { user } = await requireUserSession(request);

  try {
    const formData = await request.formData();

    const content = formData.get("content");

    if (typeof content !== "string" || !content) {
      return handleErrorResponse(new Error("Invalid post content"));
    }

    await new PostService().createPost(user.id, content);

    return null;
  } catch (error) {
    return handleErrorResponse(error, "Failed to create post");
  }
}
