import { Form } from "@remix-run/react";

export default function Profile() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-10">Profile</h1>
      <Form>
        <input className="border-b border-gray-600 mb-10 block w-full p-1" />
        <input
          className="border-b border-gray-600 mb-10 block w-full p-1"
          type="password"
        />
        <button className="text-white bg-green-500 hover:bg-green-600 py-1 px-4 rounded-lg">
          Save
        </button>
      </Form>
    </div>
  );
}
