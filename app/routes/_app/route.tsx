import { Outlet, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { Navbar } from "~/components/NavBar";
import { authenticateUser } from "~/utils/authenticateUser";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticateUser(request);

  if (!user) {
    return redirect("/login");
  }

  return json({ user });
}

export default function AppRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <Navbar username={user.username} />
      <div className="p-6">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </>
  );
}
