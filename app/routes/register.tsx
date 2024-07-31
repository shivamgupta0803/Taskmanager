import { useActionData, useNavigate, useRouteError } from "@remix-run/react";
import React, { useState } from "react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import { Link } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const user = await authenticator.isAuthenticated(request, {
//     successRedirect: "/",
//   });
//   return user;
// };

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const name = form.get("name") as string;
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  const user = await db.user.count({
    where: {
      username,
    },
  });

  if (user) {
    return { error: "user already exists" };
  } else {
    const hashedPass = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        username,
        pass: hashedPass,
      },
    });

    return redirect('/login')
  }
}

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-center font-semibold text-2xl mb-3">Register</h1>
      <form method="POST" className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-72">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            placeholder="Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            name="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            placeholder="Username"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-black w-full rounded-lg py-2 px-4 text-white font-semibold focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
      <p className="text-center text-gray-700 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-black">Login</Link>
      </p>
    </div>
  );
};

export default Register;
