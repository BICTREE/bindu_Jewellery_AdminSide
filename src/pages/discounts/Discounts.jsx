import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCalendar
} from "react-icons/fi";
import { deleteDiscount, getAllDiscount } from "../../services/discountService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const axiosPrivate = useAxiosPrivate();

  // fetch discount data
  const fetchDiscountData = async () => {
    try {
      const res = await getAllDiscount(axiosPrivate);
      if (res.success) {
        setDiscounts(res.data);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
  useEffect(() => {
    fetchDiscountData();
  }, []);

  // Filter discounts
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch =
      discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" && discount.isActive) ||
      (statusFilter === "inactive" && !discount.isActive);

    return matchesSearch && matchesStatus;
  });

  // Delete Handler
  const handleDelete = async id => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const res = await deleteDiscount(axiosPrivate, id);

        if (res.success) {
          setDiscounts(discounts.filter(discount => discount.id !== id));
          toast.success(`Banner deleted`);
          fetchDiscountData()
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Heading discount add button  */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Discounts</h1>
          <p className="text-neutral-600">
            Manage your discount codes and promotions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/discounts/new"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Discount
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
            placeholder="Search discounts..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sm:col-span-4">
          <select
            className="form-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Expired</option>
          </select>
        </div>
      </div>

      {/* Discounts table */}
      <div className="table-container">
        {filteredDiscounts.length > 0
          ? <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Usage</th>
                  <th>Valid Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.map(discount =>
                  <tr key={discount.id} className="hover:bg-neutral-50">
                    <td>
                      <div className="flex flex-col">
                        <Link
                          title={discount.code}
                          to={`/discounts/${discount._id}`}
                          className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                          {discount.code}
                        </Link>
                        <span className="text-neutral-500 text-xs">
                          {discount.description}
                        </span>
                      </div>
                    </td>
                    <td className="capitalize">
                      {discount.discountType}
                    </td>
                    <td>
                      {discount.discountType === "percentage"
                        ? `${discount.discountValue}%`
                        : `₹ ${discount.discountValue}`}
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span>
                          {discount.usageCount} used
                        </span>
                        {discount.usageLimit > 0 &&
                          <span className="text-xs text-neutral-500">
                            of {discount.usageLimit} available
                          </span>}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center">
                        <FiCalendar className="h-4 w-4 text-neutral-400 mr-1" />
                        <div className="flex flex-col">
                          <span className="text-xs">
                            From:{" "}
                            {new Date(discount.startDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs">
                            To:{" "}
                            {new Date(discount.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${discount.isActive
                          ? "bg-success-100 text-success-800"
                          : discount.status === "scheduled"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-error-100 text-error-800"}`}
                      >
                        {discount.isActive ? "Available" : "Not Available"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/discounts/${discount._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="text-error-600 hover:text-error-900"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          : <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-500 mb-3">
                <FiSearch className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">
                No discounts found
              </h3>
              <p className="text-neutral-500">
                Try adjusting your search or filter to find what you re looking
                for.
              </p>
              <div className="mt-4">
                <Link to="/discounts/new" className="btn btn-primary">
                  <FiPlus className="mr-2 h-4 w-4" />
                  Add Discount
                </Link>
              </div>
            </div>}
      </div>
    </div>
  );
}

export default Discounts;
