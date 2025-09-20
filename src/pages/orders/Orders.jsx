import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiFilter, FiDownload, FiX } from 'react-icons/fi'
import { format } from 'date-fns'
import { mockOrders } from '../../data/mockData'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { getOrders } from '../../services/orderService'
import Pagination from '../../components/common/Pagination'
import { exportOrdersToExcel } from '../../utils/exportUtil'

function Orders() {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const initialfilters = {
    fromDate: null,
    toDate: null,
    minAmount: null,
    maxAmount: null,
    payMode: null,
  }

  const [filters, setFilters] = useState({ ...initialfilters });

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
    setFilters({ ...initialfilters });
    setAppliedFilters({ ...initialfilters });
    setPage(1);
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders(axiosPrivate, {
        page,
        entries,
        search,
        status,
        sortBy,
        sortOrder,
        ...appliedFilters,
      });

      if (data.success) {
        setOrders(data.data?.result || []);
        setTotalEntries(data.data?.pagination?.totalEntries || 0);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [page, entries, search, status, sortBy, sortOrder, appliedFilters])

  // useEffect(() => {
  //   setOrders(mockOrders)
  // }, [])

  // Filter and sort orders
  // const orders = orders.filter(order => {
  //   const matchesSearch = order?.merchantOrderId?.toLowerCase().includes(search.toLowerCase()) ||
  //     order?.customer.name.toLowerCase().includes(search.toLowerCase()) ||
  //     order?.customer.email.toLowerCase().includes(search.toLowerCase())

  //   const matchesStatus = status === '' || order?.status === status

  //   // Simple date filter - in a real app you'd want more sophisticated date filtering
  //   let matchesDate = true
  //   if (dateFilter === 'today') {
  //     const today = new Date().toISOString().split('T')[0]
  //     const orderDate = new Date(order?.orderDate).toISOString().split('T')[0]
  //     matchesDate = today === orderDate
  //   } else if (dateFilter === 'this-week') {
  //     const now = new Date()
  //     const orderDate = new Date(order?.orderDate)
  //     const diffTime = Math.abs(now - orderDate)
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  //     matchesDate = diffDays <= 7
  //   } else if (dateFilter === 'this-month') {
  //     const now = new Date()
  //     const orderDate = new Date(order?.orderDate)
  //     matchesDate = now.getMonth() === orderDate.getMonth() &&
  //       now.getFullYear() === orderDate.getFullYear()
  //   }

  //   return matchesSearch && matchesStatus && matchesDate
  // }).sort((a, b) => {
  //   if (sortBy === 'date') {
  //     return sortOrder === 'desc'
  //       ? new Date(b.date) - new Date(a.date)
  //       : new Date(a.date) - new Date(b.date)
  //   } else if (sortBy === 'total') {
  //     return sortOrder === 'desc'
  //       ? b.total - a.total
  //       : a.total - b.total
  //   } else if (sortBy === 'customer') {
  //     return sortOrder === 'desc'
  //       ? b.customer.name.localeCompare(a.customer.name)
  //       : a.customer.name.localeCompare(b.customer.name)
  //   }
  //   return 0
  // })

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Orders</h1>
          <p className="text-neutral-600">Manage customer orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="btn btn-secondary flex items-center"
            onClick={() => exportOrdersToExcel(orders)}
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-5">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="form-input pl-10"
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

        <div className="sm:col-span-3 flex">
          <div className="relative flex-1 mr-2">
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="processing">Processing</option>
              <option value="billed">Billed</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        </div>

        {/* <div className="sm:col-span-2 flex">
          <div className="relative flex-1 mr-2">
            <select
              className="form-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>
        </div> */}

        <div className="sm:col-span-2 flex">
          <button
            className="btn btn-secondary flex items-center mr-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Filter</span>
          </button>

          <select
            className="form-input w-fit"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="total-desc">Total (High-Low)</option>
            <option value="total-asc">Total (Low-High)</option>
            <option value="customer-asc">Customer (A-Z)</option>
            <option value="customer-desc">Customer (Z-A)</option>
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
              <label className="form-label">Date Range</label>
              <div className="flex items-center">
                <input
                  name="fromDate" value={filters.fromDate} onChange={updateFilters}
                  type="date"
                  className="form-input"
                />
                <span className="mx-2">to</span>
                <input
                  name="toDate" value={filters.toDate} onChange={updateFilters}
                  type="date"
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Payment Method</label>
              <select
                name='payMode'
                value={filters.payMode}
                onChange={updateFilters}
                className="form-input">
                <option value={``}>All</option>
                <option value={`ONLINE`}>Online</option>
                <option value={`COD`}>COD</option>
              </select>
            </div>

            <div>
              <label className="form-label">Total Amount</label>
              <div className="flex items-center">
                <input
                  name='minAmount'
                  value={filters.minAmount}
                  onChange={updateFilters}
                  type="number"
                  placeholder="Min"
                  className="form-input"
                />
                <span className="mx-2">-</span>
                <input
                  name='maxAmount'
                  value={filters.maxAmount}
                  onChange={updateFilters}
                  type="number"
                  placeholder="Max"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={resetFilters} className="btn btn-secondary mr-2">Reset</button>
            <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
          </div>
        </div>
      )}

      {/* Orders table */}
      <div className="table-container">
        {orders.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order?._id} className="hover:bg-neutral-50">
                  <td>
                    <Link
                      to={`/orders/${order?._id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      #{order?.merchantOrderId}
                    </Link>
                  </td>
                  <td>{
                    order?.orderDate
                      ? format(new Date(order?.orderDate), 'MMM dd, yyyy')
                      : `N/A`
                  }</td>
                  <td>
                    <div>
                      <div className="font-medium">{order?.customer.firstName} {order?.customer.lastName}</div>
                      <div className="text-xs text-neutral-500">{order?.userId?.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order?.status === 'delivered' ? 'bg-success-100 text-success-800' :
                      order?.status === 'processing' ? 'bg-primary-100 text-primary-800' :
                        order?.status === 'Pending' ? 'bg-warning-100 text-warning-800' :
                          order?.status === 'shipped' ? 'bg-accent-100 text-accent-800' :
                            'bg-error-100 text-error-800'
                      }`}>
                      {order?.status}
                    </span>
                  </td>
                  <td>{order?.items?.length}</td>
                  <td className="font-medium">₹{order?.amount.toFixed(2)}</td>
                  <td>{order?.payMode}</td>
                  <td>
                    <Link
                      to={`/orders/${order?._id}`}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      View
                    </Link>
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
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No orders found</h3>
            <p className="text-neutral-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {orders.length > 0 && (
        <Pagination data={orders} page={page} entries={entries} setPage={setPage} totalEntries={totalEntries} />
      )}
    </div>
  )
}

export default Orders