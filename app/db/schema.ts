import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  index,
  foreignKey,
  primaryKey,
  varchar,
  timestamp,
  datetime,
  longtext,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const follow = mysqlTable(
  "follow",
  {
    id: varchar("id", { length: 255 }).notNull(),
    follower: varchar("follower", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followee: varchar("followee", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => {
    return {
      r: index("follower").on(table.follower),
      e: index("followee").on(table.followee),
      follow_id: primaryKey({ columns: [table.id], name: "follow_id" }),
    };
  }
);

export const post = mysqlTable(
  "post",
  {
    id: varchar("id", { length: 255 }).notNull(),
    user_id: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => {
    return {
      user_id: index("user_id").on(table.user_id),
      post_id: primaryKey({ columns: [table.id], name: "post_id" }),
    };
  }
);

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 255 }).notNull(),
    user_id: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    expires_at: timestamp("expires_at", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      user_id: index("user_id").on(table.user_id),
      session_id: primaryKey({ columns: [table.id], name: "session_id" }),
    };
  }
);

export const user = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    bio: longtext("bio"),
    created_at: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updated_at: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => {
    return {
      user_id: primaryKey({ columns: [table.id], name: "user_id" }),
    };
  }
);

