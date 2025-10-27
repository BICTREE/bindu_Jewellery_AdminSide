import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiPlus, 
  FiImage, 
  FiVideo, 
  FiYoutube, 
  FiPlay,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { GetAllGroupMedia } from "../../services/mediaService";

const MediaPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const [mediaGroups, setMediaGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMediaGroups = async () => {
      try {
        setLoading(true);
        const groupMedia = await GetAllGroupMedia(axiosPrivate);
        console.log(groupMedia, "media groups data");
        setMediaGroups(groupMedia || []);
      } catch (err) {
        console.error("Error fetching media groups:", err);
        setMediaGroups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaGroups();
  }, [axiosPrivate]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this media group?")) {
      setMediaGroups((prev) => prev.filter((group) => group._id !== id));
    }
  };

  // Function to open modal with selected group
  const openMediaModal = (group, index = 0) => {
    setSelectedGroup(group);
    setCurrentMediaIndex(index);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeMediaModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setCurrentMediaIndex(0);
  };

  // Navigation functions
  const goToNextMedia = () => {
    if (selectedGroup && selectedGroup.media) {
      setCurrentMediaIndex((prev) => 
        prev < selectedGroup.media.length - 1 ? prev + 1 : 0
      );
    }
  };

  const goToPrevMedia = () => {
    if (selectedGroup && selectedGroup.media) {
      setCurrentMediaIndex((prev) => 
        prev > 0 ? prev - 1 : selectedGroup.media.length - 1
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevMedia();
          break;
        case 'ArrowRight':
          goToNextMedia();
          break;
        case 'Escape':
          closeMediaModal();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedGroup]);

  // Function to get media type icon and count
  const getMediaTypeStats = (mediaItems) => {
    const stats = {
      image: 0,
      video: 0,
      youtube: 0
    };

    mediaItems?.forEach(item => {
      if (stats.hasOwnProperty(item.filetype)) {
        stats[item.filetype]++;
      }
    });

    return stats;
  };

  // Function to get first media item for preview
  const getFirstMediaPreview = (mediaItems) => {
    if (!mediaItems || mediaItems.length === 0) {
      return null;
    }

    const firstMedia = mediaItems[0];
    
    switch (firstMedia.filetype) {
      case "image":
        return (
          <img
            src={firstMedia.file?.location}
            alt={firstMedia.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x192?text=Image+Not+Found";
            }}
          />
        );
      case "youtube":
        const getYouTubeId = (url) => {
          const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
          return match ? match[1] : null;
        };

        const videoId = getYouTubeId(firstMedia.youtubeLink);
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : firstMedia.youtubeLink;

        return (
          <div className="relative">
            <img
              src={thumbnailUrl}
              alt={firstMedia.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x192?text=YouTube+Not+Found";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-3">
                <FiYoutube className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="relative">
            <video
              src={firstMedia.file?.location}
              className="w-full h-48 object-cover"
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <FiVideo className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <FiImage className="h-12 w-12 text-gray-400" />
          </div>
        );
    }
  };

  // Function to render current media in modal
  const renderCurrentMedia = () => {
    if (!selectedGroup || !selectedGroup.media || selectedGroup.media.length === 0) {
      return null;
    }

    const currentMedia = selectedGroup.media[currentMediaIndex];
    
    switch (currentMedia.filetype) {
      case "image":
        return (
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full flex justify-center">
              <img
                src={currentMedia.file?.location}
                alt={currentMedia.title}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                }}
              />
            </div>
            <div className="mt-4 text-center max-w-2xl">
              <h3 className="text-lg font-semibold text-black">{currentMedia.title}</h3>
              {currentMedia.description && (
                <p className="text-black mt-1">{currentMedia.description}</p>
              )}
            </div>
          </div>
        );
      case "youtube":
        const getYouTubeId = (url) => {
          const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
          return match ? match[1] : null;
        };

        const videoId = getYouTubeId(currentMedia.youtubeLink);
        const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : currentMedia.youtubeLink;

        return (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-4xl aspect-video">
              <iframe
                className="w-full h-full rounded-lg"
                src={embedUrl}
                title={currentMedia.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-4 text-center max-w-2xl">
              <h3 className="text-lg font-semibold text-black">{currentMedia.title}</h3>
              {currentMedia.description && (
                <p className="text-black mt-1">{currentMedia.description}</p>
              )}
            </div>
          </div>
        );
      case "video":
        return (
          <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-4xl">
              <video
                src={currentMedia.file?.location}
                className="w-full max-h-[60vh] rounded-lg"
                controls
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-4 text-center max-w-2xl">
              <h3 className="text-lg font-semibold text-black">{currentMedia.title}</h3>
              {currentMedia.description && (
                <p className="text-black mt-1">{currentMedia.description}</p>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <FiImage className="h-16 w-16 text-black mb-4" />
            <p className="text-black">Unsupported media type</p>
          </div>
        );
    }
  };

  // Function to render media type icons with counts
  const renderMediaTypeIcons = (stats) => {
    const icons = [];
    
    if (stats.image > 0) {
      icons.push(
        <div key="image" className="flex items-center gap-1 text-gray-600">
          <FiImage className="h-4 w-4" />
          <span className="text-xs">{stats.image}</span>
        </div>
      );
    }
    
    if (stats.video > 0) {
      icons.push(
        <div key="video" className="flex items-center gap-1 text-gray-600">
          <FiVideo className="h-4 w-4" />
          <span className="text-xs">{stats.video}</span>
        </div>
      );
    }
    
    if (stats.youtube > 0) {
      icons.push(
        <div key="youtube" className="flex items-center gap-1 text-gray-600">
          <FiYoutube className="h-4 w-4" />
          <span className="text-xs">{stats.youtube}</span>
        </div>
      );
    }

    return icons;
  };

  // Function to render media thumbnails in modal
  const renderMediaThumbnails = () => {
    if (!selectedGroup || !selectedGroup.media) return null;

    return (
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {selectedGroup.media.map((media, index) => (
          <div
            key={media._id}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              index === currentMediaIndex 
                ? 'border-[#d3b363] ring-2 ring-[#d3b363]' 
                : 'border-gray-600 hover:border-gray-400'
            }`}
            onClick={() => setCurrentMediaIndex(index)}
          >
            {media.filetype === "image" ? (
              <img
                src={media.file?.location}
                alt={media.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x80?text=Error";
                }}
              />
            ) : media.filetype === "youtube" ? (
              <div className="w-full h-full bg-red-600 flex items-center justify-center">
                <FiYoutube className="h-6 w-6 text-white" />
              </div>
            ) : (
              <div className="w-full h-full bg-blue-950 flex items-center justify-center">
                <FiVideo className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Manage Media Groups</h2>
          <p className="text-gray-600 mt-1">Create and manage collections of media items</p>
        </div>
        <Link
          to="./new"
          className="flex items-center gap-2 bg-[#d3b363] hover:bg-black text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Create Media Group
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d3b363]"></div>
          <p className="mt-2 text-gray-600">Loading media groups...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mediaGroups.length > 0 ? (
            mediaGroups.map((group) => {
              const stats = getMediaTypeStats(group.media);
              
              return (
                <div
                  key={group._id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Media Preview */}
                  <div 
                    className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-100 cursor-pointer relative group"
                    onClick={() => openMediaModal(group)}
                  >
                    {getFirstMediaPreview(group.media)}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-200">
                        <FiPlay className="h-6 w-6 text-gray-800" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMediaModal(group);
                        }}
                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <FiPlay className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                          {group.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {group.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Link
                          to={`/media/${group._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                          title="Edit Media Group"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(group._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                          title="Delete Media Group"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Media Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {renderMediaTypeIcons(stats)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {group.media?.length || 0} media items
                      </div>
                    </div>

                    {/* Play Button */}
                    {/* <button
                      onClick={() => openMediaModal(group)}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-[#d3b363] hover:bg-black text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <FiPlay className="h-4 w-4" />
                      Play Collection
                    </button> */}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <FiImage className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No media groups found
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first media group to organize images, videos, and YouTube links in collections.
              </p>
              <div className="mt-4">
                <Link
                  to="/media/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#d3b363] text-white rounded-lg hover:bg-black transition-colors"
                >
                  <FiPlus className="h-5 w-5" />
                  Create Media Group
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Media Modal */}
      {isModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {selectedGroup.name}
                </h2>
                <p className="text-black text-sm">
                  {currentMediaIndex + 1} of {selectedGroup.media?.length || 0}
                </p>
              </div>
              <button
                onClick={closeMediaModal}
                className="text-black hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-auto relative">
              {/* Previous Button - Floating */}
              {selectedGroup.media && selectedGroup.media.length > 1 && (
                <button
                  onClick={goToPrevMedia}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all z-10"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Next Button - Floating */}
              {selectedGroup.media && selectedGroup.media.length > 1 && (
                <button
                  onClick={goToNextMedia}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all z-10"
                >
                  <FiChevronRight className="h-6 w-6" />
                </button>
              )}

              <div className="flex items-center justify-center min-h-[400px]">
                {renderCurrentMedia()}
              </div>

              {/* Media Thumbnails */}
              {renderMediaThumbnails()}
            </div>

            {/* Modal Footer */}
            {/* <div className="flex justify-between items-center p-4 border-t border-gray-700">
              <div className="text-black max-w-md">
                <div className="font-medium text-black">
                  {selectedGroup.media?.[currentMediaIndex]?.title}
                </div>
                {selectedGroup.media?.[currentMediaIndex]?.description && (
                  <div className="text-sm mt-1">
                    {selectedGroup.media?.[currentMediaIndex]?.description}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPrevMedia}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedGroup.media?.length <= 1}
                >
                  <FiChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                <button
                  onClick={goToNextMedia}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedGroup.media?.length <= 1}
                >
                  Next
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div> */}

          </div>
        </div>

      )}
    </div>
  );
};

export default MediaPage;