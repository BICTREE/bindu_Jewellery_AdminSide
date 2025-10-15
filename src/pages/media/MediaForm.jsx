import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiTrash } from "react-icons/fi"; 

const MediaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "image",
    file: null,
    url: "",
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (id) {
      const mockItem = {
        id,
        title: "Sample Media",
        description: "Demo description",
        type: "image",
        url: "/assets/images/banner01.jpg",
      };
      setFormData({
        title: mockItem.title,
        description: mockItem.description,
        type: mockItem.type,
        file: null,
        url: mockItem.url,
      });
      if (mockItem.type !== "youtube") setPreview(mockItem.url);
    }
  }, [id]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({ ...formData, type: newType, file: null, url: "" });
    setPreview(null);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("type", formData.type);

    if (formData.type === "youtube") {
      dataToSend.append("url", formData.url);
    } else if (formData.file) {
      dataToSend.append("file", formData.file);
    }

    console.log("Submitted Media:", formData);
    alert("Media saved successfully!");
    navigate("/admin/media");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {id ? "Edit Media" : "Add New Media"}
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
            placeholder="Media title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
            placeholder="Write description..."
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Type</label>
      <select
  name="type"
  value={formData.type}
  onChange={handleTypeChange}
  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 bg-white text-gray-800"
>
  <option value="image">Image</option>
  <option value="video">Video</option>
  <option value="youtube">YouTube Link</option>
</select>

        </div>

        {/* File Upload or URL Input */}
        {formData.type === "youtube" ? (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Upload Section */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {formData.type === "image" ? "Upload Image" : "Upload Video"}
              </label>

              {preview ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {formData.type === "image" ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={preview}
                      controls
                      className="w-full h-48 rounded-md"
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition"
                    >
                      <FiUpload className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData((prev) => ({ ...prev, file: null }));
                      }}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition text-red-600"
                    >
                      <FiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition"
                >
                  <div className="flex flex-col items-center justify-center h-48">
                    <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload {formData.type}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.type === "image"
                        ? "PNG, JPG up to 5MB"
                        : "MP4, MOV up to 10MB"}
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={formData.type === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                required={!id}
              />
            </div>

            {/* Guidelines */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">
                {formData.type === "image"
                  ? "Image Guidelines"
                  : "Video Guidelines"}
              </h3>
              <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5">
                {formData.type === "image" ? (
                  <>
                    <li>Use high-quality images</li>
                    <li>Recommended size: 800x600px</li>
                    <li>Keep file size under 5MB</li>
                    <li>Accepted formats: JPG, PNG, WEBP</li>
                  </>
                ) : (
                  <>
                    <li>Upload short clips (under 60s)</li>
                    <li>Recommended size: 1080p or less</li>
                    <li>Keep file size under 10MB</li>
                    <li>Accepted formats: MP4, MOV</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/media")}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#d3b363] hover:bg-black text-white px-6 py-2 rounded-lg"
          >
            Save Media
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaForm;
