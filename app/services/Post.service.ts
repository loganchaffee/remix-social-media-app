import { and, desc, eq } from "drizzle-orm";
import { union } from "drizzle-orm/mysql-core";
import { follow, post, user } from "drizzle/schema";
import { db } from "~/db";
import { v4 as uuid } from "uuid";

export class PostService {
  async deleteUserOwnPost(userId: string, postId: string) {
    await db
      .delete(post)
      .where(and(eq(post.user_id, userId), eq(post.id, postId)));
  }

  async createPost(userId: string, content: string) {
    const postId = uuid();

    await db.insert(post).values({
      user_id: userId,
      id: postId,
      content,
    });
  }

  async getUserNewsFeedPage(userId: string, page: number, pageSize: number) {
    const posts = await union(
      // Posts from those the user follows
      db
        .select({
          id: post.id,
          content: post.content,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          authorId: post.user_id,
          authorUsername: user.username,
        })
        .from(post)
        .leftJoin(user, eq(post.user_id, user.id))
        .innerJoin(follow, eq(follow.followee, post.user_id))
        .where(eq(follow.follower, userId)),
      // User's own posts
      db
        .select({
          id: post.id,
          content: post.content,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          authorId: post.user_id,
          authorUsername: user.username,
        })
        .from(post)
        .leftJoin(user, eq(post.user_id, user.id))
        .where(eq(post.user_id, userId))
    )
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(desc(post.created_at));

    return posts;
  }
}
