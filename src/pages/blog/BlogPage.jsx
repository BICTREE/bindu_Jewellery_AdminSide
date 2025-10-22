import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch,FiEye  } from "react-icons/fi";
import { GetAllBlogs } from "../../services/blogService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Blog = () => {
  const axiosPrivate = useAxiosPrivate();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState('')
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
    <div className="animate-fade-in">
   
   
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Manage Blogs</h1>
          <p className="text-neutral-600">Manage your Blogs</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="./new"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Category
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




      {/* Grid */}
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="card hover:shadow-md transition-shadow duration-200"
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
              <div className="flex justify-between items-start">
             <div>
              <h3 className="text-lg font-medium text-neutral-900">
                {blog.title}
              </h3>
              </div>
              
          
              <div className="flex items-center ml-4 space-x-3">

  <Link
    to={`/blog/view/${blog._id}`}
    className="text-gray-600 hover:text-gray-800"
  >
    <FiEye size={18} />
  </Link>

  <Link
    to={`/blog/${blog._id}`}
    className="text-blue-600 hover:text-blue-800"
  >
    <FiEdit2 size={18} />
  </Link>

 
  <button
    onClick={() => handleDelete(blog._id)}
    className="text-red-600 hover:text-red-800"
  >
    <FiTrash2 size={18} />
  </button>
</div>

            </div>
<div>
              <p className="text-sm text-neutral-500 mt-1">
                By {blog.author} |{" "}
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

                  <div className=" flex flex-wrap items-center mt-4">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-2 mr-1 my-1 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
