import { json } from "@remix-run/node";
import { requireUserSession } from "~/utils/requireUserSession";
import { PostService } from "~/services/Post.service";

export async function createPost(request: Request) {
  const { user } = await requireUserSession(request);

  try {
    const formData = await request.formData();
    const content = formData.get("content");

    if (typeof content !== "string" || !content) {
      return json({ error: "Invalid content" });
    }

    await new PostService().createPost(user.id, content);

    return null;
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
