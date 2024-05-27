import { json } from "@remix-run/node";
import { PostService } from "~/services/Post.service";
import { requireUserSession } from "~/utils/requireUserSession";

export async function deletePost(request: Request) {
  try {
    const { user } = await requireUserSession(request);

    const formData = await request.formData();

    const id = formData.get("id");

    if (typeof id !== "string" || !id) {
      return json({ error: "Cannot delete post. Invalid post ID." });
    }

    await new PostService().deleteUserOwnPost(user.id, id);

    return null;
  } catch (error) {
    console.log(error);

    return { error: "Something went wrong" };
  }
}
