import { json } from "@remix-run/node";
import { requireUserSession } from "~/utils/requireUserSession";
import { v4 as uuid } from "uuid";
import { db } from "~/db";
import { post } from "drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function createPost(request: Request) {
  try {
    const { user } = await requireUserSession(request);

    const formData = await request.formData();

    const content = formData.get("content");

    if (typeof content !== "string" || !content) {
      return json({ error: "Invalid content" });
    }

    const postId = uuid();

    await db.insert(post).values({
      user_id: user.id,
      id: postId,
      content,
    });

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Something went wrong" };
    }
  }
}

export async function deletePost(request: Request) {
  try {
    const { user } = await requireUserSession(request);

    const formData = await request.formData();

    const id = formData.get("id");

    if (typeof id !== "string" || !id) {
      return json({ error: "Invalid ID" });
    }

    console.log(id);

    await db
      .delete(post)
      .where(and(eq(post.id, id), eq(post.user_id, user.id)));

    return null;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Something went wrong" };
    }
  }
}
