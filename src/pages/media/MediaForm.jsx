import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiTrash } from "react-icons/fi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { createMedia, getAMedia, updateMedia, archiveMedia } from "../../services/mediaService";
import { uploadSingleFile } from "../../services/uploadService";
import { toast } from "react-toastify";

const MediaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    filetype: "image",
    file: null,
    youtubeLink: "",
    tags: "",
    isArchived: false,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // ✅ New state for file upload loading
  const [formErrors, setFormErrors] = useState({});

  // ✅ Fetch media data in edit mode
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const res = await getAMedia(axiosPrivate, id);
          if (res.success) {
            const media = res.data.media || res.data.data;
            console.log("Fetched media:", media);
            
            setFormData({
              title: media.title || "",
              description: media.description || "",
              filetype: media.filetype || "image",
              file: media.file || null,
              youtubeLink: media.youtubeLink || "",
              tags: Array.isArray(media.tags) ? media.tags.join(", ") : media.tags || "",
              isArchived: media.isArchived || false,
            });

            // Set preview based on filetype
            if (media.filetype === "image" && media.file?.location) {
              setPreview(media.file.location);
            } else if (media.filetype === "video" && media.file?.location) {
              setPreview(media.file.location);
            }
            else if (media.filetype === "youtube" && media.youtubeLink) {
              setPreview(media.youtubeLink);
            }
          }
        } catch (error) {
          toast.error("Failed to load media details");
          console.error(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, axiosPrivate]);

  // ✅ Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ Handle filetype change
  const handleFiletypeChange = (e) => {
    const newFiletype = e.target.value;
    setFormData({ 
      ...formData, 
      filetype: newFiletype, 
      file: null, 
      youtubeLink: "" 
    });
    setPreview(null);
    // Clear file errors when type changes
    setFormErrors(prev => ({ ...prev, file: '', youtubeLink: '' }));
  };

  // ✅ Handle file upload
  const handleFileUpload = async (file) => {
    try {
      setUploading(true); // ✅ Start uploading
      const res = await uploadSingleFile(axiosPrivate, file);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          file: res.data.file, // { name, key, location }
        }));
        setPreview(res.data.file.location);
        // Clear file error
        setFormErrors(prev => ({ ...prev, file: '' }));
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false); // ✅ End uploading
    }
  };

  // ✅ On file select
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
    e.target.value = "";
  };

  // ✅ Remove file
  const removeFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setPreview(null);
  };

  // ✅ Trigger file input
  const triggerFileInput = () => {
    if (!uploading) { // ✅ Prevent triggering while uploading
      fileInputRef.current?.click();
    }
  };

  // ✅ Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (formData.filetype === 'youtube') {
      if (!formData.youtubeLink.trim()) {
        errors.youtubeLink = 'YouTube URL is required';
      } else if (!formData.youtubeLink.includes('youtube.com') && !formData.youtubeLink.includes('youtu.be')) {
        errors.youtubeLink = 'Please enter a valid YouTube URL';
      }
    } else {
      // For image/video - file is required only when creating new media
      if (!id && !formData.file) {
        errors.file = `${formData.filetype === 'image' ? 'Image' : 'Video'} is required`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use custom validation instead of browser validation
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    
    try {
      let payload = {
        title: formData.title,
        description: formData.description,
        filetype: formData.filetype,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== "")
          : [],
      };

      // Add file or youtubeLink based on filetype
      if (formData.filetype === "youtube") {
        payload.youtubeLink = formData.youtubeLink;
      } else {
        payload.file = formData.file;
      }

      console.log("Submitting payload:", payload);

      if (id) {
        await updateMedia(axiosPrivate, id, payload);
        toast.success("Media updated successfully!");
      } else {
        await createMedia(axiosPrivate, payload);
        toast.success("Media created successfully!");
      }

      navigate("/media");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save media");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Archive/Unarchive Media
  const handleArchiveToggle = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const newStatus = formData.isArchived ? "unarchived" : "archived";
      const res = await archiveMedia(axiosPrivate, id, { status: newStatus });
      if (res.success) {
        toast.success(
          formData.isArchived ? "Media unarchived successfully!" : "Media archived successfully!"
        );
        setFormData((prev) => ({ ...prev, isArchived: !prev.isArchived }));
      } else {
        toast.error("Failed to update media status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating archive status");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render preview based on filetype
  const renderPreview = () => {
    if (!preview) return null;

    if (formData.filetype === "image") {
      return (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-48 object-cover rounded-md"
        />
      );
    } else if (formData.filetype === "video") {
      return (
        <video
          src={preview}
          controls
          className="w-full h-48 rounded-md"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (formData.filetype === "youtube") {
      // Extract YouTube ID for thumbnail preview
      const getYouTubeId = (url) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        return match ? match[1] : null;
      };
      
      const videoId = getYouTubeId(preview);
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : preview;

      return (
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {id ? "Edit Media" : "Add New Media"}
      </h2>

      {/* Remove novalidate and use custom validation */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Media title"
            />
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write description..."
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tags <span className="text-sm text-gray-500">(comma separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500"
              placeholder="jewelry, showcase, design"
            />
          </div>

          {/* Filetype */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Media Type *</label>
            <select
              name="filetype"
              value={formData.filetype}
              onChange={handleFiletypeChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 bg-white text-gray-800"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="youtube">YouTube Link</option>
            </select>
          </div>

          {/* File Upload or YouTube URL Input */}
          {formData.filetype === "youtube" ? (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                YouTube URL *
              </label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 ${
                  formErrors.youtubeLink ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.youtubeLink && (
                <p className="text-red-500 text-sm mt-1">{formErrors.youtubeLink}</p>
              )}
              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  {renderPreview()}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Upload Section */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {formData.filetype === "image" ? "Upload Image" : "Upload Video"} 
                  {!id && " *"}
                </label>

                {preview ? (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {renderPreview()}
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        disabled={uploading}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiUpload className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={removeFile}
                        disabled={uploading}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                      formErrors.file ? 'border-red-500 bg-red-50' : 
                      uploading ? 'border-yellow-500 bg-yellow-50 cursor-wait' : 
                      'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-48">
                      {uploading ? (
                        // ✅ Uploading State
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mb-2"></div>
                          <p className="text-sm text-gray-600">
                            Uploading {formData.filetype}...
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Please wait
                          </p>
                        </>
                      ) : (
                        // ✅ Default State
                        <>
                          <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload {formData.filetype}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.filetype === "image"
                              ? "PNG, JPG, WEBP up to 5MB"
                              : "MP4, MOV up to 10MB"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {formErrors.file && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.file}</p>
                )}

                {/* Hidden input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept={formData.filetype === "image" ? "image/*" : "video/*"}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </div>

              {/* Guidelines */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-neutral-900 mb-2">
                  {formData.filetype === "image"
                    ? "Image Guidelines"
                    : "Video Guidelines"}
                </h3>
                <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5">
                  {formData.filetype === "image" ? (
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
          <div className="flex justify-end gap-3 mt-10">
            <button
              type="button"
              onClick={() => navigate("/media")}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              disabled={loading || uploading}
            >
              Cancel
            </button>

            {/* Archive / Unarchive button (visible only in edit mode) */}
            {id && (
              <button
                type="button"
                onClick={handleArchiveToggle}
                disabled={loading || uploading}
                className={`${
                  formData.isArchived
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white px-6 py-2 rounded-lg disabled:opacity-50`}
              >
                {formData.isArchived ? "Unarchive" : "Archive"}
              </button>
            )}

            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-[#d3b363] hover:bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Media"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MediaForm;