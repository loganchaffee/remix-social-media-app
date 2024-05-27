import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";
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
import { useToast } from "~/contexts/ToastContext";
import { isDefined } from "~/utils/isDefined";

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

  console.log(user);
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

export default function Index() {
  const { posts: initialPosts } = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  const [posts, setPosts] = useState<typeof initialPosts>(initialPosts);

  const fetcher = useFetcher<typeof loader>();

  const toast = useToast();

  // Update posts when loader data is revalidiated
  useEffect(() => {
    setPosts((prev) => {
      const prevWithoutTempoary = prev.filter(
        (post) => !post.id.includes("temporary")
      );

      const newPosts = [...initialPosts, ...prevWithoutTempoary];

      const uniquePosts = Array.from(new Set(newPosts.map((post) => post.id)))
        .map((id) => newPosts.find((post) => post.id === id))
        .filter(isDefined);

      return uniquePosts;
    });
  }, [initialPosts]);

  // Fetch next page of results
  function loadNextPage() {
    const nextPage = fetcher.data ? fetcher.data.page + 1 : 2;

    fetcher.load(`?index&page=${nextPage}`);
  }

  // Insert next page of results into state
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

  // Toast notifcations for errors
  useEffect(() => {
    if (actionData && "error" in actionData) {
      toast(actionData.error);
    }
  }, [actionData, toast]);

  // Optomistic delete
  function deletePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  // Optomistic create
  const addPost = (post: (typeof posts)[0]) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">News Feed</h1>
      <PostInput addPost={addPost} />
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
