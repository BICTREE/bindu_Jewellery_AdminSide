import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiTrash, FiPlus, FiX } from "react-icons/fi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { createGroupMedia, updateGroupMedia, archiveGroupMedia, getAGroupMedia } from "../../services/mediaService";
import { uploadMultipleFiles } from "../../services/uploadService";
import { toast } from "react-toastify";

const MediaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRefs = useRef({});
  const axiosPrivate = useAxiosPrivate();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    media: []
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({}); // Track upload state per media item
  const [formErrors, setFormErrors] = useState({});
 const [nameExists, setNameExists] = useState(false);
  // ✅ Fetch group media data in edit mode
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const res = await getAGroupMedia(axiosPrivate, id);
          if (res.success) {
            const groupMedia = res.data.group || res.data.data;
            console.log("Fetched group media:", groupMedia);
            
            setFormData({
              name: groupMedia.name || "",
              description: groupMedia.description || "",
              media: Array.isArray(groupMedia.media) ? groupMedia.media.map(item => ({
                filetype: item.filetype || "image",
                file: item.file || null,
                youtubeLink: item.youtubeLink || "",
                title: item.title || "",
                description: item.description || "",
                tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
                order: item.order || 0
              })) : []
            });
          }
        } catch (error) {
          toast.error("Failed to load media group details");
          console.error(error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, axiosPrivate]);

  // ✅ Handle group-level input changes
  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ Handle media item input changes
  const handleMediaChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    }));
  };

  // ✅ Handle filetype change for a media item
  const handleFiletypeChange = (index, e) => {
    const newFiletype = e.target.value;
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { 
          ...item, 
          filetype: newFiletype, 
          file: null, 
          youtubeLink: "" 
        } : item
      )
    }));
  };

  // ✅ Handle file upload for a specific media item
  const handleFileUpload = async (index, file) => {
    try {
      setUploading(prev => ({ ...prev, [index]: true }));
      const res = await uploadMultipleFiles(axiosPrivate, [file]);
      if (res.success) {
        const uploadedFile = res.data.files?.[0] || res.data.file;
        
        setFormData(prev => ({
          ...prev,
          media: prev.media.map((item, i) => 
            i === index ? { ...item, file: uploadedFile } : item
          )
        }));
        
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  // ✅ On file select for a media item
  const handleFileChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(index, file);
    }
    e.target.value = "";
  };

  // ✅ Remove file from a media item
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { ...item, file: null } : item
      )
    }));
  };

  // ✅ Trigger file input for a specific media item
  const triggerFileInput = (index) => {
    if (!uploading[index]) {
      fileInputRefs.current[index]?.click();
    }
  };

  // ✅ Add new media item
  const addMediaItem = () => {
    setFormData(prev => ({
      ...prev,
      media: [
        ...prev.media,
        {
          filetype: "image",
          file: null,
          youtubeLink: "",
          title: "",
          description: "",
          tags: "",
          order: prev.media.length
        }
      ]
    }));
  };

  // ✅ Remove media item
  const removeMediaItem = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // ✅ Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Group name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Group description is required';
    }

    if (formData.media.length === 0) {
      errors.media = 'At least one media item is required';
    }

    // Validate each media item
    formData.media.forEach((item, index) => {
      if (!item.title.trim()) {
        errors[`media_${index}_title`] = 'Title is required';
      }

      if (!item.description.trim()) {
        errors[`media_${index}_description`] = 'Description is required';
      }

      if (item.filetype === 'youtube') {
        if (!item.youtubeLink.trim()) {
          errors[`media_${index}_youtubeLink`] = 'YouTube URL is required';
        } else if (!item.youtubeLink.includes('youtube.com') && !item.youtubeLink.includes('youtu.be')) {
          errors[`media_${index}_youtubeLink`] = 'Please enter a valid YouTube URL';
        }
      } else {
        if (!item.file) {
          errors[`media_${index}_file`] = `${item.filetype === 'image' ? 'Image' : 'Video'} is required`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        media: formData.media.map((item, index) => ({
          filetype: item.filetype,
          file: item.filetype !== 'youtube' ? item.file : undefined,
          youtubeLink: item.filetype === 'youtube' ? item.youtubeLink : undefined,
          title: item.title,
          description: item.description,
          tags: item.tags
            ? item.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag !== "")
            : [],
          order: index
        }))
      };

      console.log("Submitting payload:", payload);

      if (id) {
        await updateGroupMedia(axiosPrivate, id, payload);
        toast.success("Media group updated successfully!");
      } else {
        await createGroupMedia(axiosPrivate, payload);
        toast.success("Media group created successfully!");
      }

      navigate("/media");
    } catch (error) {
      console.error("respose error ",error);
       // ✅ Handle duplicate name error
      if (error.response?.data?.error === 'DUPLICATE_ENTRY' || 
          error.response?.status === 409) {
        setNameExists(true);
        toast.error("A media group with this name already exists. Please choose a different name.");
      } else {
        toast.error(error.response?.data?.message || "Failed to save media group");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Archive/Unarchive Media Group
  const handleArchiveToggle = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const newStatus = formData.isArchived ? "unarchived" : "archived";
      const res = await archiveGroupMedia(axiosPrivate, id, { status: newStatus });
      if (res.success) {
        toast.success(
          formData.isArchived ? "Media group unarchived successfully!" : "Media group archived successfully!"
        );
        setFormData((prev) => ({ ...prev, isArchived: !prev.isArchived }));
      } else {
        toast.error("Failed to update media group status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating archive status");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render preview for a media item
  const renderPreview = (mediaItem) => {
    if (!mediaItem.file && !mediaItem.youtubeLink) return null;

    if (mediaItem.filetype === "image" && mediaItem.file?.location) {
      return (
        <img
          src={mediaItem.file.location}
          alt="Preview"
          className="w-full h-32 object-cover rounded-md"
        />
      );
    } else if (mediaItem.filetype === "video" && mediaItem.file?.location) {
      return (
        <video
          src={mediaItem.file.location}
          controls
          className="w-full h-32 rounded-md"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (mediaItem.filetype === "youtube" && mediaItem.youtubeLink) {
      const getYouTubeId = (url) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        return match ? match[1] : null;
      };
      
      const videoId = getYouTubeId(mediaItem.youtubeLink);
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : mediaItem.youtubeLink;

      return (
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt="YouTube Thumbnail"
            className="w-full h-32 object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
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
        {id ? "Edit Media Group" : "Create Media Group"}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Group Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleGroupChange}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Media group name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Group Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Group Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleGroupChange}
              rows="3"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe this media group..."
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Media Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-gray-700 font-medium">
                Media Items {!id && "*"}
              </label>
              <button
                type="button"
                onClick={addMediaItem}
                className="flex items-center gap-2 bg-[#d3b363] text-white px-4 py-2 rounded-lg hover:bg-black transition"
              >
                <FiPlus className="w-4 h-4" />
                Add Media
              </button>
            </div>

            {formErrors.media && (
              <p className="text-red-500 text-sm mb-4">{formErrors.media}</p>
            )}

            {formData.media.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No media items added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Media" to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.media.map((mediaItem, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-700">Media Item {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeMediaItem(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Left Column - Media Content */}
                      <div className="space-y-4">
                        {/* Media Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Media Type *
                          </label>
                          <select
                            value={mediaItem.filetype}
                            onChange={(e) => handleFiletypeChange(index, e)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 text-sm"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="youtube">YouTube Link</option>
                          </select>
                        </div>

                        {/* File Upload or YouTube URL */}
                        {mediaItem.filetype === "youtube" ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              YouTube URL *
                            </label>
                            <input
                              type="url"
                              name="youtubeLink"
                              value={mediaItem.youtubeLink}
                              onChange={(e) => handleMediaChange(index, e)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 text-sm ${
                                formErrors[`media_${index}_youtubeLink`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {formErrors[`media_${index}_youtubeLink`] && (
                              <p className="text-red-500 text-xs mt-1">{formErrors[`media_${index}_youtubeLink`]}</p>
                            )}
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Upload {mediaItem.filetype === "image" ? "Image" : "Video"} *
                            </label>
                            
                            {mediaItem.file ? (
                              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-3">
                                {renderPreview(mediaItem)}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  <button
                                    type="button"
                                    onClick={() => triggerFileInput(index)}
                                    disabled={uploading[index]}
                                    className="bg-white p-1 rounded shadow hover:bg-gray-50 transition disabled:opacity-50"
                                  >
                                    <FiUpload className="h-3 w-3 text-gray-600" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading[index]}
                                    className="bg-white p-1 rounded shadow hover:bg-gray-50 transition text-red-600 disabled:opacity-50"
                                  >
                                    <FiTrash className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => triggerFileInput(index)}
                                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
                                  formErrors[`media_${index}_file`] ? 'border-red-500 bg-red-50' : 
                                  uploading[index] ? 'border-yellow-500 bg-yellow-50 cursor-wait' : 
                                  'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <div className="flex flex-col items-center justify-center h-24">
                                  {uploading[index] ? (
                                    <>
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mb-1"></div>
                                      <p className="text-xs text-gray-600">Uploading...</p>
                                    </>
                                  ) : (
                                    <>
                                      <FiUpload className="h-6 w-6 text-gray-400 mb-1" />
                                      <p className="text-xs text-gray-600">
                                        Click to upload {mediaItem.filetype}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {formErrors[`media_${index}_file`] && (
                              <p className="text-red-500 text-xs mt-1">{formErrors[`media_${index}_file`]}</p>
                            )}

                            <input
                              type="file"
                              ref={el => fileInputRefs.current[index] = el}
                              className="hidden"
                              accept={mediaItem.filetype === "image" ? "image/*" : "video/*"}
                              onChange={(e) => handleFileChange(index, e)}
                              disabled={uploading[index]}
                            />
                          </div>
                        )}
                      </div>

                      {/* Right Column - Media Details */}
                      <div className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={mediaItem.title}
                            onChange={(e) => handleMediaChange(index, e)}
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 text-sm ${
                              formErrors[`media_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Media title"
                          />
                          {formErrors[`media_${index}_title`] && (
                            <p className="text-red-500 text-xs mt-1">{formErrors[`media_${index}_title`]}</p>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            name="description"
                            value={mediaItem.description}
                            onChange={(e) => handleMediaChange(index, e)}
                            rows="2"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 text-sm ${
                              formErrors[`media_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Media description"
                          />
                          {formErrors[`media_${index}_description`] && (
                            <p className="text-red-500 text-xs mt-1">{formErrors[`media_${index}_description`]}</p>
                          )}
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags <span className="text-xs text-gray-500">(comma separated)</span>
                          </label>
                          <input
                            type="text"
                            name="tags"
                            value={mediaItem.tags}
                            onChange={(e) => handleMediaChange(index, e)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 text-sm"
                            placeholder="jewelry, showcase, design"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/media")}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              disabled={loading || Object.values(uploading).some(Boolean)}
            >
              Cancel
            </button>

            {/* Archive / Unarchive button (visible only in edit mode) */}
            {id && (
              <button
                type="button"
                onClick={handleArchiveToggle}
                disabled={loading || Object.values(uploading).some(Boolean)}
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
              disabled={loading || Object.values(uploading).some(Boolean)}
              className="bg-[#d3b363] hover:bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : (id ? "Update Media Group" : "Create Media Group")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MediaForm;