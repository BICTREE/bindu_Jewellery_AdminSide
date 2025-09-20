import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiSave, FiTrash, } from 'react-icons/fi'
import { createOption, deleteOption, getOption, updateOption } from '../../services/optionService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

function OptionForm() {
  const axiosPrivate = useAxiosPrivate()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [isSubmitting, setIsSubmitting] = useState(false)

  const initialData = {
    value: '',
  }
  const [formData, setFormData] = useState({
    ...initialData
  })

  const fetchOption = async (id) => {
    try {
      const data = await getOption(axiosPrivate, id)

      if (data.success) {
        const option = data.data.result;
        setFormData(option)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isEditing) {
      fetchOption(id)
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
      if (!formData.value) {
        toast.error('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      if (isEditing) {
        const data = await updateOption(axiosPrivate, id, formData)

        if (data.success) {
          toast.success(`option updated successfully`)
          navigate('/options')
        }

      } else {
        const data = await createOption(axiosPrivate, formData)

        if (data.success) {
          toast.success(`option created successfully`)
          navigate('/options')
        }
      }

    } catch (error) {
      console.error('Error saving option:', error)
      toast.error('Failed to save option')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        const data = await deleteOption(axiosPrivate, id)

        if (data.success) {
          setFormData({ ...initialData })
          toast.success(`Option deleted`)
          navigate('/options')
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
            {isEditing ? 'Edit option' : 'Add New option'}
          </h1>
          <p className="text-neutral-600">
            {isEditing ? 'Update option information' : 'Create a new option in your catalog'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/options"
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
            {isSubmitting ? 'Saving...' : 'Save option'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="form-label">
                Option Value <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="value"
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="form-input"
                required
              />
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
              Delete option
            </button>
          )}
          <Link
            to="/options"
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
            {isSubmitting ? 'Saving...' : 'Save option'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OptionForm