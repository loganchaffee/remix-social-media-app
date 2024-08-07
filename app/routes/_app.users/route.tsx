import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { requireUserSession } from "~/utils/requireUserSession";
import { UserService } from "~/services/User.service";
import { TextInput } from "~/components/TextInput";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireUserSession(request);

  const searchParams = new URL(request.url).searchParams;

  const searchQuery = searchParams.get("username") ?? "";

  const page = Number(searchParams.get("page") ?? 1);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const { users, count } = await UserService.searchUsers({
    searchQuery,
    page,
    pageSize,
    currentUserId: user.id,
  });

  const pages = Math.ceil(count / pageSize);

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
      <Form
        onChange={(event) => submit(event.currentTarget)}
        className="flex items-center mb-10 border-1"
      >
        <MagnifyingGlassIcon className="size-6 mr-3 text-gray-500" />
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="username"
          placeholder="Search for users"
        />
      </Form>
      {users.map((user) => (
        <Link
          to={`/user/${user.username}`}
          key={user.id}
          className="flex justify-between items-center border-b p-3 pb-5 hover:bg-gray-100"
        >
          <span>{user.username}</span>
          {user.isFollowed && (
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
