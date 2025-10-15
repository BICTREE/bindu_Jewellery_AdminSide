import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";

const MediaPage = () => {
  const [mediaItems, setMediaItems] = useState([]);

  // Example media data
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        title: "Banner Image",
        description: "Home page banner",
        type: "image",
        url: "/assets/images/banner01.jpg",
      },
      {
        id: 2,
        title: "Promo Video",
        description: "Promo video for sale",
        type: "video",
        url: "/assets/videos/promo.mp4",
      },
      {
        id: 3,
        title: "YouTube Demo",
        description: "Demo video on YouTube",
        type: "youtube",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      },
    ];
    setMediaItems(mockData);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Media</h2>
        <Link
          to="./new"
          className="flex items-center gap-2  bg-[#d3b363] hover:bg-black text-white px-4 py-2 rounded-lg"
        >
          <FiPlus /> Add Media
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mediaItems.length > 0 ? (
          mediaItems.map((item) => (
            <div
              key={item.id}
              className="card hover:shadow-md transition-shadow duration-200 bg-white rounded-lg overflow-hidden border border-gray-100"
            >
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-neutral-200">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                ) : item.type === "video" ? (
                  <video
                    src={item.url}
                    className="w-full h-40 object-cover"
                    controls
                  />
                ) : item.type === "youtube" ? (
                  <iframe
                    className="w-full h-40"
                    src={item.url}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : null}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {item.description}
                    </p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center ml-4 gap-2">
                    <Link
                      to={`/admin/media/${item.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-500 mb-3">
              <FiSearch className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-1">
              No media found
            </h3>
            <p className="text-neutral-500">Try adding a new media item.</p>
            <div className="mt-4">
              <Link
                to="/admin/media/new"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                <FiPlus className="h-4 w-4" />
                Add Media
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPage;
