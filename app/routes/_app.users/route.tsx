import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { redirect, json, LoaderFunctionArgs } from "@remix-run/node";
import { follow, user } from "drizzle/schema";
import { db } from "~/db";
import { and, count, eq, like } from "drizzle-orm";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { requireUserSession } from "~/utils/requireUserSession";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user: currentUser } = await requireUserSession(request);

  const searchParams = new URL(request.url).searchParams;

  const searchQuery = searchParams.get("username") ?? "";

  const page = Number(searchParams.get("page") ?? 1);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const users = await db
    .select({ username: user.username, id: user.username, followId: follow.id })
    .from(user)
    .leftJoin(
      follow,
      and(eq(follow.follower, currentUser.id), eq(follow.followee, user.id))
    )
    .where(like(user.username, `%${searchQuery}%`))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(user.username)
    .execute();

  const [userCount] = await db
    .select({ userCount: count() })
    .from(user)
    .where(like(user.username, `%${searchQuery}%`))
    .execute();

  const pages = Math.ceil(userCount.userCount / pageSize);

  return json({ users, searchQuery, pages, page });
}

export default function Profile() {
  const { users, searchQuery, pages, page } = useLoaderData<typeof loader>();

  const [value, setValue] = useState(searchQuery);

  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  const submit = useSubmit();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Search Users</h1>
      <Form onChange={(event) => submit(event.currentTarget)}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="username"
          placeholder="Search for users"
          className="border-b mb-10 block w-full p-1"
        />
      </Form>
      {users.map((user) => (
        <Link
          to={`/user/${user.username}`}
          key={user.id}
          className="flex justify-between items-center border-b p-3 pb-5 hover:bg-gray-100"
        >
          <span>{user.username}</span>
          {user.followId && (
            <span className="ml-3 text-gray-300 text-sm">Following</span>
          )}
        </Link>
      ))}
      <div className="mb-5" />
      <div className="flex justify-center align-center gap-3">
        <Button
          onClick={() => submit({ username: value, page: page - 1 })}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {pages}
        </span>
        <Button
          onClick={() => submit({ username: value, page: page + 1 })}
          disabled={page >= pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
