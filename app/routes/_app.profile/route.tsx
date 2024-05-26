import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { post, user } from "drizzle/schema";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { TextInput } from "~/components/TextInput";
import { useToast } from "~/contexts/ToastContext";
import { db } from "~/db";
import { requireUserSession } from "~/utils/requireUserSession";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireUserSession(request);

  const posts = await db
    .select()
    .from(post)
    .where(eq(post.user_id, user.id))
    .limit(50);

  return json({ user, posts });
}

export async function action({ request }: ActionFunctionArgs) {
  const { user: currentUser } = await requireUserSession(request);

  try {
    const formData = await request.formData();

    const { username, bio } = Object.fromEntries(formData);

    if (typeof username !== "string" || !username) {
      return json({ message: "Please enter a valid username" });
    }

    if (typeof bio !== "string" && typeof bio !== "undefined") {
      return json({ message: "Please enter a valid bio" });
    }

    await db
      .update(user)
      .set({ username, bio })
      .where(eq(user.id, currentUser.id));

    return json({ message: "Successfully updated profile" });
  } catch (error) {
    return json({ message: "Something went wrong" });
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [formValues, setFormValues] = useState({
    username: user.username,
    bio: user.bio ?? "",
  });

  useEffect(() => {
    setFormValues({ username: user.username, bio: user.bio ?? "" });
  }, [user]);

  const { toast } = useToast();

  useEffect(() => {
    actionData?.message && toast(actionData.message);
  }, [actionData, toast]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Profile</h1>
      <Form method="post">
        <label className="text-gray-500" htmlFor="username">
          Username
        </label>
        <TextInput
          type="text"
          name="username"
          className="mb-10"
          value={formValues.username}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, username: e.target.value }))
          }
        />
        <label className="text-gray-500" htmlFor="username">
          Bio
        </label>
        <TextInput
          name="bio"
          className="mb-10"
          value={formValues.bio}
          onChange={(e) =>
            setFormValues((prev) => ({ ...prev, bio: e.target.value }))
          }
        />
        <div className="flex">
          <Button className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-lg mr-3">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}
