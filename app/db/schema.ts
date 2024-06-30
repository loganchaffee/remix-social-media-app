import {
  mysqlTable,
  index,
  primaryKey,
  varchar,
  timestamp,
  datetime,
  longtext,
  tinyint,
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
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => {
    return {
      e: index("followee").on(table.followee),
      r: index("follower").on(table.follower),
      followId: primaryKey({ columns: [table.id], name: "follow_id" }),
    };
  }
);

export const post = mysqlTable(
  "post",
  {
    id: varchar("id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    content: varchar("content", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => {
    return {
      userId: index("user_id").on(table.userId),
      postId: primaryKey({ columns: [table.id], name: "post_id" }),
    };
  }
);

export const session = mysqlTable(
  "session",
  {
    id: varchar("id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      userId: index("user_id").on(table.userId),
      sessionId: primaryKey({ columns: [table.id], name: "session_id" }),
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
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: datetime("updated_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    isAdmin: tinyint("is_admin").default(0).notNull(),
  },
  (table) => {
    return {
      userId: primaryKey({ columns: [table.id], name: "user_id" }),
    };
  }
);

