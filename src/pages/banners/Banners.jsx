import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from "react-icons/fi";
import { deleteBanner, getAllBanner } from "../../services/bannerService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const axiosPrivate = useAxiosPrivate();

  const fetchBannerData = async () => {
    const res = await getAllBanner(axiosPrivate);
    console.log(res.data.result);
    setBanners(res.data.result);
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  // Filter banners
  const filteredBanners = banners.filter(banner => {
    const matchesSearch =
      banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "" || banner.screenType === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // delete handler
  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const res = await deleteBanner(axiosPrivate, id);

        if (res.success) {
          setBanners(banners.filter(banner => banner._id !== id));
          toast.success(`Banner deleted`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Banners</h1>
          <p className="text-neutral-600">Manage your promotional banners</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/banners/new" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2 h-4 w-4" />
            Add Banner
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search banners..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sm:col-span-4 focus:outline-none">
          <select
            className="form-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Screen Type</option>
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </div>

      {/* Banners grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBanners.length > 0
          ? filteredBanners.map(banner =>
              <div
                key={banner._id}
                className="card hover:shadow-md transition-shadow duration-200 relative"
              >
                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-neutral-200">
                  <img
                    src={banner.image.location}
                    alt={banner.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2 z-50">
                    <Link
                      title={banner.title}
                      to={`/banners/${banner._id}`}
                      className="h-8 w-8 rounded-full bg-white bg-opacity-75 text-primary-600 shadow-sm flex items-center justify-center hover:bg-opacity-100"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="h-8 w-8 rounded-full bg-white bg-opacity-75 text-error-600 shadow-sm flex items-center justify-center hover:bg-opacity-100"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 mt-1">
                  <h2 className="text-lg font-medium text-neutral-900 capitalize">
                    {banner.title}
                  </h2>
                   <p className="text-xs text-neutral-700 capitalize my-1 text">
                      {banner.subtitle.trim().split(/\s+/).slice(0, 18).join(" ")}
                    </p>
                  <div className="flex items-center gap-4 my-2">
                   
                    <p className="text-xs text-neutral-500 capitalize">
                     {banner.panel} slide {banner.index}
                    </p>
                    <p className="text-xs text-neutral-500 capitalize">
                      {banner.screenType}
                    </p>
                  </div>
                </div>
              </div>
            )
          : <div className="col-span-full p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-500 mb-3">
                <FiImage className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">
                No banners found
              </h3>
              <p className="text-neutral-500">
                {`Try adjusting your search or filter to find what you're looking
                for.`}
              </p>
              <div className="mt-4">
                <Link to="/banners/new" className="btn btn-primary">
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Banner
                </Link>
              </div>
            </div>}
      </div>
    </div>
  );
}

export default Banners;
