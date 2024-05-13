import { Outlet } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function AppRoute() {
  return (
    <div className="p-6">
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
