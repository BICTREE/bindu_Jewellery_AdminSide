import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiSave } from 'react-icons/fi'
import CreatableSelect from 'react-select/creatable'
import { getVariations } from '../../services/variationService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { getOptions } from '../../services/optionService'
import ImageUpload from '../../components/common/ImageUpload'
import { uploadSingleFile } from '../../services/uploadService'
import MultiImageUploader from '../../components/common/MultiImageUploader'
import { createProduct, getProduct, updateProduct, updateProductStatus } from '../../services/productService'

function ProductForm() {
  const axiosPrivate = useAxiosPrivate()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialData = {
    name: '',
    brand: '',
    description: '',
    hsn: '',
    price: '',
    tax: '',
    thumbnail: null,
    images: [],
    isFeatured: false,
    tags: [],
    features: [],
    careTips: [],
    variantItems: [{
      itemId: crypto.randomUUID(),
      sku: "",
      stock: 0,
      extraPrice: 0,
      specs: [{
        specId: crypto.randomUUID(),
        variationId: "",
        optionId: ""
      }]
    }],
    isArchived: false,
  }

  const [formData, setFormData] = useState({ ...initialData })

  const fetchProduct = async () => {
    try {
      const data = await getProduct(axiosPrivate, id)

      if (data.success) {
        const result = data?.data?.result;
        const modified = {
          ...result,
          careTips: result?.careTips?.map(item => ({ label: item, value: item })),
          features: result?.features?.map(item => ({ label: item, value: item })),
          tags: result?.tags?.map(item => ({ label: item, value: item })),
          variantItems: result?.variantItems?.map(vitem => {
            vitem.specs = vitem?.specs?.map(sitem => {
              return {
                variationId: sitem?.variationId?._id,
                optionId: sitem?.optionId?._id,
                specId: crypto.randomUUID()
              }
            })

            vitem.itemId = crypto.randomUUID()

            return vitem
          }
          )
        }
        setFormData(modified)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    // If editing, fetch product data
    if (isEditing) {
      fetchProduct(IDBDatabase)
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData?.name || !formData?.price) {
        toast.error('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        const modified = {
          ...formData,
          tags: formData?.tags?.map(item => item?.value),
          features: formData?.features?.map(item => item?.value),
          careTips: formData?.careTips?.map(item => item?.value),
        }
        const data = await updateProduct(axiosPrivate, id, modified)
        if (data?.success) {
          const dt = data?.data?.result;
          setFormData(dt)
        }
        toast.success(`Product updated successfully`)
        navigate('/products')
      } else {
        const modified = {
          ...formData,
          tags: formData?.tags?.map(item => item?.value),
          features: formData?.features?.map(item => item?.value),
          careTips: formData?.careTips?.map(item => item?.value),
        }
        const data = await createProduct(axiosPrivate, modified)
        if (data?.success) {
          const dt = data?.data?.result;
          setFormData(dt)
        }
        toast.success(`Product created successfully`)
        navigate('/products')

      }

    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectHandleChange = (newValue) => {
    return (field) => {
      // setFormData((prev) => ({ ...prev, [field]: newValue?.map(item => item?.value) }))
      setFormData((prev) => ({ ...prev, [field]: newValue }))
    }
  };

  const addVarItem = () => {
    const item = {
      itemId: crypto.randomUUID(),
      sku: "",
      stock: 0,
      extraPrice: 0,
      specs: []
    }

    setFormData((prev) => ({
      ...prev,
      variantItems: [
        ...prev.variantItems,
        item
      ]
    }))
  }

  const removeVarItem = (itemId) => {
    const newArr = formData?.variantItems?.filter(item => item?.itemId !== itemId)
    setFormData((prev) => ({
      ...prev,
      variantItems: [...newArr]
    }))
  }

  const handleImageChange = async (e) => {
    try {
      const data = await uploadSingleFile(axiosPrivate, e.target.files[0])

      if (data.success) {
        setFormData({
          ...formData,
          thumbnail: data.data.file,
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const data = await updateProductStatus(axiosPrivate, productId, newStatus);

      if (data.success) {
        setFormData((prev) => { return { ...prev, isArchived: newStatus === 'archived' } });
      } else {
        toast.error(data.message || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  console.log({ formData })

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-neutral-600">
            {isEditing ? 'Update product information' : 'Create a new product in your catalog'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/products"
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
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card p-6 h-fit">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="form-label">
                Product Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData?.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="brand" className="form-label">
                brand <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData?.brand}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData?.description}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="hsn" className="form-label">
                hsn
              </label>
              <input
                type="text"
                id="hsn"
                name="hsn"
                value={formData?.hsn}
                onChange={handleChange}
                className="form-input"
              />
            </div>


            <div className="sm:col-span-3">
              <div className="flex justify-between">
                <label htmlFor="price" className="form-label">
                  Price <span className="text-error-500">*</span>
                </label>
                <span className="text-xs text-neutral-500">Rs</span>
              </div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-neutral-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  name="price"
                  value={formData?.price}
                  onChange={handleChange}
                  className="form-input pl-7"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="tax" className="form-label">
                tax
              </label>
              <input
                type="text"
                id="tax"
                name="tax"
                value={formData?.tax}
                onChange={handleChange}
                className="form-input"
              />
            </div>



            <div className="sm:col-span-2 flex items-center pt-5">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData?.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-neutral-700">
                Featured product
              </label>
            </div>


            <div className="sm:col-span-2">
              <label htmlFor="tags" className="form-label">
                Tags
              </label>
              <div className='w-full z-[9999]'>
                <CreatableSelect
                  isMulti
                  options={formData?.tags}
                  value={formData?.tags}
                  onChange={(val) => selectHandleChange(val)('tags')}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 })
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="features" className="form-label">
                Features
              </label>
              <div className='w-full z-[9999]'>
                <CreatableSelect
                  isMulti
                  options={formData?.features}
                  value={formData?.features}
                  onChange={(val) => selectHandleChange(val)('features')}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 })
                  }}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="features" className="form-label">
                Care Tips
              </label>
              <div className='w-full z-[9999]'>
                <CreatableSelect
                  isMulti
                  options={formData?.careTips}
                  value={formData?.careTips}
                  onChange={(val) => selectHandleChange(val)('careTips')}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: base => ({ ...base, zIndex: 9999 })
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="card p-6">
          <div className="flex flex-col justify-between items-center mb-4">
            <div className='w-full flex justify-between item-center'>
              <h2 className="text-lg font-medium text-neutral-900">Variant Items</h2>
              <button
                onClick={addVarItem}
                className='text-xs bg-blue-500 text-white px-2 rounded-lg'>
                Add
              </button>
            </div>
            <div className="flex flex-col justify-between items-center mb-4 gap-4">
              {
                formData?.variantItems?.length > 0
                &&
                (
                  formData?.variantItems?.map((item, index) => (
                    <VariantItem data={item} setData={(val) => {
                      console.log({ val })
                      const mapped = formData?.variantItems?.map(elem => {
                        if (item?.itemId === elem?.itemId) {
                          console.log({})
                          return val
                        }

                        return elem
                      })

                      setFormData((prev) => ({ ...prev, variantItems: [...mapped] }))
                    }}

                      index={index} removeVarItem={removeVarItem} />
                  ))
                )
              }
            </div>
          </div>
        </div>

        {/* thumbnail images */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">thumbnail Image</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              {formData.thumbnail ? (
                <div className="relative">
                  <img
                    src={formData.thumbnail?.location}
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
                <li>Use high-quality images that represent the product</li>
                <li>Recommended size: 800x600 pixels</li>
                <li>Keep the file size under 5MB</li>
                <li>Use a consistent style across products</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Images */}
        <MultiImageUploader images={formData?.images} setImages={(val) => setFormData((prev) => ({
          ...prev,
          images: val
        }))} />

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
            to="/products"
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
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductForm

function VariantItem({ data, setData, index, removeVarItem }) {
  const axiosPrivate = useAxiosPrivate()
  const handleVarItemChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value
    })
  }


  const addSpec = () => {
    const spec = {
      specId: crypto.randomUUID(),
      variationId: "",
      optionId: ""
    }

    setData({
      ...data,
      specs: [
        ...data.specs,
        spec
      ]
    })
  }

  const removeSpec = (specId) => {
    const newArr = data?.specs?.filter(elem => elem?.specId !== specId)
    setData({
      ...data,
      specs: [...newArr]
    })
  }

  return (
    <div className="card p-6 ">
      <div className='flex justify-between item-center'>
        <h2 className="text-sm font-medium text-neutral-900 mb-4">Variant Item {index + 1}</h2>
        <button
          onClick={() => removeVarItem(data?.itemId)}
          className='text-xs bg-red-500 text-white  px-2 rounded-lg'>
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="sku" className="form-label">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={data?.sku}
            onChange={handleVarItemChange}
            className="form-input"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="stock" className="form-label">
            Stock <span className="text-error-500">*</span>
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={data?.stock}
            onChange={handleVarItemChange}
            className="form-input"
            required
          />
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="extraPrice" className="form-label">
            Extra Price
          </label>
          <input
            type="number"
            name="extraPrice"
            value={data?.extraPrice}
            onChange={handleVarItemChange}
            className="form-input"
          />
        </div>


        <div className=" sm:col-span-6">
          <div className="flex flex-col justify-between items-center mb-4">
            <div className='w-full flex justify-between item-center'>
              <h2 className="text-sm font-medium text-neutral-900">Specs</h2>
              <button
                onClick={addSpec}
                className='text-xs bg-blue-500 text-white px-2 rounded-lg'>
                Add
              </button>
            </div>
            <div className="flex flex-col justify-between items-center mb-4 gap-4">
              {
                data?.specs?.length > 0
                &&
                (
                  data?.specs?.map((item, idx) => (
                    <Spec data={item} setData={(val) => {
                      const mapped = data?.specs?.map(elem => {
                        if (item?.specId === elem?.specId) {
                          return val
                        }

                        return elem
                      })

                      setData({ ...data, specs: [...mapped] })
                    }}

                      index={idx} removeSpec={removeSpec} />
                  ))
                )
              }
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

function Spec({ data, setData, index, removeSpec }) {

  const axiosPrivate = useAxiosPrivate()
  const [variations, setVariations] = useState([])
  const [options, setOptions] = useState([])

  const handleSpecChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value
    })
  }

  const fetchVariations = async () => {
    try {
      const data = await getVariations(axiosPrivate, {})

      if (data.success) {
        const dt = data.data.result;
        setVariations(dt)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchOptions = async () => {
    try {
      const data = await getOptions(axiosPrivate, {})

      if (data.success) {
        const dt = data.data.result;
        setOptions(dt)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchVariations()
    fetchOptions()
  }, [])

  return (
    <div className="card p-6 ">
      <div className='flex justify-between item-center'>
        <h2 className="text-sm font-medium text-neutral-900 mb-4">Specification {index + 1}</h2>
        <button
          onClick={() => removeSpec(data?.specId)}
          className='text-xs bg-red-500 text-white  px-2 rounded-lg'>
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label htmlFor="variationId" className="form-label">
            variation <span className="text-error-500">*</span>
          </label>
          <select
            id="variationId"
            name="variationId"
            value={data?.variationId}
            onChange={handleSpecChange}
            className="form-input"
            required
          >
            <option value="">Select a variation</option>
            {variations.map(variation => (
              <option key={variation._id} value={variation._id}>
                {variation.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="optionId" className="form-label">
            option <span className="text-error-500">*</span>
          </label>
          <select
            id="optionId"
            name="optionId"
            value={data?.optionId}
            onChange={handleSpecChange}
            className="form-input"
            required
          >
            <option value="">Select a option</option>
            {options.map(option => (
              <option key={option._id} value={option._id}>
                {option.value}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  )
}