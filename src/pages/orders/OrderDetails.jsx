import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  FiArrowLeft, FiX, FiDownload, FiFileText, FiPrinter, FiMail
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { mockOrders } from '../../data/mockData'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { getOrder, updateOrder } from '../../services/orderService'
import OrderStatusTracker from './OrderStatusTracker';
import InvoiceContent from './InvoiceContent'

function OrderDetails() {
  const statusFlow = ['Pending', 'Processing', 'Billed', 'Packed', 'Shipped', 'Delivered'];
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const axiosPrivate = useAxiosPrivate()

  const fetchOrder = async () => {
    try {
      const data = await getOrder(axiosPrivate, id)
      if (data.success) {
        setOrder(data?.data?.result)
      } else {
        toast.error('Order not found')
        navigate('/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id, navigate])

  const handleStatusChange = async (newStatus) => {
    setStatusUpdating(true)

    try {
      const data = await updateOrder(axiosPrivate, id, { status: newStatus })

      if (data.success) {
        setOrder({
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      }

      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update order status')
    } finally {
      setStatusUpdating(false)
    }
  }

  const generateInvoice = async () => {
    try {
      const invoiceElement = document.getElementById('invoice-content');

      if (!invoiceElement) {
        toast.error('Invoice element not found');
        return;
      }

      toast.info('Generating invoice PDF...');

      // Make element temporarily visible if it's hidden
      invoiceElement.classList.remove('hidden');

      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Check for valid dimensions
      if (!canvasWidth || !canvasHeight) {
        toast.error('Invalid canvas size. Cannot generate PDF.');
        return;
      }

      const imgHeight = (canvasHeight * imgWidth) / canvasWidth;
      let heightLeft = imgHeight;
      let position = 0;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${order?.merchantOrderId}.pdf`);
      toast.success('Invoice downloaded')
      // Hide again if needed
      invoiceElement.classList.add('hidden');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="text-error-500 mb-4">
          <FiX className="h-12 w-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Order Not Found</h2>
        <p className="text-neutral-600 mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/orders"
            className="mr-4 text-neutral-500 hover:text-neutral-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Order #{order?.merchantOrderId}
            </h1>
            <p className="text-neutral-600">
              Placed on {order?.orderDate ? format(new Date(order?.orderDate), 'MMMM dd, yyyy') : 'N/A'} at {format(new Date(order?.orderDate), 'h:mm a')}
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <button
            onClick={generateInvoice}
            className="btn btn-secondary flex items-center"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Download Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Order info and items */}
        <div className="md:col-span-2 space-y-6">
          {/* Order status */}

          <OrderStatusTracker
            statuses={statusFlow}
            orderStatus={order.status}
            onStatusChange={handleStatusChange}
            loading={statusUpdating}
          />

          {/* Order items */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Items</h2>
            <div className="overflow-hidden border border-neutral-200 rounded-md">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {order?.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column - Customer info, summary, etc. */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Customer Information</h2>
            <div className="flex items-start mb-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-900 mb-1">{order?.userId?.firstName} {order?.userId?.lastName}</h3>
                <p className="text-sm text-neutral-500">{order?.userId?.email}</p>
                {order?.userId?.mobile && (
                  <p className="text-sm text-neutral-500">{order?.userId?.mobile}</p>
                )}
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Shipping Address</h3>
              <p className="text-sm text-neutral-500">
                {order?.shipAddress?.street}<br />
                {order?.shipAddress?.city}, {order?.shipAddress?.state} {order?.shipAddress?.pincode}<br />
                {order?.shipAddress?.country}
              </p>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Shipping Method</h3>
              <p className="text-sm text-neutral-500">{order?.deliveryType}</p>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <h3 className="text-sm font-medium text-neutral-900 mb-2">Payment Method</h3>
              <p className="text-sm text-neutral-500">{order?.payMode}</p>
            </div>
          </div>

          {/* Order summary */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Summary</h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-neutral-600">Subtotal</dt>
                <dd className="text-sm text-neutral-900">₹{order?.subTotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-neutral-600">Shipping</dt>
                <dd className="text-sm text-neutral-900">₹{order?.deliveryCharge?.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-neutral-600">Tax</dt>
                <dd className="text-sm text-neutral-900">₹{order?.totalTax?.toFixed(2)}</dd>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between">
                <dt className="text-base font-medium text-neutral-900">Total</dt>
                <dd className="text-base font-medium text-neutral-900">₹{order?.amount?.toFixed(2)}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={generateInvoice}
                className="w-full btn btn-primary flex items-center justify-center"
              >
                <FiFileText className="mr-2 h-4 w-4" />
                Generate Invoice
              </button>
              <button
                onClick={() => {
                  window.print()
                }}
                className="w-full btn btn-secondary flex items-center justify-center"
              >
                <FiPrinter className="mr-2 h-4 w-4" />
                Print Order
              </button>

              {/* <button
                onClick={() => {
                  toast.success('Order confirmation email sent')
                }}
                className="w-full btn btn-secondary flex items-center justify-center"
              >
                <FiMail className="mr-2 h-4 w-4" />
                Send Email
              </button> */}

            </div>
          </div>
        </div>
      </div>

      {/* Hidden invoice content for PDF generation */}
      <InvoiceContent order={order} />
    </div>
  )
}

export default OrderDetails