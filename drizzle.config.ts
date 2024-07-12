import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./app/db",
  dialect: "mysql",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    host: process.env.MYSQL_HOST!,
    database: process.env.MYSQL_DATABASE!,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});
