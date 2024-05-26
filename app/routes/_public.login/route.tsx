import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { db } from "~/db";
import { commitSession, getSession } from "~/sessions";
import argon2 from "argon2";
import { useEffect } from "react";
import { useToast } from "~/contexts/ToastContext";

export async function action({ request }: ActionFunctionArgs) {
  try {
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
      .where(eq(user.username, username));

    if (!currentUser) {
      return json({ error: "Invalid username or password" });
    }

    const isPasswordMatch = await argon2.verify(currentUser.password, password);

    if (!isPasswordMatch) {
      return json({ error: "Invalid username or password" });
    }

    // Create new session object and add user id which create session in DB
    const session = await getSession();
    session.set("userId", currentUser.id);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: "Something went wrong" });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  const { toast } = useToast();

  useEffect(() => {
    const error = actionData?.error;

    if (error) {
      toast(error);
    }
  }, [actionData, toast]);

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
          <Link to="/signup" className="text-blue-500">
            Sign up instead
          </Link>
          <button className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-lg">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
}
