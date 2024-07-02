import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import thoughtService from "../services/thoughts";

const Post = ({ post: initialPost }) => {
  const { id } = useParams();
  const [post, setPost] = useState(initialPost);

  useEffect(() => {
    if (!initialPost) {
      thoughtService.getOne(id)
        .then((response) => setPost(response))
        .catch((error) => console.error("Error fetching post:", error));
    }
  }, []);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-8 md:w-1/2 md">
      <h1 className="text-4xl font-bold text-gray-800 mb-1">{post.title}</h1>
      <p className="text-xs text-gray-700">Posted on {post.timestamp}</p>
      <p className="text-xs text-gray-700">
        From {post.origin.city}, {post.origin.country}
      </p>
      <p className="text-base text-gray-700 mt-4">Body: {post.body}</p>
    </div>
  );
};

export default Post;
