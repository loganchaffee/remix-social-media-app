import { createSessionStorage } from "@remix-run/node";
import { db } from "./db";
import { session as sessionTable } from "drizzle/schema";
import { v4 as uuid } from "uuid";
import { dateToTimestamp } from "./utils/dateToTimestamp";
import { and, eq, gt, lt } from "drizzle-orm";

type SessionData = {
  id: string;
  userId: string;
  createdAt: string | null;
  updatedAt: string | null;
  expiresAt: string | null;
};

type SessionFlashData = {
  error: string;
};

function createDatabaseSessionStorage() {
  return createSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 604_800, // one week
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET!],
      secure: true,
    },
    // Create session when calling commitSession while session object has no ID
    async createData(data, expires) {
      if (!data.userId || !expires) {
        throw Error("Cannot create session without user id");
      }

      // Delete any old sessions
      await db
        .delete(sessionTable)
        .where(
          and(
            eq(sessionTable.user_id, data.userId),
            lt(sessionTable.expires_at, dateToTimestamp(new Date()))
          )
        );

      const sessionId = uuid();

      await db.insert(sessionTable).values({
        user_id: data.userId,
        id: sessionId,
        expires_at: dateToTimestamp(expires),
      });

      return sessionId;
    },
    // Get session from the DB when calling getSession
    async readData(id) {
      const [session] = await db
        .select({
          id: sessionTable.id,
          userId: sessionTable.user_id,
          createdAt: sessionTable.created_at,
          updatedAt: sessionTable.updated_at,
          expiresAt: sessionTable.expires_at,
        })
        .from(sessionTable)
        .where(
          and(
            eq(sessionTable.id, id),
            // Dont select expired sessions
            gt(sessionTable.expires_at, dateToTimestamp(new Date()))
          )
        );

      return session;
    },
    // Update the session when calling commitSession if the session has an ID
    async updateData(id, data, expires) {
      if (expires) {
        await db
          .update(sessionTable)
          .set({ expires_at: dateToTimestamp(expires) })
          .where(eq(sessionTable.id, id));
      }
    },

    async deleteData(id) {
      await db.delete(sessionTable).where(eq(sessionTable.id, id));
    },
  });
}

const { getSession, commitSession, destroySession } =
  createDatabaseSessionStorage();

export { getSession, commitSession, destroySession };
