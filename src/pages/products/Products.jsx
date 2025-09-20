import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiEdit2,FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { getProducts, updateProductStatus } from '../../services/productService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Pagination from '../../components/common/Pagination'
import { getCategories } from '../../services/categoryService'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    stock: null,
    isFeatured: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const axiosPrivate = useAxiosPrivate();

  const updateFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    const defaultFilters = {
      minPrice: null,
      maxPrice: null,
      stock: null,
      isFeatured: null,
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
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

  const fetchProducts = async () => {
    try {
      const data = await getProducts(axiosPrivate, {
        page,
        entries,
        search,
        status,
        sortBy,
        sortOrder,
        category: categoryFilter,
        ...appliedFilters,
      });

      if (data.success) {
        setProducts(data.data?.result || []);
        setTotalEntries(data.data?.pagination?.totalEntries || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, [page, entries, search, status, sortBy, sortOrder, categoryFilter, appliedFilters])

  useEffect(() => {
    fetchCategories()
  }, [])

  // Filter and sort products
  // const products = products.filter(product => {
  //   const matchesSearch = product?.name.toLowerCase().includes(search.toLowerCase()) ||
  //     product?.description.toLowerCase().includes(search.toLowerCase()) ||
  //     product?.sku.toLowerCase().includes(search.toLowerCase())

  //   const matchesCategory = categoryFilter === '' || product?.category === categoryFilter

  //   return matchesSearch && matchesCategory
  // }).sort((a, b) => {
  //   if (sortBy === 'name') {
  //     return sortOrder === 'asc'
  //       ? a.name.localeCompare(b.name)
  //       : b.name.localeCompare(a.name)
  //   } else if (sortBy === 'price') {
  //     return sortOrder === 'asc'
  //       ? a.price - b.price
  //       : b.price - a.price
  //   } else if (sortBy === 'inventory') {
  //     return sortOrder === 'asc'
  //       ? a.inventory - b.inventory
  //       : b.inventory - a.inventory
  //   }
  //   return 0
  // })

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const data = await updateProductStatus(axiosPrivate, productId, newStatus);

      if (data.success) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? { ...product, isArchived: newStatus === 'archived' } : product
          )
        );
      } else {
        toast.error(data.message || 'Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real app, make an API call to delete
      setProducts(products.filter(product => product?._id !== id))
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
          <p className="text-neutral-600">Manage your product catalog</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/products/new"
            className="btn btn-primary flex items-center"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Product
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
            placeholder="Search products..."
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

        <div className="sm:col-span-4 flex">
          <div className="relative flex-1 mr-2">
            <select
              className="form-input p-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-secondary flex items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Filter</span>
          </button>
        </div>

        <div className="sm:col-span-2">
          <select
            className="form-input p-2"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low-High)</option>
            <option value="price-desc">Price (High-Low)</option>
            <option value="inventory-asc">Inventory (Low-High)</option>
            <option value="inventory-desc">Inventory (High-Low)</option>
          </select>
        </div>
      </div>

      {/* Advanced filter panel */}
      {isFilterOpen && (
        <div className="mb-6 p-4 card animate-fade">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Advanced Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="form-label">Price Range</label>
              <div className="flex items-center">
                <input
                  name='minPrice'
                  value={filters.minPrice}
                  onChange={updateFilters}
                  type="number"
                  placeholder="Min"
                  className="form-input"
                />
                <span className="mx-2">-</span>
                <input
                  name='maxPrice'
                  value={filters.maxPrice}
                  onChange={updateFilters}
                  type="number"
                  placeholder="Max"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Stock Status</label>
              <select
                className="form-input"
                name='stock'
                onChange={updateFilters}
                value={filters.stock}
              >
                <option value=''>All</option>
                <option value='in-stock'>In Stock</option>
                <option value='low-stock'>Low Stock</option>
                <option value='out-of-stock'>Out of Stock</option>
              </select>
            </div>

            <div>
              <label className="form-label">Featured</label>
              <select
                className="form-input"
                name='isFeatured'
                onChange={updateFilters}
                value={filters.isFeatured}
              >
                <option value={null}>All</option>
                <option value={true}>Featured</option>
                <option value={false}>Not Featured</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={resetFilters} className="btn btn-secondary mr-2">Reset</button>
            <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="table-container">
        {products.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Stock Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product?._id} className="hover:bg-neutral-50">
                  <td className="flex items-center">
                    <div className="h-10 w-10 rounded overflow-hidden bg-neutral-100 mr-3 flex-shrink-0">
                      {product?.thumbnail?.location && (
                        <img
                          src={product?.thumbnail?.location}
                          alt={product?.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link
                        to={`/products/${product?._id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {product?.name}
                      </Link>
                      <span className="text-neutral-500 text-xs truncate max-w-xs">
                        {product?.description.substring(0, 50)}
                        {product?.description.length > 50 ? '...' : ''}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {product?.category || 'N/A'}
                    </span>
                  </td>
                  <td>₹{product?.price.toFixed(2)}</td>
                  <td>
                    <span className={`${product?.stock > 5 ? 'text-success-600' :
                      product?.stock > 0 ? 'text-warning-600' :
                        'text-error-600'
                      }`}>
                      {product?.stock}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product?.stock > 5 ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                      }`}>
                      {product?.stock > 5
                        ? 'In Stock'
                        : product?.stock > 0
                          ? 'Low on stock'
                          : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${product?.isArchived ? 'bg-error-100 text-error-800' : 'bg-success-100 text-success-800'
                      }`}>
                      {product?.isArchived ? 'Archived' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/products/${product?._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      {/* <button
                        onClick={() => handleDelete(product?._id)}
                        className="text-error-600 hover:text-error-900"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button> */}
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
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No products found</h3>
            <p className="text-neutral-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {products?.length > 0 && (
        <Pagination data={products} page={page} entries={entries} setPage={setPage} totalEntries={totalEntries} />
      )}


    </div>
  )
}

export default Products