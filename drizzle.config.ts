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
    user: "root",
    password: "",
    host: "127.0.0.1",
    port: 3306,
    database: "remix_social_media",
  },
});
