import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBox } from 'react-icons/fi'
import { mockCategories } from '../../data/mockData'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getCategories } from '../../services/categoryService';
import StatusIndicator from '../../components/common/StatusIndicator';

function Categories() {
  const axiosPrivate = useAxiosPrivate();

  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')

  const fetchCategories = async () => {
      try {
        const data = await getCategories(axiosPrivate, {search});
  
        if (data.success) {
          setCategories(data.data?.result || []);
        }
      } catch (error) {
        console.error('Error fetching Categories:', error);
      }
    };

  useEffect(() => {
   fetchCategories()
  }, [search])

  // Filter categories
  // const categories = categories.filter(category =>
  //   category?.name.toLowerCase().includes(search.toLowerCase()) ||
  //   category?.description.toLowerCase().includes(search.toLowerCase())
  // )

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      // In a real app, make an API call to delete
      setCategories(categories.filter(category => category?._id !== id))
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Categories</h1>
          <p className="text-neutral-600">Manage your product categories</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/categories/new"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="form-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category?._id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-neutral-200">
                <img
                  src={category?.image?.location}
                  alt={category?.name}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">
                      {category?.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {category?.description}
                    </p>
                  </div>
                  <div className="flex items-center ml-4">
                    <Link
                      to={`/categories/${category?._id}`}
                      className="text-primary-600 hover:text-primary-900 mr-2"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>

                    <StatusIndicator kind="archive" value={category?.isArchived} />
                    
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <FiBox className="mr-1.5 h-4 w-4 text-neutral-500" />
                  <span>{category?.productIds?.length} products</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-500 mb-3">
              <FiSearch className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No categories found</h3>
            <p className="text-neutral-500">
              Try adjusting your search or add a new category?.
            </p>
            <div className="mt-4">
              <Link
                to="/categories/new"
                className="btn btn-primary"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Add Category
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories