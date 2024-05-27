import { Form } from "@remix-run/react";
import dayjs from "dayjs";
import { useRouteData } from "~/hooks/useRouteData";
import { loader as appLoader } from "~/routes/_app/route";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Intent } from "../route";

type Props = {
  post: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    authorUsername: string | null;
  };
  deletePost: (id: string) => void;
};

export const Post = ({ post, deletePost }: Props) => {
  const { user } = useRouteData<typeof appLoader>("routes/_app");

  return (
    <div className="p-5 rounded-md border mb-5">
      <div className="flex justify-between border-b py-2">
        <div className="text-gray-400">{post.authorUsername}</div>
        {post.authorId === user.id && (
          <Form method="delete" onSubmit={() => deletePost(post.id)}>
            <input hidden readOnly name="id" value={post.id} />
            <button
              name="intent"
              value={Intent.DeletePost}
              className="border border-gray-300 text-gray-300 rounded px-3 py-1 hover:text-white hover:bg-red-500 hover:border-red-500 transition-colors"
            >
              <TrashIcon className="size-4" />
            </button>
          </Form>
        )}
      </div>
      <div className="py-5">{post.content}</div>
      <div className="text-xs text-end text-gray-400">
        {dayjs(post.createdAt).format("MMMM D, YYYY h:mm A")}
      </div>
    </div>
  );
};
