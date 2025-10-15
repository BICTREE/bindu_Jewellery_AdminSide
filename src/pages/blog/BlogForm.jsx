import React, { useRef, useState } from "react";
import { FiTrash, FiUpload } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    slug: "",
    tags: "",
    image: null,    // now will store File object
    content: "",
  });

  const [preview, setPreview] = useState(null); // for image preview
 const mainImageInputRef = useRef(null)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const triggerMainImageInput = () => {
    mainImageInputRef.current?.click()
  }
    const handleImageUpload = async (file, imageType) => {
      try {
        const data = await uploadSingleFile(axiosPrivate, file)
  
        if (data.success) {
          setFormData(prev => ({
            ...prev,
            [imageType]: data.data.file,
          }))
          toast.success(`${imageType === 'image' ? 'Main image' : 'Hover image'} uploaded successfully`)
        }
      } catch (error) {
        console.log(error)
        toast.error(`Failed to upload ${imageType === 'image' ? 'main image' : 'hover image'}`)
      }
    }

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await handleImageUpload(file, 'image')
    }
    // Reset the input
    e.target.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normally you would send the file to backend via FormData
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("author", formData.author);
    dataToSend.append("slug", formData.slug);
    dataToSend.append("tags", formData.tags);
    dataToSend.append("content", formData.content);
    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    console.log("Form submitted:", formData);
    alert("Blog saved successfully!");
    navigate("/admin/blog");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md  ">
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

        {/* Image Upload */}
        {/* <div>
          <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-gray-700"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-48 h-48 object-cover rounded-md border"
            />
          )}
        </div> */}
        
                <div className="">
                  <h2 className="text-lg font-medium text-neutral-900 mb-4">Blog Images</h2>
        
                  <div className="grid  grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Main Image */}
                    <div>
                      {/* <h3 className="text-sm font-medium text-neutral-900 mb-2">Main Image</h3> */}
                      {formData.image ? (
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <img
                            src={formData.image?.location}
                            alt={formData.name}
                            className="w-full h-48 object-cover rounded-md"
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                              type="button"
                              onClick={triggerMainImageInput}
                              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition"
                            >
                              <FiUpload className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage('image')}
                              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition text-red-600"
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
                      {/* Hidden file input for main image */}
                      <input
                        type="file"
                        ref={mainImageInputRef}
                        className="hidden"
                        onChange={handleMainImageChange}
                        accept="image/*"
                      />
                    </div>
        
                   <div className="mt-4">
                    <h3 className="text-sm font-medium text-neutral-900 mb-2">Image Guidelines</h3>
                    <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5">
                      <li>Use high-quality images that represent the category</li>
                      <li>Recommended size: 800x600 pixels</li>
                      <li>Keep the file size under 5MB</li>
                      <li>Use a consistent style across categories</li>
                      <li>Hover image will be shown when user hovers over the category</li>
                    </ul>
                  </div>
                  </div>
        
             
                </div>

        {/* Content */}

      
<div>
  <label className="block text-gray-700 font-medium mb-2">Content</label>
  <ReactQuill
    theme="snow"
    value={formData.content}
    onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
    className="bg-white custom-quill"
    placeholder="Write blog content here..."
   
  />
</div>



        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-10">
          <button
            type="button"
            onClick={() => navigate("/admin/blog")}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit" className="bg-[#d3b363] hover:bg-black text-white px-6 py-2 rounded-lg"
          >
            Save Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
