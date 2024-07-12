import { json } from "@remix-run/node";
import { ensureError } from "./ensureError";

export function handleErrorResponse(value: unknown) {
  const error = ensureError(value);

  console.error(error.message);

  return json(
    {
      error: error.message,
    },
    { status: 500 }
  );
}
