import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Book" },
    {
      name: "Remix book. Simple social media.",
      content: "Welcome Remix Book!",
    },
  ];
};

type PostProps = {
  username: string;
  content: string;
};

const Post = ({ username, content }: PostProps) => {
  return (
    <div className="p-5 rounded-md border mb-5">
      <div className="border-b pb-2 text-gray-400">{username}</div>
      <div className="py-5">{content}</div>
    </div>
  );
};

const PostInput = () => {
  return (
    <div className="flex flex-col mb-5">
      <textarea
        className="border-b border-gray-600 p-1 block mb-3 resize-none"
        placeholder="Say something"
        rows={1}
      />
      <button className="text-white bg-green-500 hover:bg-green-600 py-1 px-4 rounded-lg ml-auto">
        Send
      </button>
    </div>
  );
};

export default function Index() {
  return (
    <div>
      <PostInput />
      {new Array(3).fill("").map((_, i) => (
        <Post key={i} username="logan" content="hot take. trump. ugh." />
      ))}
    </div>
  );
}
