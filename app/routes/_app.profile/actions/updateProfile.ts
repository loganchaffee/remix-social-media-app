import { ActionFunctionArgs, json } from "@remix-run/node";
import { UserService } from "~/services/User.service";
import { requireUserSession } from "~/utils/requireUserSession";

export async function updateProfile({ request }: ActionFunctionArgs) {
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
    await UserService.updateUser(user.id, { username, bio });

    // Alert user for success
    return json({ message: "Successfully updated profile" });
  } catch (error) {
    return json({ error: "Something went wrong" });
  }
}
