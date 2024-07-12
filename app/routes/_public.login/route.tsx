import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";
import argon2 from "argon2";
import { useEffect } from "react";
import { useToast } from "~/contexts/ToastContext";
import { UserService } from "~/services/User.service";

export async function action({ request }: ActionFunctionArgs) {
  // Get form data
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");

  // Validate form data
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username ||
    !password
  ) {
    return json({ error: "Invalid username or password" });
  }

  try {
    // Get exiting user
    const currentUser = await UserService.getUserByUsername(username, {
      includePassword: true,
    });

    // Check if passwords match
    const isPasswordMatch = await argon2.verify(currentUser.password, password);

    if (!isPasswordMatch) {
      return json({ error: "Invalid username or password" });
    }

    // Create a new session
    const session = await getSession();

    session.set("userId", currentUser.id);

    return redirect("/", {
      headers: {
        // Set cookie and create session in DB
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);

    return json({ error: "Something went wrong. Please Try again later." });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  const toast = useToast();

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
          type="password"
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
