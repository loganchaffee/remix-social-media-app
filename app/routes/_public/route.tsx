import { Outlet } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function AppRoute() {
  return (
    <div className="p-6">
      <div className="container relative max-w-[40rem]">
        <h1 className="text-4xl font-bold mb-5">Remix Social Media App</h1>
        <h1 className="text-2xl font-bold mb-10 text-gray-500">
          Simple social media app built with Remix
        </h1>
        <Outlet />
      </div>
    </div>
  );
}
