import { LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { authenticator } from "../utils/auth.server";
import { db } from "../utils/db.server";

export const loader: LoaderFunction = async ({
  params,
  request,
}: {
  params: any;
  request: any;
}) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const postId = parseInt(params.postId);
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  });
  return { post };
};

export async function action({ request }: { request: any }) {
  const form = await request.formData();
  const data = Object.fromEntries(form);
  const action = form.get("action");
  const postId = form.get("postId");

  if (action === "delete-post" && postId) {
    await db.post.delete({
      where: {
        id: parseInt(postId),
      },
    });
  } else if (action === "update-post" && postId) {
    await db.post.update({
      where: {
        id: parseInt(postId),
      },
      data: {
        title: data.title as string,
        content: data.content as string,
      },
    });
  }

  return redirect('/posts');
}

export default function PostId() {
  const params = useParams();
  const { post } = useLoaderData<typeof loader>();

  if (!post) {
    return <div>Loading...</div>; // Handle loading state or error when post is null
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Post ID: {params.postId}</h1>
      <div className="max-w-lg mx-auto">
        <Form method="post" className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Edit Post</h2>
          <input type="hidden" name="action" value="update-post" />
          <input type="hidden" name="postId" value={post.id} />
          <div className="mb-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={post.title}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              defaultValue={post.content}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Post
          </button>
        </Form>

        <Form method="post">
          <h2 className="text-lg font-semibold mb-2">Delete Post</h2>
          <input type="hidden" name="action" value="delete-post" />
          <input type="hidden" name="postId" value={post.id} />
          <div className="mb-2">
            <label
              htmlFor="deleteTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="deleteTitle"
              name="deleteTitle"
              type="text"
              defaultValue={post.title}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            />
            <label
              htmlFor="deleteTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Content :-
            </label>
            <input
              id="deleteTitle"
              name="deleteTitle"
              type="text"
              defaultValue={post.content}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Post
          </button>
        </Form>
      </div>
    </div>
  );
}
