import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { and, eq } from "drizzle-orm";
import { follow, user as userTable } from "drizzle/schema";
import { useEffect, useState } from "react";
import { db } from "~/db";
import { requireUserSession } from "~/utils/requireUserSession";
import { v4 as uuid } from "uuid";
import { Button } from "~/components/Button";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!params.username) {
    return redirect("/users");
  }

  const { user } = await requireUserSession(request);

  const [visitedUser] = await db
    .select({
      id: userTable.id,
      username: userTable.username,
      bio: userTable.bio,
    })
    .from(userTable)
    .where(eq(userTable.username, params.username));

  if (visitedUser.id === user.id) {
    return redirect("/profile");
  }

  // User follows visited
  const [followingRelationship] = await db
    .select()
    .from(follow)
    .where(
      and(eq(follow.follower, user.id), eq(follow.followee, visitedUser.id))
    );

  // Visited follows user
  const [followedRelationship] = await db
    .select()
    .from(follow)
    .where(
      and(eq(follow.follower, visitedUser.id), eq(follow.followee, user.id))
    );

  return json({
    visitedUser,
    isFollowing: !!followingRelationship,
    isFollowedBy: !!followedRelationship,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.username) {
    return null;
  }

  const { user } = await requireUserSession(request);

  const [visitedUser] = await db
    .select({
      id: userTable.id,
      username: userTable.username,
      bio: userTable.bio,
    })
    .from(userTable)
    .where(eq(userTable.username, params.username));

  const formData = await request.formData();

  const shouldFollow = formData.get("follow") ? true : false;

  if (shouldFollow) {
    await db.insert(follow).values({
      follower: user.id,
      followee: visitedUser.id,
      id: uuid(),
    });
  } else {
    console.log("unfollow");
    await db
      .delete(follow)
      .where(
        and(eq(follow.follower, user.id), eq(follow.followee, visitedUser.id))
      );
  }

  return null;
}

export default function User() {
  const { visitedUser, isFollowing } = useLoaderData<typeof loader>();

  const [checked, setChecked] = useState(isFollowing);

  useEffect(() => {
    setChecked(isFollowing);
  }, [isFollowing]);

  const submit = useSubmit();

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">{visitedUser.username}</h1>

        <Form method="post" onChange={(e) => submit(e.currentTarget)}>
          <input
            hidden
            readOnly
            type="checkbox"
            id="follow"
            name="follow"
            checked={checked}
          />
          <Button onClick={() => setChecked((prev) => !prev)}>
            {checked ? "Unfollow" : "Follow"}
          </Button>
        </Form>
      </div>

      <h2 className="text-gray-500">Bio</h2>
      {visitedUser.bio ?? ""}
    </>
  );
}
