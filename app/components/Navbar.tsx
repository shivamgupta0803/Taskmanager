import { Link, useLoaderData, useNavigate } from "@remix-run/react";

export default function Layout({ user }: { user: any }) {
  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const selectedValue = event.target.value;
    if (selectedValue === "logout") {
      navigate("/logout");
    } else {
      return user;
    }
  };

  return (
    <div>
      {user ? (
        <nav className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white font-bold text-xl">
              MyApp
            </Link>
            <Link
              to="/posts"
              className="text-white font-semibold text-lg text-center hover:underline"
            >
              Add a Post
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">
                Welcome! <u> {user.name} </u>
              </span>
              <select
                id="userDropdown"
                className="bg-white text-gray-700 px-3 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                onChange={handleChange}
              >
                <option value="Profile">
                  Profile {String.fromCodePoint(0x1f464)}
                </option>
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
                <option value="logout">
                  Logout {String.fromCodePoint(0x1f6aa)}
                </option>
              </select>
            </div>
          </div>
        </nav>
      ) : (
        <nav className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white font-bold text-xl">
              MyApp
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white bg-green-500 px-3 py-2 rounded-lg shadow-md hover:bg-green-600"
              >
                Login
              </Link>
              <span className="text-white mx-2">|</span>
              <Link
                to="/register"
                className="text-white bg-blue-500 px-3 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
