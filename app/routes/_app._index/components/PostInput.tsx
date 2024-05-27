import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/Button";
import { Intent } from "../route";

export function PostInput() {
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [value]);

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
        <Button name="intent" value={Intent.CreatePost} className="ml-auto">
          Post
        </Button>
      </div>
    </Form>
  );
}
