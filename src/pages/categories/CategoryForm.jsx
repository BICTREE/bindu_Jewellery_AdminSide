import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiSave, FiTrash, FiUpload } from 'react-icons/fi'
import { mockCategories } from '../../data/mockData'
import CreatableSelect from 'react-select/creatable'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { getProducts } from '../../services/productService'
import ImageUpload from '../../components/common/ImageUpload'
import { uploadSingleFile } from '../../services/uploadService'
import { createCategory, getCategories, getCategory, updateCategory, updateCategoryStatus } from '../../services/categoryService'

function CategoryForm() {
  const axiosPrivate = useAxiosPrivate();
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refs for file inputs
  const mainImageInputRef = useRef(null)
  const hoverImageInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    parent: null,
    description: '',
    slug: '',
    image: '',
    hoverImage: '',
    productIds: [],
    isArchived: null,
  })

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const initialOptions = products?.map(item => ({ label: item?.name, value: item?._id })) ?? []

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);

  const selectHandleChange = (newValue) => {
    setSelectedOptions(newValue);
    setFormData((prev) => ({ ...prev, productIds: newValue?.map(item => item?.value) }))
  };

  const fetchCategory = async () => {
    try {
      const data = await getCategory(axiosPrivate, id)
      if (data.success) {
        const category = data.data.category;
        if (category) {
          setFormData({
            name: category?.name,
            parent: category?.parent?._id,
            description: category?.description,
            image: category?.image,
            hoverImage: category?.hoverImage,
            isArchived: category?.isArchived,
            productIds: category?.productIds?.map(item => item?._id)
          })

          const opts = category?.productIds?.map(item => ({ label: item?.name, value: item?._id })) ?? []
          setSelectedOptions(opts)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // If editing, fetch category data
    if (isEditing) {
      fetchCategory()
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Automatically generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }))
    }
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

  const handleHoverImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      await handleImageUpload(file, 'hoverImage')
    }
    // Reset the input
    e.target.value = ''
  }

  const triggerMainImageInput = () => {
    mainImageInputRef.current?.click()
  }

  const triggerHoverImageInput = () => {
    hoverImageInputRef.current?.click()
  }

  const removeImage = (imageType) => {
    setFormData(prev => ({
      ...prev,
      [imageType]: '',
    }))
    toast.info(`${imageType === 'image' ? 'Main image' : 'Hover image'} removed`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form data
      if (!formData.name) {
        toast.error('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        const data = await updateCategory(axiosPrivate, id, formData)

        if (data.success) {
          toast.success(`Category updated successfully`)
          navigate('/categories')
        }

      } else {
        const data = await createCategory(axiosPrivate, formData)

        if (data.success) {
          toast.success(`Category created successfully`)
          navigate('/categories')
        }
      }

    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await getProducts(axiosPrivate, {});

      if (data.success) {
        setProducts(data.data?.result || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories(axiosPrivate, {});

      if (data.success) {
        setCategories(data.data?.result || []);
      }
    } catch (error) {
      console.error('Error fetching Categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleStatusChange = async (categoryId, newStatus) => {
    try {
      const data = await updateCategoryStatus(axiosPrivate, categoryId, newStatus);

      if (data.success) {
        setFormData((prev) => { return { ...prev, isArchived: newStatus === 'archived' } });
      } else {
        toast.error(data.message || 'Failed to update category status');
      }
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  console.log({ formData })

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-neutral-600">
            {isEditing ? 'Update category information' : 'Create a new product category'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/categories"
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Category Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="form-label">
                Category Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="name" className="form-label">
                Parent
              </label>
              <select
                id="parent"
                name="parent"
                value={formData.parent}
                onChange={handleChange}
                className="form-input"
              >
                <option value={null}>N/A</option>
                {
                  categories?.map((item) => (
                    <option key={item._id} value={item?._id}>{item?.name}</option>
                  ))
                }
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="products" className="form-label">
                Add Products
              </label>
              <div className='w-full z-[9999]'>
                <CreatableSelect
                  isMulti
                  options={initialOptions}
                  value={selectedOptions}
                  onChange={selectHandleChange}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 })
                  }}
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
              />
            </div>

          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Category Images</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Main Image */}
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Main Image</h3>
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

            {/* Hover Image */}
            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Hover Image</h3>
              {formData.hoverImage ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <img
                    src={formData.hoverImage?.location}
                    alt={`${formData.name} hover`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={triggerHoverImageInput}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition"
                    >
                      <FiUpload className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage('hoverImage')}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition text-red-600"
                    >
                      <FiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={triggerHoverImageInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition"
                >
                  <div className="flex flex-col items-center justify-center h-48">
                    <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload hover image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              )}
              {/* Hidden file input for hover image */}
              <input
                type="file"
                ref={hoverImageInputRef}
                className="hidden"
                onChange={handleHoverImageChange}
                accept="image/*"
              />
            </div>
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

        <div className="flex justify-end space-x-3">
          {isEditing && (
            formData?.isArchived
              ?
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleStatusChange(id, 'unarchived')}
              >
                Unarchive
              </button>
              :
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleStatusChange(id, 'archived')}
              >
                Archive
              </button>
          )}
          <Link
            to="/categories"
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            <FiSave className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CategoryForm