import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiEdit, FiTrash2, FiEye, FiCalendar, FiUser, FiTag, FiShare2, FiBookmark, FiArchive, FiGlobe } from "react-icons/fi";
import { getABlog } from "../../services/blogService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const BlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getABlog(axiosPrivate, id);
        console.log("Blog API Response:", response);
        
        if (response.data) {
          setBlog(response.data.blog || response.data);
        } else {
          setBlog(response);
        }
        
      } catch (err) {
        setError("Failed to load blog. Please try again later.");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, axiosPrivate]);

  // Calculate read time based on content
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleEdit = () => {
    // Navigate to edit page
    window.location.href = `/admin/blogs/edit/${blog._id}`;
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      console.log("Delete blog:", blog._id);
      // Add delete API call here
    }
  };

  const handleArchiveToggle = () => {
    if (window.confirm(`Are you sure you want to ${blog.isArchived ? 'unarchive' : 'archive'} this blog?`)) {
      console.log("Toggle archive for blog:", blog._id);
      // Add archive API call here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <FiEye className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Blog not found</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link to="/admin/blogs" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto">
            <FiEye className="h-6 w-6 text-gray-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Blog not found</h3>
          <p className="mt-2 text-gray-600">The blog you're looking for doesn't exist.</p>
          <Link to="/admin/blogs" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(blog.content);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/blogs"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="mr-2 h-5 w-5" />
                Back to Blogs
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Preview</h1>
                <p className="text-gray-600">View and manage blog content</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            {/* <div className="flex items-center space-x-3">
              <button
                onClick={handleArchiveToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  blog.isArchived 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiArchive className="mr-2 h-4 w-4" />
                {blog.isArchived ? 'Archived' : 'Archive'}
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="mr-2 h-4 w-4" />
                Edit Blog
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiTrash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="aspect-w-16 aspect-h-7 bg-gray-200">
            <img
              src={blog.image?.location || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
              alt={blog.title}
              className="w-full h-64 sm:h-80 object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          {/* Blog Meta Information */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <FiUser className="mr-2 h-4 w-4" />
                <span className="font-medium">{blog.author}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2 h-4 w-4" />
                <span>{new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
              <div className="flex items-center">
                <FiBookmark className="mr-2 h-4 w-4" />
                <span>{readTime} min read</span>
              </div>
              {blog.slug && (
                <div className="flex items-center">
                  <FiGlobe className="mr-2 h-4 w-4" />
                  <span className="font-mono text-xs">/{blog.slug}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <FiTag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  blog.isArchived 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {blog.isArchived ? 'Archived' : 'Published'}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Share blog"
                >
                  <FiShare2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div 
              className="prose prose-lg max-w-none 
                        prose-headings:text-gray-900
                        prose-p:text-gray-700 prose-p:leading-relaxed
                        prose-ul:text-gray-700 prose-ul:leading-relaxed
                        prose-ol:text-gray-700 prose-ol:leading-relaxed
                        prose-li:text-gray-700
                        prose-strong:text-gray-900
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-blockquote:text-gray-600 prose-blockquote:border-blue-200
                        prose-blockquote:bg-blue-50 prose-blockquote:px-6 prose-blockquote:py-4
                        prose-h2:text-2xl prose-h2:font-bold prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-8
                        prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6
                        prose-img:rounded-lg prose-img:shadow-md
                        prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        {/* Stats & Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiUser className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Author</p>
                <p className="text-lg font-semibold text-gray-900">{blog.author}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiBookmark className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Read Time</p>
                <p className="text-lg font-semibold text-gray-900">{readTime} min</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                blog.isArchived ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <FiArchive className={`h-6 w-6 ${
                  blog.isArchived ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className={`text-lg font-semibold ${
                  blog.isArchived ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  {blog.isArchived ? 'Archived' : 'Published'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogView;