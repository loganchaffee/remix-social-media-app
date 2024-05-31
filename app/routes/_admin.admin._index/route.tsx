import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/Button";
import { Modal } from "~/components/Modal";
import { TextInput } from "~/components/TextInput";
import { UserService } from "~/services/User.service";
import { handleErrorResponse } from "~/utils/handleError";
import { requireUserSession } from "~/utils/requireUserSession";
import { deleteSession } from "./actions/deleteSession";
import { getIntent } from "~/utils/getIntent";
import { ConfirmationModal } from "~/components/ConfirmationModal";
import { deleteUser } from "./actions/deleteUser";

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
  const { user } = await requireUserSession(request);

  const searchParams = new URL(request.url).searchParams;

  const searchQuery = searchParams.get("username") ?? "";

  const page = Number(searchParams.get("page") ?? 1);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const { users, count } = await new UserService().adminSearchUsers({
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
        { userId: selectedUser.id, intent: Intent.DELETE_USER },
        { method: "post" }
      );
    }
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-10">Users</h1>

      <Form onChange={(event) => submit(event.currentTarget)}>
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="username"
          placeholder="Search for users"
        />
      </Form>

      <div className="border rounded overflow-hidden mb-5">
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sessions
              </th>
              <th />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayjs(user.createdAt).format("M/D/YY")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-between items-center gap-3">
                  {user.sessions.length} Active
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

      <Modal
        title={selectedUser?.username ?? ""}
        isOpen={!!selectedUser && !stagedForDeletion}
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser && (
          <div>
            {selectedUser.sessions.length > 0 && (
              <p className="mb-3">Sessions:</p>
            )}
            {selectedUser.sessions.map((session, i) => {
              return (
                <div
                  key={session.id}
                  className="mb-3 flex justify-between items-center"
                >
                  <p>
                    <span className="mr-3">{i + 1}.</span>
                    {dayjs(session.createdAt).format("M/D/YY")}
                  </p>
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
                </div>
              );
            })}
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
