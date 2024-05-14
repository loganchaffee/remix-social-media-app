import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Post } from "./post";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { db } from "~/db";
import { post, user } from "drizzle/schema";
import { v4 as uuid } from "uuid";
import { authenticateUser } from "~/utils/authenticateUser";
import { LoaderFunctionArgs } from "react-router";
import { desc, eq } from "drizzle-orm";
import { useState, useRef, useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Book" },
    {
      name: "Remix book. Simple social media.",
      content: "Welcome Remix Book!",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const content = formData.get("content");

  const user = await authenticateUser(request);

  if (!user) {
    return redirect("/login");
  }

  if (typeof content !== "string" || !content) {
    return json({ error: "Invalid content" });
  }

  const postId = uuid();

  await db.insert(post).values({
    user_id: user.id,
    id: postId,
    content,
  });

  return json({ postId });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUser = await authenticateUser(request);

  if (!currentUser) {
    return redirect("/login");
  }

  const postData = await db
    .select()
    .from(post)
    .where(eq(post.user_id, currentUser.id))
    .leftJoin(user, eq(post.user_id, user.id))
    .orderBy(desc(post.created_at))
    .execute();

  return json({ postData });
}

export default function Index() {
  const { postData } = useLoaderData<typeof loader>();

  const [value, setValue] = useState("");

  const fetcher = useFetcher();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <div>
      <fetcher.Form method="post" onSubmit={() => setValue("")}>
        <div className="flex flex-col mb-5">
          <textarea
            ref={inputRef}
            name="content"
            className="border-b p-1 block mb-3 resize-none overflow-hidden"
            placeholder="Say something"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="text-white bg-blue-500 hover:bg-blue-600 py-1 px-4 rounded-lg ml-auto">
            Send
          </button>
        </div>
      </fetcher.Form>
      {postData.map(({ post, user }, i) => (
        <Post
          key={i}
          username={user?.username ?? ""}
          content={post.content}
          createdAt={post.created_at ?? ""}
        />
      ))}
    </div>
  );
}
