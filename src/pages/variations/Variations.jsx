import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi'
import { deleteVariation, getVariations } from '../../services/variationService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Pagination from '../../components/common/Pagination'
import { toast } from 'react-toastify'

function Variations() {

  const [variations, setVariations] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const axiosPrivate = useAxiosPrivate();

  const fetchVariations = async () => {
    try {
      const data = await getVariations(axiosPrivate, {
        page,
        entries,
        search,
      });

      if (data.success) {
        setVariations(data.data?.result || []);
        setTotalEntries(data.data?.pagination?.totalEntries || 0);
      }
    } catch (error) {
      console.error('Error fetching variations:', error);
    }
  };

  useEffect(() => {
    fetchVariations()
  }, [page, entries, search])


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this variation?')) {
      try {
        const data = await deleteVariation(axiosPrivate, id)

        if (data.success) {
          setVariations(variations.filter(variation => variation?._id !== id))
          toast.success(`variation deleted`)
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
          <h1 className="text-2xl font-semibold text-neutral-900">Variations</h1>
          <p className="text-neutral-600">Manage your variation catalog</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/variations/new"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add variation
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
            placeholder="Search variations..."
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

      {/* variations table */}
      <div className="table-container">
        {variations.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>variation</th>
                <th>options</th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variations.map((variation) => (
                <tr key={variation?._id} className="hover:bg-neutral-50">
                  <td className="flex items-center">

                    <div className="flex flex-col">
                      <Link
                        to={`/variations/${variation?._id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {variation?.name}
                      </Link>

                    </div>
                  </td>


                  <td>

                    <div className="flex items-center space-x-2">

                      {variation?.options?.length > 0
                        ? variation?.options?.map(item => item?.value)?.slice(0, 4)?.join(', ')
                        : `N/A`
                      }

                    </div>
                  </td>

                  <td>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/variations/${variation?._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(variation?._id)}
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
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No variations found</h3>
            <p className="text-neutral-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {variations?.length > 0 && (
        <Pagination data={variations} page={page} entries={entries} setPage={setPage} totalEntries={totalEntries} />
      )}


    </div>
  )
}

export default Variations