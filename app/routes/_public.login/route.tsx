import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { db } from "~/db";
import { commitSession, getSession } from "~/sessions";
import argon2 from "argon2";
import { session as sessionTable } from "~/db/scheme";
import { v4 as uuid } from "uuid";
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

  const [currentUser] = await db
    .select({ id: user.id, password: user.password })
    .from(user)
    .where(eq(user.username, username))
    .execute();

  if (!currentUser) {
    return json({ error: "Invalid username or password" });
  }

  const isPasswordMatch = await argon2.verify(currentUser.password, password);

  if (!isPasswordMatch) {
    return json({ error: "Invalid username or password" });
  }

  const sessionId = uuid();

  await db.insert(sessionTable).values({
    user_id: currentUser.id,
    id: sessionId,
    expires_at: dateToTimestamp(getDateDaysFromNow(7)),
  });

  const session = await getSession();

  session.set("sessionId", sessionId);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Login() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Login</h1>
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
            Login
          </button>
          <Link to="/signup" className="text-blue-500">
            Sign up instead
          </Link>
        </div>
      </Form>
    </div>
  );
}
