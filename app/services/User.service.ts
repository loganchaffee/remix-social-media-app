import { and, count, eq, inArray, InferSelectModel, like } from "drizzle-orm";
import { follow, session, user } from "~/db/schema";
import { db } from "~/db";
import argon2 from "argon2";
import { v4 as uuid } from "uuid";

export type User = InferSelectModel<typeof user>;

export type UserWithoutPassword = Omit<User, "password">;

type GetUserOptions = {
  includePassword: boolean;
};

type SearchUsersFilters = {
  searchQuery: string;
  page: number;
  pageSize: number;
  currentUserId: string;
};

export class UserService {
  static async createUser(username: string, password: string) {
    const [duplicate] = await db
      .select()
      .from(user)
      .where(eq(user.username, username));

    if (duplicate) {
      throw new Error("Username already taken");
    }

    const hashedPassword = await argon2.hash(password);

    const userId = uuid();

    await db.insert(user).values({
      id: userId,
      username,
      password: hashedPassword,
    });

    const [newUser] = await db.select().from(user).where(eq(user.id, userId));

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    return newUser;
  }

  static async getUserById<T extends GetUserOptions>(
    id: string,
    opt?: T
  ): Promise<T["includePassword"] extends true ? User : UserWithoutPassword> {
    if (opt?.includePassword) {
      const [targetUser] = await db.select().from(user).where(eq(user.id, id));

      return targetUser;
    } else {
      const [targetUser] = await db
        .select({
          id: user.id,
          username: user.username,
          bio: user.bio,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(eq(user.id, id));

      return targetUser as T["includePassword"] extends true
        ? User
        : UserWithoutPassword;
    }
  }

  static async getUserByUsername<T extends GetUserOptions>(
    username: string,
    opt?: T
  ): Promise<T["includePassword"] extends true ? User : UserWithoutPassword> {
    if (opt?.includePassword) {
      const [targetUser] = await db
        .select()
        .from(user)
        .where(eq(user.username, username));

      return targetUser;
    } else {
      const [targetUser] = await db
        .select({
          id: user.id,
          username: user.username,
          bio: user.bio,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(eq(user.username, username));

      return targetUser as T["includePassword"] extends true
        ? User
        : UserWithoutPassword;
    }
  }

  static async updateUser(id: string, updates: Partial<User>) {
    await db.update(user).set(updates).where(eq(user.id, id));
  }

  static async searchUsers({
    searchQuery,
    page,
    pageSize,
    currentUserId,
  }: SearchUsersFilters) {
    const userPromise = db
      .select({
        id: user.id,
        username: user.username,
        bio: user.bio,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        followId: follow.id,
      })
      .from(user)
      .leftJoin(
        follow,
        and(eq(follow.follower, currentUserId), eq(follow.followee, user.id))
      )
      .where(like(user.username, `%${searchQuery}%`))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(user.username);

    const countPromise = db
      .select({ count: count() })
      .from(user)
      .where(like(user.username, `%${searchQuery}%`))
      .execute();

    const [users, countResults] = await Promise.all([
      userPromise,
      countPromise,
    ]);

    const userCount = countResults[0].count;

    const formattedUsers = users.map((u) => {
      const { followId, ...selectFields } = u;

      return {
        ...selectFields,
        isFollowed: !!followId,
      };
    });

    return { users: formattedUsers, count: userCount };
  }

  static async adminSearchUsers({
    searchQuery,
    page,
    pageSize,
  }: SearchUsersFilters) {
    const userPromise = db
      .select({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(like(user.username, `%${searchQuery}%`))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(user.username);

    const countPromise = db
      .select({ count: count() })
      .from(user)
      .where(like(user.username, `%${searchQuery}%`))
      .execute();

    const [users, countResults] = await Promise.all([
      userPromise,
      countPromise,
    ]);

    const userCount = countResults[0].count;

    const sessions = await db
      .select()
      .from(session)
      .where(
        users.length > 0
          ? inArray(
              session.userId,
              users.map((u) => u.id)
            )
          : undefined
      );

    const formattedUsers = users.map((u) => {
      return {
        ...u,
        sessions: sessions.filter((s) => s.userId === u.id),
      };
    });

    return { users: formattedUsers, count: userCount };
  }

  static async deleteUserSession(sessionId: string) {
    await db.delete(session).where(eq(session.id, sessionId));
  }

  static async deleteUser(userId: string) {
    await db.delete(user).where(eq(user.id, userId));
  }
}
