import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { json } from "@remix-run/node";
import { Form, Link, useFetcher, useLoaderData } from "@remix-run/react";
import React, { useState, useEffect, useRef } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user: any = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search");

  const posts = await db.post.findMany({
    where: {
      userId: user.id,
      ...(searchQuery
        ? {
            OR: [
              { title: { contains: searchQuery } },
              { content: { contains: searchQuery } },
            ],
          }
        : {}),
    },
  });

  return json({ user, posts });
};

export async function action({ request }: ActionFunctionArgs) {
  const user: any = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const form = await request.formData();
  const data = Object.fromEntries(form);
  const action = form.get("action");

  const postData = {
    title: data.title as string,
    content: data.content as string,
    userId: user.id,
  };

  switch (action) {
    case "create-todo":
      return await db.post.create({ data: postData });
    case "update-todo":
      const postId = form.get("id");
      return await db.post.update({
        where: { id: Number(postId) },
        data: postData,
      });
  }

  return null;
}

export default function Post() {
  const loaderData = useLoaderData<any>();
  const fetcher = useFetcher();
  const [editingPost, setEditingPost] = useState<any>(null);
  const [search, setSearch] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [check, setCheck] = useState<string[]>([]);

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCheck([...check, value]);
    } else {
      setCheck(check.filter((id) => id !== value));
    }
  };

  const handleCheckedAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allPostIds = loaderData.posts.map((post: any) => post.id.toString());
      setCheck(allPostIds);
    } else {
      setCheck([]);
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      alert("Post added or updated successfully!");
      setEditingPost(null);
      formRef.current?.reset();
    }
  }, [fetcher.data]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!loaderData) {
    return <div>Loading...</div>;
  }

  const { posts } = loaderData;

  const filteredPosts = search
    ? posts.filter(
        (post: any) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  const handleEdit = (post: any) => {
    setEditingPost(post);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-6 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
          {editingPost ? "Edit Task" : "Create Task"}
        </h1>
        <fetcher.Form method="post" className="space-y-4" ref={formRef}>
          <input
            type="hidden"
            name="action"
            value={editingPost ? "update-todo" : "create-todo"}
          />
          {editingPost && (
            <input type="hidden" name="id" value={editingPost.id} />
          )}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={editingPost ? editingPost.title : ""}
              ref={inputRef}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the title"
              required
            />
          </div>
          <div>
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
              defaultValue={editingPost ? editingPost.content : ""}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your content here..."
              required
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingPost ? "Update Task" : "Create Task"}
            </button>
          </div>
        </fetcher.Form>
      </div>

      <div className="container mt-8 flex justify-center">
        <div className="relative mb-2">
          <input
            type="text"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search tasks..."
            className="w-full  px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          />
          <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <div className="max-w-xl w-full mt-2 flex items-center">
        <input
          type="checkbox"
          name="check"
          onChange={handleCheckedAll}
          className="mr-2"
          checked={check.length === loaderData.posts.length}
        />
        <label className="text-lg font-medium">Select All</label>
      </div>

      <div className="max-w-xl w-full mt-2 mb-12">
        <ul className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post: any) => (
            <li
              key={post.id}
              className="bg-white rounded-lg shadow-md p-4 flex items-start justify-between"
            >
              <div>
                <input
                  type="checkbox"
                  name="check"
                  onChange={handleChecked}
                  value={post.id}
                  checked={check.includes(post.id.toString())}
                  className="mr-2"
                />
                <div className="ml-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600">{post.content}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-500 hover:text-blue-600 font-semibold"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <Link
                  to={`/posts/${post.id}`}
                  className="text-pink-500 hover:text-pink-600 font-semibold"
                >
                  <i className="bi bi-arrow-right-circle"></i>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
