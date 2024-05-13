import { Link } from "@remix-run/react";

export const Navbar = ({ username }: { username: string }) => {
  return (
    <nav className="bg-gray-800 px-6">
      <div className="py-4  flex justify-between items-center container">
        <div className="flex items-center container gap-3">
          <Link
            to="/profile"
            className="text-white font-semibold text-lg hover:text-gray-300"
          >
            {username}
          </Link>
          <Link
            to="/"
            className="text-white font-semibold text-lg hover:text-gray-300"
          >
            Feed
          </Link>
          <Link
            to="/users"
            className="text-white font-semibold text-lg hover:text-gray-300"
          >
            Search
          </Link>
        </div>
        <button className="text-white bg-green-500 hover:bg-green-600 py-1 px-4 rounded-lg">
          Logout
        </button>
      </div>
    </nav>
  );
};
