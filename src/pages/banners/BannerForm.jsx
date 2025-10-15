import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSave, FiTrash, FiUpload } from "react-icons/fi";
import { uploadSingleFile } from "../../services/uploadService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { createBanner, deleteBanner, getABanner, updateBanner } from "../../services/bannerService";

function BannerForm() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const isEditing = !!id;
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDe, setIsLoadingDe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    panel: "",
    index: "",
    screenType: "",
    image: {}
  });

  const axiosPrivate = useAxiosPrivate();

  console.log(id)

  const getABannerData = async()=>{
    try{
      const res = await getABanner(axiosPrivate, id);
      console.log(res);
      const data= res.data.banner
      if(res.success){
        setFormData({
        title: data.title || "",
        subtitle: data.subtitle || "",
        panel: data.panel || "",
        index: data.index || "",
        screenType: data.screenType || "",
        image: data.image || {}
       });
      }
     
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if (isEditing) {
      getABannerData()
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const data = await uploadSingleFile(axiosPrivate, file);
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          image: data.data.file
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Image upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.panel || !formData.screenType || !formData.image?.location) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
       console.log(formData , "updated form data")
      let res;
      {
        isEditing ? 
        res = await updateBanner(axiosPrivate,id, formData) :
        res = await createBanner(axiosPrivate, formData)
      }
      if(res.success){
        toast.success(`Banner ${isEditing ? "updated" : "created"} successfully`);
        navigate("/banners");
      }
    
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete handler
  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
        setIsLoadingDe(true)
      try {
        const res = await deleteBanner(axiosPrivate, id);

        if (res.success) {
           toast.success("Banner deleted successfully");
           navigate("/banners");
        }
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoadingDe(false)
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isEditing ? "Edit Banner" : "Add New Banner"}
          </h1>
          <p className="text-neutral-600">
            {isEditing
              ? "Update banner information"
              : "Create a new promotional banner"}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/banners" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Banner Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="title" className="form-label">
                Title <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="subtitle" className="form-label">
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="panel" className="form-label">
                Panel <span className="text-error-500">*</span>
              </label>
              <select
                id="panel"
                name="panel"
                value={formData.panel}
                onChange={handleChange}
                className="form-input"
                required
              >
                {/* IMPOTENT => Don't remove the value part if u want change the value from the option then should update as well frontend  */}
                <option value="">-- Select --</option>
                <option value="home">Home</option>
                <option value="shop">Shop</option>
                <option value="about1">About one</option>
                <option value="about2">About two</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="screenType" className="form-label">
                Screen Type <span className="text-error-500">*</span>
              </label>
              <select
                id="screenType"
                name="screenType"
                value={formData.screenType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">-- Select --</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="index" className="form-label">
                Index
              </label>
              <input
                type="number"
                id="index"
                name="index"
                min={0}
                max={5}
                value={formData.index}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Banner Image
          </h2>

          {/* Banner image uploading part */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              {formData.image?.location ? (
                <div className="relative">
                  {isLoading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <img
                        src={formData.image.location}
                        alt={formData.image.name}
                        className="w-full h-48 object-contain rounded-md"
                      />
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="mt-2 btn btn-secondary btn-sm"
                      >
                        Change Image
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="flex justify-center p-6 border-2 border-neutral-300 border-dashed rounded-md">
                  {isLoading ? (
                    "Uploading..."
                  ) : (
                    <div className="text-center">
                      <FiUpload className="mx-auto h-12 w-12 text-neutral-400" />
                      <div className="text-sm text-neutral-600">
                        <button
                          type="button"
                          onClick={openFilePicker}
                          className="font-medium text-primary-600 hover:text-primary-500"
                        >
                          Upload an image
                        </button>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/gif"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                      </div>
                      <p className="text-xs text-neutral-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-2">
                Image Guidelines
              </h3>
              <ul className="text-sm text-neutral-600 list-disc pl-5">
                <li>Use high-quality images</li>
                <li>Recommended size: 1920x600 pixels</li>
                <li>File size under 2MB</li>
                <li>Use images that work well with text overlays</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={()=>handleDelete(id)}
            >
              <FiTrash className="mr-2 h-4 w-4" />
              
              {isLoadingDe ? "Deleting..." : "Delete Banner"}
            </button>
          )}
          <Link to="/banners" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BannerForm;
