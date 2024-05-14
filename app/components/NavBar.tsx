import { Form, Link } from "@remix-run/react";

export const Navbar = ({ username }: { username: string }) => {
  return (
    <nav className="bg-gray-300 px-6">
      <div className="py-4 flex justify-between items-center container">
        <div className="flex items-center container gap-3">
          <Link
            to="/profile"
            className="text-gray-500 font-semibold text-lg hover:text-gray-600"
          >
            {username}
          </Link>
          <Link
            to="/"
            className="text-gray-500 font-semibold text-lg hover:text-gray-600"
          >
            Feed
          </Link>
          <Link
            to="/users"
            className="text-gray-500 font-semibold text-lg hover:text-gray-600"
          >
            Search
          </Link>
        </div>
        <Form method="post" action="/logout">
          <button className="bg-blue-500 text-white hover:bg-blue-600 py-1 px-4 rounded-lg">
            Logout
          </button>
        </Form>
      </div>
    </nav>
  );
};
