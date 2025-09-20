import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiFilter, FiX, FiUser } from 'react-icons/fi'
import { mockUsers } from '../../data/mockData'
import { getUsers, updateUserStatus } from '../../services/userService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { toast } from 'react-toastify'
import Pagination from '../../components/common/Pagination'
import { set } from 'date-fns'


function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    minOrders: '',
    maxOrders: '',
    minSpent: '',
    maxSpent: '',
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
      fromDate: '',
      toDate: '',
      minOrders: '',
      maxOrders: '',
      minSpent: '',
      maxSpent: '',
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers(axiosPrivate, {
        page,
        entries,
        search,
        status,
        sortBy,
        sortOrder,
        ...appliedFilters,
      });

      if (data.success) {
        setUsers(data.data.users || []);
        setTotalEntries(data.data?.pagination?.totalEntries || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, entries, search, status, sortBy, sortOrder, appliedFilters]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const data = await updateUserStatus(axiosPrivate, userId, newStatus);

      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, isBlocked: newStatus === 'blocked' } : user
          )
        );
      } else {
        toast.error(data.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
          <p className="text-neutral-600">Manage your users</p>
        </div>
      </div>

      {/* Search + Filter Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-12">
        <div className="relative sm:col-span-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            className="form-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setSearch('')}>
              <FiX className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
            </button>
          )}
        </div>

        <div className="sm:col-span-2">
          <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="unblocked">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex">
          <button className="btn btn-secondary flex items-center mr-2" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FiFilter className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Filter</span>
          </button>

          <select
            className="form-input w-fit"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="orders-desc">Most Orders</option>
            <option value="orders-asc">Least Orders</option>
            <option value="spent-desc">Highest Spent</option>
            <option value="spent-asc">Lowest Spent</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="mb-6 p-4 card animate-fade">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Advanced Filters</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-neutral-500 hover:text-neutral-700">
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Date */}
            <div>
              <label className="form-label">Registration Date</label>
              <div className="flex items-center">
                <input name="fromDate" value={filters.fromDate} onChange={updateFilters} type="date" className="form-input" />
                <span className="mx-2">to</span>
                <input name="toDate" value={filters.toDate} onChange={updateFilters} type="date" className="form-input" />
              </div>
            </div>

            {/* Orders */}
            <div>
              <label className="form-label">Total Orders</label>
              <div className="flex items-center">
                <input name="minOrders" value={filters.minOrders} onChange={updateFilters} type="number" placeholder="Min" className="form-input" />
                <span className="mx-2">-</span>
                <input name="maxOrders" value={filters.maxOrders} onChange={updateFilters} type="number" placeholder="Max" className="form-input" />
              </div>
            </div>

            {/* Spent */}
            <div>
              <label className="form-label">Total Spent</label>
              <div className="flex items-center">
                <input name="minSpent" value={filters.minSpent} onChange={updateFilters} type="number" placeholder="Min" className="form-input" />
                <span className="mx-2">-</span>
                <input name="maxSpent" value={filters.maxSpent} onChange={updateFilters} type="number" placeholder="Max" className="form-input" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={resetFilters} className="btn btn-secondary mr-2">Reset</button>
            <button onClick={applyFilters} className="btn btn-primary">Apply Filters</button>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="table-container">
        {users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-neutral-50">
                  <td>
                    <Link to={`/users/${user._id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                      {user.firstName} {user.lastName}
                    </Link>
                    <div className="text-xs text-neutral-500">
                      Joined {new Date(user.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </td>
                  <td>
                    <div>{user.email}</div>
                    <div className="text-neutral-500">{user.mobile}</div>
                  </td>
                  <td>{user.orderCount}</td>
                  <td>₹{user.totalSpent?.toFixed(2)}</td>
                  <td>
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.isBlocked ? 'bg-error-100 text-error-800' : 'bg-success-100 text-success-800'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Link to={`/users/${user._id}`} className="text-primary-600 hover:text-primary-900">View</Link>
                      <button
                        onClick={() => handleStatusChange(user._id, user.isBlocked ? 'unblocked' : 'blocked')}
                        className={`text-sm font-medium ${user.isBlocked ? 'text-success-600 hover:text-success-900' : 'text-error-600 hover:text-error-900'}`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
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
              <FiUser className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No users found</h3>
            <p className="text-neutral-500">Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        )}
      </div>

        {/* Pagination */}
      {users.length > 0 && (
        <Pagination data={users} page={page} entries={entries} setPage={setPage} totalEntries={totalEntries} />
      )}
    
    </div>
  );
}

export default Users;
