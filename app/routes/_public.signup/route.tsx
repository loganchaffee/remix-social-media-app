import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { db } from "~/db";
import { commitSession, getSession } from "~/sessions";
import { v4 as uuid } from "uuid";
import argon2 from "argon2";

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
    throw new Response("You must enter a valid username and password.", {
      status: 500,
    });
  }

  const [duplicate] = await db
    .select()
    .from(user)
    .where(eq(user.username, username));

  if (duplicate) {
    throw new Response("That username is already taken.", { status: 500 });
  }

  const hashedPassword = await argon2.hash(password);

  const id = uuid();

  await db.insert(user).values({
    id,
    username,
    password: hashedPassword,
  });

  const session = await getSession();

  session.set("userId", id);

  console.log(session.data);

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
          className="border-b border-gray-600 mb-10 block w-full p-1"
          placeholder="Enter username"
        />
        <input
          name="password"
          className="border-b border-gray-600 mb-10 block w-full p-1"
          placeholder="Enter password"
        />
        <button className="text-white bg-green-500 hover:bg-green-600 py-1 px-4 rounded-lg">
          Signup
        </button>
      </Form>
    </div>
  );
}
