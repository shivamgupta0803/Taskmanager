import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";


export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  return user;
};


export default function Index() {
  return (
    <>
      <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Welcome to MyApp
        </h1>
        <p className="text-center mt-4">
        This is an example of using <i className="bi bi-alarm"></i> Bootstrap Icons.
        <i className="bi bi-person-circle"></i>

        </p>
      </div>
    </>
  );
}
