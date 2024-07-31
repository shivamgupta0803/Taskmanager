import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" });
  return { status: 302, headers: { Location: "/login" } };
};
