import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { LoaderFunctionArgs } from "react-router";
import { useState, useEffect } from "react";
import { requireUserSession } from "~/utils/requireUserSession";
import { Post } from "./components/Post";
import { InfiniteScroller } from "~/components/InfinateScroller";
import { Spinner } from "~/components/Spinner";
import { PostInput } from "./components/PostInput";
import { PostService } from "~/services/Post.service";
import { createPost } from "./actions/createPost";
import { deletePost } from "./actions/deletePost";

export const meta: MetaFunction = () => {
  return [
    { title: "Social Media App" },
    {
      name: "Social Media App",
      content: "Simple social media app built with Remix",
    },
  ];
};

export enum Intent {
  CreatePost = "CREATE_POST",
  DeletePost = "DELETE_POST",
}

export async function action({ request }: ActionFunctionArgs) {
  const intent = (await request.clone().formData()).get("intent");

  switch (intent) {
    case Intent.CreatePost: {
      return await createPost(request);
    }
    case Intent.DeletePost: {
      return await deletePost(request);
    }
    default:
      return json({ error: "Invalid intent" });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireUserSession(request);

  const searchParams = new URL(request.url).searchParams;

  const page = Number(searchParams.get("page") ?? 1);

  const pageSize = Number(searchParams.get("pageSize") ?? 10);

  const posts = await new PostService().getUserNewsFeedPage(
    user.id,
    page,
    pageSize
  );

  return json({ posts, page, pageSize, user });
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export default function Index() {
  const { posts: initialPosts, user } = useLoaderData<typeof loader>();

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
