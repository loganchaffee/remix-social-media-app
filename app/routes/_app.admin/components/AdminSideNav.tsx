import { Link } from "@remix-run/react";

export function AdminSideNav() {
  return (
    <nav className="p-3 bg-gray-100 h-screen flex flex-col w-fit">
      <Link
        to="/"
        className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1"
      >
        <span className="max-sm:hidden">Feed</span>
      </Link>
      <Link
        to="/profile"
        className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1"
      >
        <span className="max-sm:hidden">Profile</span>
      </Link>
      <Link
        to="/users"
        className="text-gray-500 font-semibold text-lg hover:text-gray-600 flex gap-1"
      >
        <span className="max-sm:hidden">Search Users</span>
      </Link>
    </nav>
  );
}
