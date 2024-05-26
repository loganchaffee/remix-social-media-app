import { json } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { db } from "~/db";
import argon2 from "argon2";
import { v4 as uuid } from "uuid";

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
}
