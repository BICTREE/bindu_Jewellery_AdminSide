import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { GetAllBlogs } from "../../services/blogService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Blog = () => {
  const axiosPrivate = useAxiosPrivate();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const blogs = await GetAllBlogs(axiosPrivate);
        console.log(blogs, "data");
        setBlogs(blogs || []);
        // setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        // setError("Failed to load blogs");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Blogs</h2>
        <Link
          to="./new"
          className="flex items-center gap-2 bg-[#d3b363] hover:bg-black text-white px-4 py-2 rounded-lg"
        >
          <FiPlus /> Add Blog
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="  bg-white shadow-md rounded-lg  border-gray-100 hover:shadow-lg transition-shadow"
          >
            {" "}
            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-neutral-200">
              <img
                src={blog.image.location}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                By {blog.author} |{" "}
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 size={18} />
                </Link>
                {/* <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={18} />
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
