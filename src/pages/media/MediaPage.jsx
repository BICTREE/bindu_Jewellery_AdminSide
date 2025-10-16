import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GetAllMedia } from "../../services/mediaService";

const MediaPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogs = await GetAllMedia(axiosPrivate);
        console.log(blogs, "data");
        setMediaItems(blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [axiosPrivate]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      setMediaItems((prev) => prev.filter((item) => item._id !== id));
    }
  };

  // Function to render media content based on filetype
  const renderMediaContent = (item) => {
    switch (item.filetype) {
      case "image":
        return (
          <img
            src={item.file?.location}
            alt={item.title}
            className="w-full h-40 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x160?text=Image+Not+Found";
            }}
          />
        );
      case "youtube":
        // Extract video ID from YouTube URL for embed
        const getYouTubeId = (url) => {
          const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
          return match ? match[1] : null;
        };

        const videoId = getYouTubeId(item.youtubeLink);
        const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : item.youtubeLink;

        return (
          <iframe
            className="w-full h-40"
            src={embedUrl}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      case "video":
        return (
          <video
            src={item.file?.location}
            className="w-full h-40 object-cover"
            controls
          >
            Your browser does not support the video tag.
          </video>
        );
      default:
        return (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Unsupported media type</span>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Media</h2>
        <Link
          to="./new"
          className="flex items-center gap-2 bg-[#d3b363] hover:bg-black text-white px-4 py-2 rounded-lg"
        >
          <FiPlus /> Add Media
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d3b363]"></div>
          <p className="mt-2 text-gray-600">Loading media...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mediaItems.length > 0 ? (
            mediaItems.map((item) => (
              <div
                key={item._id}
                className="card hover:shadow-md transition-shadow duration-200 bg-white rounded-lg overflow-hidden border border-gray-100"
              >
                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-neutral-200">
                  {renderMediaContent(item)}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-neutral-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
                          {item.filetype}
                        </span>
                        {item.tags && item.tags.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {item.tags.length} tags
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center ml-4 gap-2">
                      <Link
                        to={`/media/${item._id}`}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      {/* <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button> */}
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
                  to="/media/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#d3b363] text-white rounded-lg hover:bg-black"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Media
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaPage;