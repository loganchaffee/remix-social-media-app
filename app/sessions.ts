import { createSessionStorage } from "@remix-run/node";
import { db } from "./db";
import { session as sessionTable } from "~/db/schema";
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
            eq(sessionTable.userId, data.userId),
            lt(sessionTable.expiresAt, dateToTimestamp(new Date()))
          )
        );

      const sessionId = uuid();

      await db.insert(sessionTable).values({
        userId: data.userId,
        id: sessionId,
        expiresAt: dateToTimestamp(expires),
      });

      return sessionId;
    },
    // Get session from the DB when calling getSession
    async readData(id) {
      const [session] = await db
        .select({
          id: sessionTable.id,
          userId: sessionTable.userId,
          createdAt: sessionTable.createdAt,
          updatedAt: sessionTable.updatedAt,
          expiresAt: sessionTable.expiresAt,
        })
        .from(sessionTable)
        .where(
          and(
            eq(sessionTable.id, id),
            // Dont select expired sessions
            gt(sessionTable.expiresAt, dateToTimestamp(new Date()))
          )
        );

      return session;
    },
    // Update the session when calling commitSession if the session has an ID
    async updateData(id, data, expires) {
      if (expires) {
        await db
          .update(sessionTable)
          .set({ expiresAt: dateToTimestamp(expires) })
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
