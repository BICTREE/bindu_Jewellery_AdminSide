import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FiArrowLeft, FiMail, FiPhone, FiMapPin,
  FiShoppingBag, FiDollarSign, FiCalendar, FiClock
} from 'react-icons/fi'
import { mockUsers, mockOrders } from '../../data/mockData'
import { format, set } from 'date-fns'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { getUser, updateUserStatus } from '../../services/userService'

function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [address, setAddress] = useState(null)
  const [orderHistory, setOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const axiosPrivate = useAxiosPrivate()

  useEffect(() => {
    // In a real app, fetch from an API
    const fetchUserData = async () => {
      try {
        const data = await getUser(axiosPrivate, id)

        if (data.success) {
          setUser(data.data?.user)
          setAddress(data.data?.address || null)
          setOrderHistory(data.data?.orderHistory || [])
        } else {
          toast.error('User not found')
          navigate('/users')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Failed to load user details')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id, navigate])

  const handleStatusChange = async (userId, newStatus) => {
      try {
        const data = await updateUserStatus(axiosPrivate, userId, newStatus);
  
        if (data.success) {
          setUser((prev) => {
            return {
              ...prev,  isBlocked: newStatus === 'blocked' 
            }
          }
          );
        } else {
          toast.error(data.message || 'Failed to update user status');
        }
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">User Not Found</h2>
        <p className="text-neutral-600 mb-6">The user you're looking for doesn't exist or has been removed.</p>
        <Link to="/users" className="btn btn-primary">
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/users"
            className="mr-4 text-neutral-500 hover:text-neutral-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">User Details</h1>
            <p className="text-neutral-600">View and manage user information</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => handleStatusChange(user?._id, user?.isBlocked ? 'unblocked' : 'blocked')}
            className={`btn ${user?.isBlocked
              ? 'btn-success'
              : 'btn-danger'
              }`}
          >
            {user?.isBlocked ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - User info */}
        <div className="md:col-span-1 space-y-6">
          {/* User profile card */}
          <div className="card p-6">
            <div className="flex items-center">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="h-16 w-16 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-neutral-900">{user?.name}</h2>
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user?.status === 'active' ? 'bg-success-100 text-success-800' :
                  'bg-error-100 text-error-800'
                  }`}>
                  {user?.status}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-neutral-600">
                <FiMail className="h-5 w-5 mr-2" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center text-neutral-600">
                  <FiPhone className="h-5 w-5 mr-2" />
                  <span>{user?.phone}</span>
                </div>
              )}
              <div className="flex items-center text-neutral-600">
                <FiMapPin className="h-5 w-5 mr-2" />
                <div>
                  <div>{address?.street}</div>
                  <div>{address?.city}, {address?.state} {address?.pincode}</div>
                  <div>{address?.country}</div>
                </div>
              </div>
            </div>
          </div>

          {/* User stats card */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Account Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-neutral-600">
                  <FiShoppingBag className="h-5 w-5 mr-2" />
                  <span>Total Orders</span>
                </div>
                <span className="font-medium">{orderHistory?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-neutral-600">
                  <FiDollarSign className="h-5 w-5 mr-2" />
                  <span>Total Spent</span>
                </div>
                <span className="font-medium">
                  ₹{
                    orderHistory?.length > 0
                      ? orderHistory.reduce((total, order) => total + order?.amount, 0).toFixed(2)
                      : 0
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-neutral-600">
                  <FiCalendar className="h-5 w-5 mr-2" />
                  <span>Member Since</span>
                </div>
                <span className="font-medium">
                  {format(new Date(user?.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>

              {
                user?.lastLogin &&
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-neutral-600">
                    <FiClock className="h-5 w-5 mr-2" />
                    <span>Last Login</span>
                  </div>
                  <span className="font-medium">
                    {format(new Date(user?.lastLogin), 'MMM dd, yyyy')}
                  </span>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Right column - Orders */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Order History</h3>
              <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-500">
                View all orders
              </Link>
            </div>

            {orderHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {orderHistory.map((order) => (
                      <tr key={order?._id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/orders/${order?._id}`}
                            className="text-primary-600 hover:text-primary-900 font-medium"
                          >
                            #{order?.merchantOrderId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                          {format(new Date(order?.orderDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order?.status === 'Completed' ? 'bg-success-100 text-success-800' :
                            order?.status === 'Processing' ? 'bg-primary-100 text-primary-800' :
                              order?.status === 'Pending' ? 'bg-warning-100 text-warning-800' :
                                'bg-error-100 text-error-800'
                            }`}>
                            {order?.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-900 font-medium">
                          ₹{order?.amount?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/orders/${order?.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-400 mb-3">
                  <FiShoppingBag className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-medium text-neutral-900 mb-1">No orders yet</h4>
                <p className="text-neutral-600">This user hasn't placed any orders.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails