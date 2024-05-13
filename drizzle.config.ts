import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/scheme.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    user: "root",
    password: "",
    host: "127.0.0.1",
    port: 3306,
    database: "remix_book",
  },
});
