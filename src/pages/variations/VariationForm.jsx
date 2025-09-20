import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiSave, FiTrash, } from 'react-icons/fi'
import { createVariation, deleteVariation, getVariation, updateVariation } from '../../services/variationService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import CreatableSelect from 'react-select/creatable'
import { getOptions } from '../../services/optionService'

function VariationForm() {
  const axiosPrivate = useAxiosPrivate()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialData = {
    name: '',
    options: []
  }
  const [formData, setFormData] = useState({
    ...initialData
  })

  const [options, setOptions] = useState([])


  const fetchOptions = async () => {
    try {
      const data = await getOptions(axiosPrivate, {});

      if (data.success) {
        setOptions(data.data?.result || []);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(()=>{
    fetchOptions()
  },[])

  const initialOptions = options?.map(item => ({ label: item?.value, value: item?._id })) ?? []

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);

  const selectHandleChange = (newValue) => {
    setSelectedOptions(newValue);
    setFormData((prev) => ({ ...prev, options: newValue?.map(item => item?.value) }))
  };

  const fetchVariation = async (id) => {
    try {
      const data = await getVariation(axiosPrivate, id)

      if (data.success) {
        const variation = data.data.result;
        setFormData(variation)

        const opts = data?.data?.result?.options?.map(item=> ({ label: item?.value, value: item?._id }))
        setSelectedOptions(opts)

      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isEditing) {
      fetchVariation(id)
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
      // Validate form data
      if (!formData.name) {
        toast.error('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        const data = await updateVariation(axiosPrivate, id, formData)

        if (data.success) {
          toast.success(`variation updated successfully`)
          navigate('/variations')
        }

      } else {
        const data = await createVariation(axiosPrivate, formData)

        if (data.success) {
          toast.success(`variation created successfully`)
          navigate('/variations')
        }
      }

    } catch (error) {
      console.error('Error saving variation:', error)
      toast.error('Failed to save variation')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this variation?')) {
      try {
        const data = await deleteVariation(axiosPrivate, id)

        if (data.success) {
          setFormData({ ...initialData })
          toast.success(`variation deleted`)
          navigate('/variations')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {isEditing ? 'Edit variation' : 'Add New variation'}
          </h1>
          <p className="text-neutral-600">
            {isEditing ? 'Update variation information' : 'Create a new variation in your catalog'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/variations"
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
            {isSubmitting ? 'Saving...' : 'Save variation'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="form-label">
                Variation name <span className="text-error-500">*</span>
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
                Options
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

          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {isEditing && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleDelete(formData?._id)}
            >
              <FiTrash className="mr-2 h-4 w-4" />
              Delete variation
            </button>
          )}
          <Link
            to="/variations"
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
            {isSubmitting ? 'Saving...' : 'Save variation'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VariationForm