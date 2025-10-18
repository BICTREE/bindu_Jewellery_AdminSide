import React, { useEffect, useRef, useState } from "react";
import { FiTrash, FiUpload } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { createBlog, getABlog, updateBlog, archiveBlog } from "../../services/blogService";
import { uploadSingleFile } from "../../services/uploadService";
import { toast } from "react-toastify";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    slug: "",
    tags: "",
    image: null,
    content: "",
    isArchived: false,
    publishedAt:""
  });

  const [preview, setPreview] = useState(null);
  const mainImageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch blog data in edit mode
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await getABlog(axiosPrivate, id);
          if (res.success) {
            const blog = res.data.blog;
            setFormData({
              title: blog.title || "",
              author: blog.author || "",
              slug: blog.slug || "",
              tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
              image: blog.image || null,
              content: blog.content || "",
              isArchived: blog.isArchived || false,
            });
            if (blog.image?.location) setPreview(blog.image.location);
          }
        } catch (error) {
          toast.error("Failed to load blog details");
          console.error(error);
        }
      })();
    }
  }, [id, axiosPrivate]);

  // ✅ Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Trigger image upload input
  const triggerMainImageInput = () => {
    mainImageInputRef.current?.click();
  };

  // ✅ Upload image
  const handleImageUpload = async (file) => {
    try {
      const res = await uploadSingleFile(axiosPrivate, file);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          image: res.data.file,
        }));
        setPreview(res.data.file.location);
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    }
  };

  // ✅ On file select
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) await handleImageUpload(file);
    e.target.value = "";
  };

  // ✅ Remove image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(null);
  };

  // ✅ Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        author: formData.author,
        slug: formData.slug,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
          : [],
        content: formData.content,
        image: formData.image,
        publishedAt:formData.publishedAt
      };

      if (id) {
        await updateBlog(axiosPrivate, id, payload);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(axiosPrivate, payload);
        toast.success("Blog created successfully!");
      }

      navigate("/blog");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Archive/Unarchive Blog
  const handleArchiveToggle = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const newStatus = formData.isArchived ? "unarchived" : "archived";
      const res = await archiveBlog(axiosPrivate, id, { status: newStatus });
      if (res.success) {
        toast.success(
          formData.isArchived ? "Blog unarchived successfully!" : "Blog archived successfully!"
        );
        setFormData((prev) => ({ ...prev, isArchived: !prev.isArchived }));
      } else {
        toast.error("Failed to update blog status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating archive status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {id ? "Edit Blog" : "Add New Blog"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
            placeholder="Blog title"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
            placeholder="Author name"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
            placeholder="unique-url-slug"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
            placeholder="comma,separated,tags"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">PublishedAt</label>
          <input
            type="date"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
            placeholder="comma,separated,tags"
          />
        </div>

        {/* Image Upload */}
        <div>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Blog Image</h2>

          {preview ? (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
              <img
                src={preview}
                alt="Blog"
                className="w-full h-48 object-cover rounded-md"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  type="button"
                  onClick={triggerMainImageInput}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                >
                  <FiUpload className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-white p-2 rounded-full shadow-md text-red-600 hover:bg-gray-50"
                >
                  <FiTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerMainImageInput}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition"
            >
              <div className="flex flex-col items-center justify-center h-48">
                <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload main image</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={mainImageInputRef}
            className="hidden"
            onChange={handleMainImageChange}
            accept="image/*"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
            className="bg-white custom-quill"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-10">
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          {/* Archive / Unarchive button (visible only in edit mode) */}
          {id && (
            <button
              type="button"
              onClick={handleArchiveToggle}
              disabled={loading}
              className={`${
                formData.isArchived
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white px-6 py-2 rounded-lg`}
            >
              {formData.isArchived ? "Unarchive" : "Archive"}
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#d3b363] hover:bg-black text-white px-6 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
