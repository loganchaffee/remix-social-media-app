import { Form, Link } from "@remix-run/react";

export default function Profile() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Search</h1>
      <Form>
        <input
          className="border-b mb-10 block w-full p-1"
          placeholder="Search for users"
        />
      </Form>
      {new Array(3).fill("").map((_, i) => (
        <Link
          to="/user/logan"
          key={i}
          className="block border p-5 rounded-md mb-5"
        >
          logan
        </Link>
      ))}
    </div>
  );
}
