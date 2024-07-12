import { requireUserSession } from "~/utils/requireUserSession";
import { PostService } from "~/services/Post.service";
import { handleErrorResponse } from "~/utils/handleError";
import { ActionFunctionArgs, json } from "@remix-run/node";

export async function createPost({ request }: ActionFunctionArgs) {
  const { user } = await requireUserSession(request);

  try {
    const formData = await request.formData();

    const content = formData.get("content");

    if (typeof content !== "string" || !content) {
      return handleErrorResponse(new Error("Invalid post content"));
    }

    await PostService.createPost(user.id, content);

    return json(null);
  } catch (error) {
    return handleErrorResponse(error);
  }
}
