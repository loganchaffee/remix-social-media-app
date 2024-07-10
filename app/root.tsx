import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { ToastNotification, ToastProvider } from "./contexts/ToastContext";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="w-screen overflow-x-hidden">
        <ToastProvider>
          <ToastNotification />

          <Outlet />
        </ToastProvider>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);

  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="w-screen h-screen flex flex-col justify-center items-center">
          <h1 className="text-2xl">Something went wrong</h1>
          <Link
            className="text-center text-blue-500 underline hover:text-blue-400"
            to="/"
          >
            Go Back
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
