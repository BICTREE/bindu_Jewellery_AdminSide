import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPackage, FiShoppingBag, FiDollarSign,
  FiUsers, FiTrendingUp, FiTrendingDown
} from 'react-icons/fi'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { format, set } from 'date-fns'
import { mockOrders } from '../../data/mockData'
import { getDashboardData } from '../../services/dashboardService'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  })
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: [],
    datasets: []
  })
  const [saleAnalytics, setSaleAnalytics] = useState({
    label: [],
    datasets: []
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [statsData, setStatsData] = useState({
    totalSale: 0,
    totalOrders: 0,
    totalItems: 0,
    totalUsers: 0,
    weeklyOrderChange: 0,
    monthlySalesChange: 0
  })

  const axiosPrivate = useAxiosPrivate()
  const fetchData = async () => {
    try {
      console.log(typeof axiosPrivate)
      const data = await getDashboardData(axiosPrivate)

      if (data.success) {
        const stats = data?.data?.metrics_data;
        const recentOrders = data?.data?.recent_orders;
        const sale_analytics = data?.data?.sale_analytics;
        const best_prods = data?.data?.best_prods;
        const sales_by_category = data?.data?.sales_by_category;
        setStatsData(stats)
        setRecentOrders(recentOrders)
        setSaleAnalytics(sale_analytics)
        setBarChartData(best_prods)
        setDoughnutChartData(sales_by_category)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Sales data for chart
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [5000, 7500, 6000, 8000, 9500, 8500, 12000, 11000, 9800, 12500, 11500, 12850],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3
      }
    ]
  }

  // Product category data for doughnut chart
  const categoryData = {
    labels: ['Wallets', 'Belts', 'Bags', 'Shoes', 'Accessories'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  }

  // Top products data for bar chart
  const topProductsData = {
    labels: ['Premium Wallet', 'Leather Belt', 'Business Bag', 'Leather Shoes', 'Card Holder'],
    datasets: [
      {
        label: 'Units Sold',
        data: [85, 65, 50, 45, 30],
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
      }
    ]
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600">Welcome back to your dashboard</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-700">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-neutral-500 truncate">Total Sales</dt>
              <dd className="text-lg font-semibold text-neutral-900">₹{statsData.totalSale.toLocaleString()}</dd>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className={`flex items-center text-xs font-medium ${statsData.monthlySalesChange >= 0 ? 'text-success-600' : 'text-error-600'}`}>
              {statsData.monthlySalesChange >= 0 ? <FiTrendingUp className="mr-1.5 h-4 w-4" /> : <FiTrendingDown className="mr-1.5 h-4 w-4" />}
              {Math.abs(statsData.monthlySalesChange)}%
            </span>
            <span className="text-neutral-500 text-xs ml-2">from last month</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-secondary-100 text-secondary-700">
              <FiShoppingBag className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-neutral-500 truncate">Total Orders</dt>
              <dd className="text-lg font-semibold text-neutral-900">{statsData.totalOrders}</dd>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="flex items-center text-xs font-medium text-success-600">
              <FiTrendingUp className="mr-1.5 h-4 w-4" />
              {statsData.weeklyOrderChange}%
            </span>
            <span className="text-neutral-500 text-xs ml-2">from last week</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-accent-100 text-accent-700">
              <FiPackage className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-neutral-500 truncate">Total Products</dt>
              <dd className="text-lg font-semibold text-neutral-900">{statsData.totalItems}</dd>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <Link to="/products" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
              View all products
            </Link>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md bg-neutral-100 text-neutral-700">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <dt className="text-sm font-medium text-neutral-500 truncate">Total Customers</dt>
              <dd className="text-lg font-semibold text-neutral-900">{statsData.totalUsers}</dd>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <Link to="/users" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
              View all customers
            </Link>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Sales Overview</h3>
          <div className="h-64">
            <Line
              data={saleAnalytics}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `₹${value.toLocaleString()}`
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Top Products</h3>
          <div className="h-64">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-neutral-900">Recent Orders</h3>
            <Link to="/orders" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
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
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {recentOrders.map((order) => (
                  <tr key={order?._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-neutral-900">
                          <Link to={`/orders/${order?._id}`} className="hover:text-primary-600">
                            #{order?.merchantOrderId}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-500">
                        {format(new Date(order?.orderDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {order?.customer.firstName} {order?.customer.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${order?.status === 'delivered' ? 'bg-success-100 text-success-800' :
                        order?.status === 'shipped' ? 'bg-primary-100 text-primary-800' :
                          order?.status === 'processing' ? 'bg-warning-100 text-warning-800' :
                            'bg-error-100 text-error-800'
                        }`}>
                        {order?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      ₹{order?.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-lg font-medium text-neutral-900 mb-4">Sales by Category</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={doughnutChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard