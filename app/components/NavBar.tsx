import {
  UserIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Form, Link } from "@remix-run/react";

export const Navbar = () => {
  return (
    <nav className="bg-gray-100 px-6 sticky top-0 z-10">
      <div className="py-4 flex justify-between items-center container max-w-[40rem]">
        <div className="flex items-center container gap-3 ">
          <Link
            to="/"
            className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1"
          >
            <NewspaperIcon className="size-6" />
            <span className="max-sm:hidden">Feed</span>
          </Link>
          <Link
            to="/profile"
            className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1"
          >
            <UserIcon className="size-6" />
            <span className="max-sm:hidden">Profile</span>
          </Link>
          <Link
            to="/users"
            className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1"
          >
            <MagnifyingGlassIcon className="size-6" />
            <span className="max-sm:hidden">Search Users</span>
          </Link>
        </div>
        <Form method="post" action="/logout">
          <button className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1">
            Logout
          </button>
        </Form>
      </div>
    </nav>
  );
};
