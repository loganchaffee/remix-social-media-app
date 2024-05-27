import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "~/sessions";
import { useToast } from "~/contexts/ToastContext";
import { useEffect } from "react";
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
    // Create new user
    const user = await new UserService().createUser(username, password);

    // Create new session
    const session = await getSession();
    session.set("userId", user.id);

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
      <h1 className="text-4xl font-bold mb-10">Sign Up</h1>
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
