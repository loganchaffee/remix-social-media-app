import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { db } from "~/db";
import { follow, post, user } from "drizzle/schema";
import { LoaderFunctionArgs } from "react-router";
import { useState, useEffect } from "react";
import { requireUserSession } from "~/utils/requireUserSession";
import { desc, eq, or } from "drizzle-orm";
import { Post } from "./components/Post";
import { union } from "drizzle-orm/mysql-core";
import { InfiniteScroller } from "~/components/InfinateScroller";
import { Spinner } from "~/components/Spinner";
import { PostInput } from "./components/PostInput";
import { createPost, deletePost } from "./actions";
import { commitSession } from "~/sessions";

export const meta: MetaFunction = () => {
  return [
    { title: "Social Media App" },
    {
      name: "Social Media App",
      content: "Simple social media app built with Remix",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const intent = (await request.clone().formData()).get("intent");

  switch (intent) {
    case "createPost": {
      return await createPost(request);
    }
    case "deletePost": {
      return await deletePost(request);
    }
    default:
      return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, user: currentUser } = await requireUserSession(request);

  const searchParams = new URL(request.url).searchParams;

  const page = Number(searchParams.get("page") ?? 1);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const posts = await union(
    // Posts from those the user follows
    db
      .select({
        id: post.id,
        content: post.content,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        authorId: post.user_id,
        authorUsername: user.username,
      })
      .from(post)
      .leftJoin(user, eq(post.user_id, user.id))
      .innerJoin(follow, eq(follow.followee, post.user_id))
      .where(
        or(
          eq(follow.follower, currentUser.id)
          // eq(post.user_id, currentUser.id)
        )
      ),
    // User's own posts
    db
      .select({
        id: post.id,
        content: post.content,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        authorId: post.user_id,
        authorUsername: user.username,
      })
      .from(post)
      .leftJoin(user, eq(post.user_id, user.id))
      .where(eq(post.user_id, currentUser.id))
  )
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(desc(post.created_at));

  return json(
    { posts, page, pageSize, user: currentUser },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export default function Index() {
  const { posts: initialPosts } = useLoaderData<typeof loader>();

  const [posts, setPosts] = useState<typeof initialPosts>(initialPosts);

  useEffect(() => {
    setPosts((prev) => {
      const newPosts = [...initialPosts, ...prev];

      const uniquePosts = Array.from(new Set(newPosts.map((post) => post.id)))
        .map((id) => newPosts.find((post) => post.id === id))
        .filter(isDefined);

      return uniquePosts;
    });
  }, [initialPosts]);

  const fetcher = useFetcher<typeof loader>();

  function loadNextPage() {
    const nextPage = fetcher.data ? fetcher.data.page + 1 : 2;

    fetcher.load(`?index&page=${nextPage}`);
  }

  useEffect(() => {
    if (fetcher?.data?.posts) {
      const nextPageOfPosts = fetcher.data.posts;

      setPosts((prev) => {
        const newPosts = [...prev, ...nextPageOfPosts];

        const uniquePosts = Array.from(new Set(newPosts.map((post) => post.id)))
          .map((id) => newPosts.find((post) => post.id === id))
          .filter(isDefined);

        return uniquePosts;
      });
    }
  }, [fetcher?.data?.posts]);

  function deletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">News Feed</h1>
      <PostInput />
      <InfiniteScroller
        loading={fetcher.state === "loading"}
        loadNext={loadNextPage}
      >
        {posts.map((post) => (
          <Post key={post.id} post={post} deletePost={deletePost} />
        ))}
      </InfiniteScroller>
      {fetcher.state === "loading" && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
