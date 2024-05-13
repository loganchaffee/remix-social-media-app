import { Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { Navbar } from "~/components/NavBar";
import { getSession } from "~/sessions";
import { db } from "~/db";
import { user } from "drizzle/schema";
import { eq } from "drizzle-orm";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const userId = session.get("userId");

  if (!userId) {
    return redirect("/login");
  }

  const [currentUser] = db.select().from(user).where(eq(user.id, userId));

  return json({
    user: currentUser,
  });
}

export default function AppRoute() {
  return (
    <>
      <Navbar username="logan" />
      <div className="p-6">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </>
  );
}
