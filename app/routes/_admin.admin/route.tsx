import { Outlet, json } from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { requireUserSession } from "~/utils/requireUserSession";
import { commitSession } from "~/sessions";
import { AdminSideNav } from "./components/AdminSideNav";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, session } = await requireUserSession(request);

  return json(
    { user },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function AdminRoute() {
  return (
    <div className="flex">
      <AdminSideNav />
      <div className="h-fit p-5">
        <Outlet />
      </div>
    </div>
  );
}
