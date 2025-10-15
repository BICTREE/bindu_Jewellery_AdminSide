import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  // Example data
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        title: "How to Care for Your Gold Jewellery",
        author: "Admin",
        slug: "care-for-your-gold-jewellery",
        tags: ["Gold", "Jewellery"],
        image: "/assets/images/blog01.jpg",
        date: "2025-10-12",
      },
      {
        id: 2,
        title: "Top 10 Bridal Collections for 2025",
        author: "Team Bindu",
        slug: "top-10-bridal-collections-2025",
        tags: ["Bridal", "Trends"],
        image: "/assets/images/blog02.jpg",
        date: "2025-10-10",
      },
    ];
    setBlogs(mockData);
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
            key={blog.id}
            className="  bg-white shadow-md rounded-lg  border-gray-100 hover:shadow-lg transition-shadow"
          > <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-neutral-200">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                By {blog.author} | {blog.date}
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
                  to={`/admin/blog/${blog.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
