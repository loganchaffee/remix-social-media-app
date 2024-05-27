import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { Spinner } from "~/components/Spinner";
import { TextInput } from "~/components/TextInput";
import { useToast } from "~/contexts/ToastContext";
import { UserService } from "~/services/User.service";
import { requireUserSession } from "~/utils/requireUserSession";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireUserSession(request);

  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  // Authenticate user session
  const { user } = await requireUserSession(request);

  try {
    // Get form data
    const formData = await request.formData();
    const { username, bio } = Object.fromEntries(formData);

    // Validate form data
    if (typeof username !== "string" || !username) {
      return json({ message: "Please enter a valid username" });
    }
    if (typeof bio !== "string" && typeof bio !== "undefined") {
      return json({ message: "Please enter a valid bio" });
    }

    // Update user
    await new UserService().updateUser(user.id, { username, bio });

    // Alert user for success
    return json({ message: "Successfully updated profile" });
  } catch (error) {
    return json({ error: "Something went wrong" });
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

  const toast = useToast();

  useEffect(() => {
    if (actionData) {
      if ("message" in actionData) {
        toast(actionData.message);
      } else if ("error" in actionData) {
        toast(actionData.error);
      }
    }
  }, [actionData, toast]);

  const isUpdating = useNavigation().state === "submitting";

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
          {isUpdating ? (
            <Spinner />
          ) : (
            <Button className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-lg mr-3 w-20 flex justify-center">
              Save
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
