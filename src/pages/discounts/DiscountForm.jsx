import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSave, FiTrash } from "react-icons/fi";
import { createDiscount, deleteDiscount, getDiscountById, updateDiscount } from "../../services/discountService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function DiscountForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    isActive: true,
    appliesAutomatically: false,
    applicableProducts: [],
    applicableCategories: []
  });

  // Helper function to safely parse dates
  const parseDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        if (isEditing && id) {
          const discount = await getDiscountById(axiosPrivate, id);
          
          setFormData({
            code: discount.data.code || "",
            description: discount.data.description || "",
            discountType: discount.data.discountType || "percentage",
            discountValue: discount.data.discountValue || "",
            minOrderAmount: discount.data.minOrderAmount || "",
            maxDiscountAmount: discount.data.maxDiscountAmount || "",
            startDate: parseDate(discount.data.startDate),
            endDate: parseDate(discount.data.endDate),
            isActive: discount.data.isActive !== undefined ? discount.data.isActive : true,
            appliesAutomatically: discount.data.appliesAutomatically || false,
            applicableProducts: discount.data.applicableProducts || [],
            applicableCategories: discount.data.applicableCategories || []
          });
        }
      } catch (err) {
        console.error("Failed to load discount:", err);
        toast.error("Failed to load discount data");
      }
    };

    fetchDiscount();
  }, [id, isEditing, axiosPrivate]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? (value === "" ? "" : Number(value)) : value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.code || !formData.discountValue || !formData.startDate || !formData.endDate) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate dates
      const fromDate = new Date(formData.startDate);
      const toDate = new Date(formData.endDate);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        toast.error("Invalid date values");
        return;
      }

      if (fromDate >= toDate) {
        toast.error("End date must be after start date");
        return;
      }

      // Validate discount value
      if (formData.discountType === "percentage" && (formData.discountValue <= 0 || formData.discountValue > 100)) {
        toast.error("Percentage discount must be between 1 and 100");
        return;
      }

      if (formData.discountType === "fixed" && formData.discountValue <= 0) {
        toast.error("Fixed discount must be greater than 0");
        return;
      }

      // Prepare payload
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderAmount: formData.minOrderAmount === "" ? null : Number(formData.minOrderAmount),
        maxDiscountAmount: formData.maxDiscountAmount === "" ? null : Number(formData.maxDiscountAmount),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      // Submit data
      if (isEditing) {
        await updateDiscount(axiosPrivate, id, payload);
        toast.success("Discount updated successfully");
      } else {
        await createDiscount(axiosPrivate, payload);
        toast.success("Discount created successfully");
      }

      navigate("/discounts");
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error.response?.data?.message || "Failed to save discount");
    } finally {
      setIsSubmitting(false);
    }
  };

    // Delete Handler
    const handleDelete = async id => {
      if (window.confirm("Are you sure you want to delete this banner?")) {
        try {
          const res = await deleteDiscount(axiosPrivate, id);
  
          if (res.success) {
            toast.success(`Banner deleted`);
            navigate("/discounts");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isEditing ? "Edit Discount" : "Add New Discount"}
          </h1>
          <p className="text-neutral-600">
            {isEditing ? "Update discount information" : "Create a new discount code"}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link to="/discounts" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Discount"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Discount Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="code" className="form-label">
                Discount Code <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="form-input uppercase"
                required
                disabled={isEditing}
              />
              <p className="mt-2 text-xs text-neutral-500">
                Customers will enter this code at checkout
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="discountType" className="form-label">
                Discount Type <span className="text-error-500">*</span>
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="discountValue" className="form-label">
                Value <span className="text-error-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                {formData.discountType === "fixed" && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">₹</span>
                  </div>
                )}
                <input
                  type="number"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  min="0"
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className={`form-input ${formData.discountType === "fixed" ? "pl-7" : ""}`}
                  required
                />
                {formData.discountType === "percentage" && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-neutral-500 sm:text-sm">%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="minOrderAmount" className="form-label">
                Minimum Order Amount <span className="text-error-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="minOrderAmount"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  className="form-input pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="maxDiscountAmount" className="form-label">
                Maximum Discount Amount <span className="text-error-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="maxDiscountAmount"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  className="form-input pl-7"
                  placeholder="No limit"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Summer sale discount"
              />
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="form-checkbox h-4 w-4 text-primary-600"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-neutral-700">
                  Active
                </label>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="appliesAutomatically"
                  name="appliesAutomatically"
                  checked={formData.appliesAutomatically}
                  onChange={handleChange}
                  required
                  className="form-checkbox h-4 w-4 text-primary-600"
                />
                <label htmlFor="appliesAutomatically" className="ml-2 block text-sm text-neutral-700">
                  Applies Automatically <span className="text-error-500">*</span>
                </label>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                If checked, discount will be applied automatically without requiring a code
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            Validity Period
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="startDate" className="form-label">
                Start Date <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endDate" className="form-label">
                End Date <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
                required
                min={formData.startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleDelete(id)}
            >
              <FiTrash className="mr-2 h-4 w-4" />
              Delete Discount
            </button>
          )}
          <Link to="/discounts" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Discount"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DiscountForm;