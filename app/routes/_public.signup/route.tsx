import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { db } from "~/db";
import { commitSession, getSession } from "~/sessions";
import { v4 as uuid } from "uuid";
import argon2 from "argon2";
import { session as sessionTable } from "~/db/scheme";
import { dateToTimestamp } from "~/utils/dateToTimestamp";
import { getDateDaysFromNow } from "~/utils/getDateDaysFromNow";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username ||
    !password
  ) {
    return json({ error: "Invalid username or password" });
  }

  const [duplicate] = await db
    .select()
    .from(user)
    .where(eq(user.username, username));

  if (duplicate) {
    return json({ error: "Username already taken" });
  }

  const hashedPassword = await argon2.hash(password);

  const userId = uuid();

  await db.insert(user).values({
    id: userId,
    username,
    password: hashedPassword,
  });

  const sessionId = uuid();

  await db.insert(sessionTable).values({
    user_id: userId,
    id: sessionId,
    expires_at: dateToTimestamp(getDateDaysFromNow(7)),
  });

  const session = await getSession();

  session.set("sessionId", userId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Sign Up</h1>
      <Form method="post">
        <input
          name="username"
          className="border-b mb-10 block w-full p-1"
          placeholder="Enter username"
        />
        <input
          name="password"
          className="border-b mb-10 block w-full p-1"
          placeholder="Enter password"
        />

        <div className="flex justify-between">
          <button className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-lg">
            Signup
          </button>

          <Link to="/login" className="text-blue-500">
            Login instead
          </Link>
        </div>
      </Form>
    </div>
  );
}
