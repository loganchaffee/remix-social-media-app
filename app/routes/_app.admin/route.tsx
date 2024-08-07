import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";
import { requireUserSession } from "~/utils/requireUserSession";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { TextInput } from "~/components/TextInput";
import { UserService } from "~/services/User.service";
import { handleErrorResponse } from "~/utils/handleError";
import { getIntent } from "~/utils/getIntent";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { deleteSession } from "./actions/deleteSession";
import { deleteUser } from "./actions/deleteUser";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

enum Intent {
  DELETE_SESSION = "DeleteSession",
  DELETE_USER = "DeleteUser",
}

export async function action(args: LoaderFunctionArgs) {
  const intent = await getIntent(args);

  switch (intent) {
    case Intent.DELETE_SESSION:
      return deleteSession(args);
    case Intent.DELETE_USER:
      return deleteUser(args);
    default:
      return handleErrorResponse(new Error("Invalid intent"));
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireUserSession(request, {
    isAdminRoute: true,
  });

  const searchParams = new URL(request.url).searchParams;

  const searchQuery = searchParams.get("username") ?? "";

  const page = Number(searchParams.get("page") ?? 1);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const { users, count } = await UserService.adminSearchUsers({
    searchQuery,
    page,
    pageSize,
    currentUserId: user.id,
  });

  const pages = Math.ceil(count / pageSize);

  return json({ users, searchQuery, pages, page });
}

export default function AdminUsersRoute() {
  const { users, searchQuery, pages, page } = useLoaderData<typeof loader>();

  const [value, setValue] = useState(searchQuery);

  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );

  const [stagedForDeletion, setStagedForDeletion] = useState(false);

  // Sync search query with URL
  useEffect(() => {
    setValue(searchQuery);
  }, [searchQuery]);

  // Sync selected user state with loader data
  useEffect(() => {
    const updatedSelectedUser = users.find(
      (user) => user.id === selectedUser?.id
    );

    if (updatedSelectedUser) {
      setSelectedUser(updatedSelectedUser);
    } else {
      setStagedForDeletion(false);
      setSelectedUser(null);
    }
  }, [users, selectedUser?.id, setSelectedUser]);

  const submit = useSubmit();

  function handleDeleteUser() {
    if (selectedUser) {
      submit(
        {
          userId: selectedUser.id,
          intent: Intent.DELETE_USER,
        },
        { method: "post" }
      );
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold max-sm:text-3xl">Manage Users</h1>

        <Link to="/" className="text-blue-500">
          Back Home
        </Link>
      </div>

      <Form
        onChange={(event) => submit(event.currentTarget)}
        className="flex flex-wrap justify-between items-center gap-3 mb-10"
      >
        <div className="flex items-center flex-1 min-w-52">
          <MagnifyingGlassIcon className="size-6 text-gray-500 mr-3" />
          <TextInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            name="username"
            placeholder="Search for users"
          />
        </div>

        <div className="flex items-center gap-3 mx-auto">
          <Button
            className="w-24"
            type="button"
            onClick={() => submit({ username: value, page: page - 1 })}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>
            Page {page} of {pages}
          </span>
          <Button
            className="w-24"
            type="button"
            onClick={() => submit({ username: value, page: page + 1 })}
            disabled={page >= pages}
          >
            Next
          </Button>
        </div>
      </Form>

      <div className="border rounded overflow-hidden mb-5">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th />
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap max-sm:hidden">
                  {dayjs(user.createdAt).format("M/D/YY")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-between items-center gap-3">
                  {user.isAdmin ? "Admin" : "User"}
                </td>
                <td>
                  <Button onClick={() => setSelectedUser(user)}>
                    <PencilSquareIcon className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={selectedUser?.username ?? ""}
        isOpen={!!selectedUser && !stagedForDeletion}
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <div>
            <table className="w-full mb-5">
              <tbody>
                <tr className="border-b border-dashed">
                  <td className="pr-3 py-1">Joined</td>
                  <td className="pl-3 py-1 text-end">
                    {dayjs(selectedUser.createdAt).format("M/D/YY")}
                  </td>
                </tr>
                <tr className="border-b border-dashed">
                  <td className="pr-3 py-1">Role</td>
                  <td className="pl-3 py-1 text-end">
                    {selectedUser.isAdmin ? "Admin" : "User"}
                  </td>
                </tr>
                <tr>
                  <td className="pr-3 py-1">Sessions:</td>
                </tr>
                <tr>
                  <td>
                    {selectedUser.sessions.length === 0 && (
                      <p className="mb-1 text-gray-500">No active sessions</p>
                    )}
                  </td>
                </tr>
                {selectedUser.sessions.map((session, i) => {
                  return (
                    <tr key={session.id}>
                      <td className="pr-3 py-1 w-full">
                        <p>
                          <span className="mr-3">{i + 1}.</span>
                          {dayjs(session.createdAt).format("M/D/YY")}
                        </p>
                      </td>
                      <td className="text-end">
                        <Form method="post">
                          <input
                            hidden
                            readOnly
                            name="sessionId"
                            value={session.id}
                          />
                          <button
                            name="intent"
                            value={Intent.DELETE_SESSION}
                            className="border border-gray-300 text-gray-300 rounded px-3 py-1 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </Form>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-b border-dashed">
                  <td></td>
                </tr>
              </tbody>
            </table>
            <Button variant="red" onClick={() => setStagedForDeletion(true)}>
              Delete User
            </Button>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        title="Are you sure you want to delete this user?"
        isOpen={stagedForDeletion}
        confirmButtonVariant="red"
        onConfirm={handleDeleteUser}
        onCancel={() => setStagedForDeletion(false)}
      />
    </>
  );
}
