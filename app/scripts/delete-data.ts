import "dotenv/config";
import { user } from "~/db/schema";
import { db } from "~/db";

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

  process.exit(0);
}

main();
