import { and, desc, eq } from "drizzle-orm";
import { union } from "drizzle-orm/mysql-core";
import { follow, post, user } from "~/db/schema";
import { db } from "~/db";
import { v4 as uuid } from "uuid";

export class PostService {
  static async deleteUserOwnPost(userId: string, postId: string) {
    await db
      .delete(post)
      .where(and(eq(post.userId, userId), eq(post.id, postId)));
  }

  static async createPost(userId: string, content: string) {
    const postId = uuid();

    await db.insert(post).values({
      userId: userId,
      id: postId,
      content,
    });
  }

  static async getUserNewsFeedPage(
    userId: string,
    page: number,
    pageSize: number
  ) {
    const posts = await union(
      // Posts from those the user follows
      db
        .select({
          id: post.id,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          authorId: post.userId,
          authorUsername: user.username,
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .innerJoin(follow, eq(follow.followee, post.userId))
        .where(eq(follow.follower, userId)),
      // User's own posts
      db
        .select({
          id: post.id,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          authorId: post.userId,
          authorUsername: user.username,
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .where(eq(post.userId, userId))
    )
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(desc(post.createdAt));

    return posts;
  }
}
