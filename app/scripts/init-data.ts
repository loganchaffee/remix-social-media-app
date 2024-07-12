import "dotenv/config";
import { faker } from "@faker-js/faker";
import argon2 from "argon2";
import { post, user } from "~/db/schema";
import { v4 as uuid } from "uuid";
import { db } from "~/db";

async function createUsersAndPosts() {
  try {
    const hashedPassword = await argon2.hash(
      process.env.DEFAULT_USER_PASSWORD!
    );

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
          userId: userId,
          content: faker.lorem.sentence(),
        });
      }
    }

    console.log("Users created successfully.");
  } catch (error) {
    console.error("Error creating users:", error);
  }
}

async function main() {
  await createUsersAndPosts();

  process.exit(0);
}

main();
