import React, { useEffect, useState } from "react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";

import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className=" font-bold text-5xl text-red-700">
          {error.status} {error.statusText}
        </h1>
        <p className="font-semibold text-xl">{error.data.message}</p>
        <Link to={"/login"} className="text-semibold">
          try again
        </Link>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return user;
};

export const action: ActionFunction = async ({ request }) => {
  const user = authenticator.authenticate("form", request, {
    successRedirect: "/",
  });
  return user;
};

const Login = () => {
  return (
    <div>
      <h1 className="text-center font-semibold text-2xl mt-60 mb-5">Login</h1>
      <Form method="POST" className="flex flex-col w-72 gap-2 m-auto">
        <input
          type="text"
          name="username"
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="username"
          required
        />

        <input
          type="password"
          name="password"
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="password"
          required
        />
        <button className="bg-black w-32 rounded-xl p-2 text-white font-semibold m-auto">
          Login
        </button>
      </Form>
      <h1 className="text-center text-zinc-500 mt-2">
        don't have an account?
        <Link to={"/register"}>
          <span className="font-semibold ml-2 cursor-pointer text-black text-center">
            Register
          </span>
        </Link>
      </h1>
    </div>
  );
};

export default Login;
