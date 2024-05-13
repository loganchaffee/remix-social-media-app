import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { user } from "drizzle/schema";
import { db } from "~/db";
import { commitSession, getSession } from "~/sessions";

export async function action({ request }: ActionFunctionArgs) {
  // const form = await request.formData();
  // const username = form.get("username");
  // const password = form.get("password");

  // const existingSession = await getSession(request.headers.get("Cookie"));

  // if (existingSession.has("userId")) {
  //   console.log("we already have a session", existingSession.data);
  // }

  const [currentUser] = await db.select().from(user).where(eq(user.id, "1"));

  const session = await getSession(request.headers.get("Cookie"));

  session.set("userId", currentUser.id);

  return redirect("/login", {
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
          Login
        </button>
      </Form>
    </div>
  );
}
