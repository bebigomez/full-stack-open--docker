import { useState } from "react";

import thoughtService from '../services/thoughts'

const PostForm = ({ toggleVisibility, posts, setPosts }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((response) => response.json())
            .then((data) => {
              const city = data.address.city;
              const country = data.address.country;
              resolve({ city, country });
              setLoading(false);
            })
            .catch((error) => {
              reject(error);
            });
        });
      } else {
        reject("La geolocalización no está disponible en este navegador.");
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postObject = {
      title,
      body,
      origin: await getLocation(),
      likes: 0,
    };

    thoughtService.create(postObject)
      .then((response) => {

        const date = new Date(response.timestamp);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        const formattedPost = { ...response, timestamp: formattedDate };

        setPosts([formattedPost, ...posts]);
      });

    setTitle("");
    setBody("");
    toggleVisibility();
    return;
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4">
        <div>
          <textarea
            className="text-4xl font-semibold border-none w-full px-3 text-black focus:outline-none focus:shadow-outline break-all"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-6">
          <textarea
            className="text-base border-none w-full py-2 px-3 text-black, focus:outline-none focus:shadow-outline"
            placeholder="Tell us more..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button
            onClick={toggleVisibility}
            className="bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-xl"
          >
            cancel
          </button>
          <button className="bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-xl ml-2">
            post
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex items-center justify-center">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default PostForm;
