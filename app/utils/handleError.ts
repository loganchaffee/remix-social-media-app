import { json } from "@remix-run/node";
import { ensureError } from "./ensureError";

export function handleErrorResponse(value: unknown, message?: string) {
  const error = ensureError(value);

  console.error(error.message);

  return json(
    {
      error: message ?? error.message,
    },
    { status: 500 }
  );
}
