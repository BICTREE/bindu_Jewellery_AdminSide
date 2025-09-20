import { useState, useEffect } from 'react'
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

  const [formData, setFormData] = useState({
    name: '',
    parent: null,
    description: '',
    slug: '',
    image: '',
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

  const handleImageChange = async (e) => {
    try {
      const data = await uploadSingleFile(axiosPrivate, e.target.files[0])

      if (data.success) {
        setFormData({
          ...formData,
          image: data.data.file,
        })
      }
    } catch (error) {
      console.log(error)
    }
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
      const data = await getCategories(axiosPrivate, { search });

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
                    <option value={item?._id}>{item?.name}</option>
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
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Category Image</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image?.location}
                    alt={formData.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <ImageUpload handleImageChange={handleImageChange} kind={`change`} />
                </div>
              ) : (
                <ImageUpload handleImageChange={handleImageChange} kind={`upload`} />
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Image Guidelines</h3>
              <ul className="text-sm text-neutral-600 space-y-1 list-disc pl-5">
                <li>Use high-quality images that represent the category</li>
                <li>Recommended size: 800x600 pixels</li>
                <li>Keep the file size under 5MB</li>
                <li>Use a consistent style across categories</li>
              </ul>
            </div>
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