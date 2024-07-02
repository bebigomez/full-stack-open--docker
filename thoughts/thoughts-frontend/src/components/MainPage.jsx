import { useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import Scribble from "./icons/Scribble";
import PostForm from "../components/PostForm";

const MainPage = ({ posts, setPosts }) => {
  const [blogVisibility, setBlogVisibility] = useState(false);

  const toggleVisibility = () => {
    setBlogVisibility(!blogVisibility);
  };

  const handleLike = (id) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL
    const url = `${baseUrl}/${id}`;
    const post = posts.find((p) => p.id === id);
    const like = { likes: post.likes + 1 };

    axios
      .patch(url, like)
      .then((response) => {
        const date = new Date(response.data.timestamp);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        const formattedPost = { ...response.data, timestamp: formattedDate };

        setPosts(posts.map((p) => (p.id !== id ? p : formattedPost)));
      })
      .catch((error) => {
        console.error("Error updating like:", error);
      });
  };

  return (
    <div className="container mx-auto p-4 md:w-1/2">
      <div className="flex flex-col gap-3 items-center pt-4">
        <Scribble />
        <h1 className="text-xl font-semibold my-2">
          hey! want to share a thought?
        </h1>
        <button
          onClick={toggleVisibility}
          className="bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-xl"
        >
          yup!
        </button>

        {blogVisibility && (
          <PostForm
            toggleVisibility={toggleVisibility}
            posts={posts}
            setPosts={setPosts}
          />
        )}
      </div>
      <h2 className="text-xl align-top font-semibold mt-10">
        Other people have shared:
      </h2>
      <div className="border-gray-200 mt-6"></div>
      {posts.map((post) => (
        <div key={post.id}>
          <Link
            to={`/posts/${post.id}`}
            className="block text-xl font-medium mt-4 transition-colors hover:text-blue-600"
          >
            {post.title}
          </Link>
          <div>
            <p className="text-sm text-gray-500">Posted on: {post.timestamp}</p>
            <p className="text-sm text-gray-500">
              From {post.origin.city}, {post.origin.country}
            </p>
          </div>
          <div className="flex items-center justify-end p-4 border-b border-gray-200">
            <button onClick={() => handleLike(post.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-6 h-6 fill-current text-gray-500 transition-colors hover:text-blue-500"
              >
                <path
                  fillRule="evenodd"
                  d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-gray-500 ml-2">{post.likes}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainPage;
