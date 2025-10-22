import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft,FiPlus,FiSearch } from "react-icons/fi";

// Dummy data for single blog
const dummyBlog = {
  _id: "1",
  title: "How to Style Your Jewelry",
  author: "Jane Doe",
  publishedAt: "2025-10-21T12:00:00Z",
  image: { location: "/diamind-02.png" },
  tags: ["Fashion", "Jewelry", "Tips"],
  content: `<p>Welcome to our latest blog post on jewelry styling! Here are some tips to make your accessories stand out:</p>
            <ul>
              <li>Mix and match metals.</li>
              <li>Layer necklaces for a modern look.</li>
              <li>Pair rings with bracelets for elegance.</li>
            </ul>
            <p>Confidence is your best accessory!</p>`,
};

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('')
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlog(dummyBlog);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Blog not found.
      </div>
    );
  }

  return (
<div className="animate-fade-in">
 <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Manage Blogs</h1>
          <p className="text-neutral-600">Manage your Blogs</p>
        </div>
        <div className="mt-4 sm:mt-0">
        <Link
            to="/blogs"
            className="btn btn-primary flex items-center"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
         Back to Blogs
          </Link>
        </div>
      </div>

  {/* Search */}
      <div className="mb-6 flex">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="form-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>



    <div className="max-w-4xl mx-auto px-4 py-10">
  

      <div className="aspect-w-16 aspect-h-9 mb-6 overflow-hidden rounded-lg shadow">
        <img
          src={blog.image.location}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-3xl font-semibold text-gray-900 mb-3">{blog.title}</h1>

      <p className="text-sm text-gray-500 mb-4">
        By {blog.author} |{" "}
        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="flex flex-wrap mb-6">
        {blog.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div
        className="prose prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
    </div>
  );
};

export default BlogView;
