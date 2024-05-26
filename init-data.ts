import { db } from "./app/db";
import { user } from "./app/db/schema";
import { faker } from "@faker-js/faker";
import argon2 from "argon2";
import { post } from "drizzle/schema";
import { v4 as uuid } from "uuid";

async function createUsersAndPosts() {
  try {
    const hashedPassword = await argon2.hash("password");

    for (let i = 0; i < 1000; i++) {
      const userId = uuid();

      // Create user
      await db.insert(user).values({
        id: userId,
        username: faker.person.fullName(),
        password: hashedPassword,
        bio: faker.person.bio(),
      });

      // Create posts
      for (let i = 0; i < 100; i++) {
        await db.insert(post).values({
          id: uuid(),
          user_id: userId,
          content: faker.lorem.sentence(),
        });
      }
    }

    await db.insert(user).values({
      id: uuid(),
      username: "logan",
      password: hashedPassword,
    });

    console.log("Users created successfully.");
  } catch (error) {
    console.error("Error creating users:", error);
  }
}

async function deleteUsers() {
  try {
    await db.delete(user);

    console.log("Old users deleted successfully.");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

async function deletePosts() {
  try {
    await db.delete(user);

    console.log("Old users deleted successfully.");
  } catch (error) {
    console.error("Error deleting users:", error);
  }
}

async function main() {
  await deleteUsers();

  await deletePosts();

  await createUsersAndPosts();

  process.exit(0);
}

main();
