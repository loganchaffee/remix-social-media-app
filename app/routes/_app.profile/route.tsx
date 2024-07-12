import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { Spinner } from "~/components/Spinner";
import { TextInput } from "~/components/TextInput";
import { useToast } from "~/contexts/ToastContext";
import { UserService } from "~/services/User.service";
import { getIntent } from "~/utils/getIntent";
import { requireUserSession } from "~/utils/requireUserSession";
import { updateProfile } from "./actions/updateProfile";
import { handleErrorResponse } from "~/utils/handleError";
import { deleteProfile } from "./actions/deleteProfile";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireUserSession(request);

  return json({ user });
}

export enum Intent {
  UpdateProfile = "CREATE_PROFILE",
  DeleteProfile = "DELETE_PROFILE",
}

export async function action(args: ActionFunctionArgs) {
  const intent = await getIntent(args);

  switch (intent) {
    case Intent.UpdateProfile:
      return updateProfile(args);
    case Intent.DeleteProfile:
      return deleteProfile(args);
    default:
      return handleErrorResponse(new Error("Invalid intent"));
  }
}

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const submit = useSubmit();

  const toast = useToast();

  const [formValues, setFormValues] = useState({
    username: user.username,
    bio: user.bio ?? "",
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeleteProfile = () => {
    submit({ intent: Intent.DeleteProfile }, { method: "post" });
  };

  useEffect(() => {
    setFormValues({ username: user.username, bio: user.bio ?? "" });
  }, [user]);

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
        <div className="flex justify-between">
          {isUpdating ? (
            <Spinner />
          ) : (
            <Button
              name="intent"
              value={Intent.UpdateProfile}
              className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-lg mr-3 w-20 flex justify-center"
            >
              Save
            </Button>
          )}

          <Button
            type="button"
            variant="red"
            onClick={() => setIsConfirming(true)}
          >
            Delete Profile
          </Button>
        </div>
      </Form>

      <ConfirmationModal
        title="Are you sure you want to delete you profile?"
        isOpen={isConfirming}
        onConfirm={handleDeleteProfile}
        onCancel={() => setIsConfirming(false)}
        confirmButtonVariant="red"
      />
    </div>
  );
}
