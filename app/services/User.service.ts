import { eq, InferSelectModel } from "drizzle-orm";
import { user } from "~/db/schema";
import { db } from "~/db";
import argon2 from "argon2";
import { v4 as uuid } from "uuid";
type User = InferSelectModel<typeof user>;
type UserWithoutPassword = Omit<User, "password">;

type GetUserOptions = {
  includePassword: boolean;
};

export class UserService {
  /**
   * @throws {Error} If the operation fails.
   */
  async createUser(username: string, password: string) {
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

  /**
   * @throws {Error} If the operation fails.
   */
  async getUserById<T extends GetUserOptions>(
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

  /**
   * @throws {Error} If the operation fails.
   */
  async getUserByUsername<T extends GetUserOptions>(
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

  /**
   * @throws {Error} If the operation fails.
   */
  async updateUser(id: string, updates: Partial<User>) {
    await db.update(user).set(updates).where(eq(user.id, id));
  }
}
