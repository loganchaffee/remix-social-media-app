import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/Button";
import { Intent, loader } from "../route";
import { v4 as uuid } from "uuid";
import { useRouteData } from "~/hooks/useRouteData";
import { dateToDatetime } from "~/utils/dateToDateTime";

type Props = {
  addPost: (post: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    authorUsername: string | null;
  }) => void;
};

export function PostInput({ addPost }: Props) {
  const { user } = useRouteData<typeof loader>("routes/_app._index");

  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [value]);

  function handleSubmit() {
    setValue("");

    addPost({
      id: `temporary_${uuid()}`,
      content: value,
      authorId: user.id,
      authorUsername: user.username,
      createdAt: dateToDatetime(new Date()),
      updatedAt: dateToDatetime(new Date()),
    });
  }

  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div className="flex flex-col mb-5 border rounded p-3 bg-gray-100">
        <textarea
          ref={inputRef}
          name="content"
          className="border p-1 block mb-3 resize-none overflow-hidden rounded min-h-12"
          placeholder="Say something"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button
          disabled={!value}
          name="intent"
          value={Intent.CreatePost}
          className="ml-auto"
        >
          Post
        </Button>
      </div>
    </Form>
  );
}
