import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi'
import { deleteOption, getOptions} from '../../services/optionService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Pagination from '../../components/common/Pagination'
import { toast } from 'react-toastify'

function Options() {

  const [options, setOptions] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  const fetchOptions = async () => {
    try {
      const data = await getOptions(axiosPrivate, {
        page,
        entries,
        search,
      });

      if (data.success) {
        setOptions(data.data?.result || []);
        setTotalEntries(data.data?.pagination?.totalEntries || 0);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    fetchOptions()
  }, [page, entries, search])


  const handleDelete = async(id) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        const data = await deleteOption(axiosPrivate, id)

        if(data.success){
          setOptions(options.filter(option => option?._id !== id))
          toast.success(`Option deleted`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Options</h1>
          <p className="text-neutral-600">Manage your option catalog</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/options/new"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add option
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search options..."
            className="form-input pl-10 p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearch('')}
            >
              <FiX className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          )}
        </div>

      </div>


      {/* options table */}
      <div className="table-container">
        {options.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>option</th>
              
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option?._id} className="hover:bg-neutral-50">
                  <td className="flex items-center">
                    
                    <div className="flex flex-col">
                      <Link
                        to={`/options/${option?._id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {option?.value}
                      </Link>
                    
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/options/${option?._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(option?._id)}
                        className="text-error-600 hover:text-error-900"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-500 mb-3">
              <FiSearch className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No options found</h3>
            <p className="text-neutral-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {options?.length > 0 && (
        <Pagination data={options} page={page} entries={entries} setPage={setPage} totalEntries={totalEntries} />
      )}


    </div>
  )
}

export default Options