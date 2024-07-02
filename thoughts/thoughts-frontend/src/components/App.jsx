import { useEffect, useState } from "react";
import { Routes, Route, useMatch } from "react-router-dom"; // Importar los componentes necesarios de React Router

import thoughtService from "../services/thoughts";

import MainPage from "./MainPage";
import Post from "./Post";

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    thoughtService.getAll().then((initalPosts) => {
      const sortedPosts = initalPosts.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      const formattedPosts = sortedPosts.map((post) => {
        const date = new Date(post.timestamp);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return {
          ...post,
          timestamp: formattedDate,
        };
      });

      setPosts(formattedPosts);
    });
  }, []);

  const match = useMatch("/posts/:id");

  const post = match ? posts.find((p) => p.id === match.params.id) : null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<MainPage posts={posts} setPosts={setPosts} />}
        />
        <Route path="/posts/:id" element={<Post post={post} />} />
      </Routes>
    </>
  );
};

export default App;
