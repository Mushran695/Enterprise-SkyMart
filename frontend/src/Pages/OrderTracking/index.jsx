import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE } from '../../services/baseUrl'
import { 
  CheckCircleIcon, 
  TruckIcon, 
  ClockIcon, 
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/solid'
import Layout from '../../Components/Layout'
import { formatINR } from '../../utils'

const OrderTracking = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/sign-in')
          return
        }

        const response = await fetch(
          `${API_BASE}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()
        if (!data || !data._id) {
          setError('Order not found')
          setLoading(false)
          return
        }

        setOrder(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, navigate])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />
      case 'Shipped':
        return <TruckIcon className="h-8 w-8 text-blue-600" />
      case 'Processing':
        return <ClockIcon className="h-8 w-8 text-yellow-600" />
      default:
        return <ClockIcon className="h-8 w-8 text-orange-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600'
      case 'Shipped':
        return 'text-blue-600'
      case 'Processing':
        return 'text-yellow-600'
      case 'Cancelled':
        return 'text-red-600'
      default:
        return 'text-orange-600'
    }
  }

  const getProgress = (status) => {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered']
    return ((statuses.indexOf(status) + 1) / statuses.length) * 100
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-10 text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </Layout>
    )
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-10 text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to My Orders
          </button>
        </div>
      </Layout>
    )
  }

  const items = order.items || order.products || []

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back</span>
        </button>

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Order ID: <span className="font-mono font-semibold">{order._id}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= TRACKING STATUS (Left) ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Status</h2>

              {/* Status Badge */}
              <div className="flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-lg">
                {getStatusIcon(order.status)}
                <div>
                  <p className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.status === 'Pending' && 'Your order is being prepared for shipment'}
                    {order.status === 'Processing' && 'Your order is being processed and packaged'}
                    {order.status === 'Shipped' && 'Your order is on the way to you'}
                    {order.status === 'Delivered' && 'Your order has been successfully delivered'}
                    {order.status === 'Cancelled' && 'Your order has been cancelled'}
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${getProgress(order.status)}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {/* Pending */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      ['Pending', 'Processing', 'Shipped', 'Delivered'].includes(order.status)
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}>
                      ✓
                    </div>
                    <div className="h-12 w-0.5 bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-800">Order Placed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Processing */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      ['Processing', 'Shipped', 'Delivered'].includes(order.status)
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}>
                      {['Processing', 'Shipped', 'Delivered'].includes(order.status) ? '✓' : '2'}
                    </div>
                    <div className="h-12 w-0.5 bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-800">Processing</p>
                    <p className="text-sm text-gray-600">
                      {['Processing', 'Shipped', 'Delivered'].includes(order.status)
                        ? 'Your order is being prepared'
                        : 'Estimated to start within 24 hours'}
                    </p>
                  </div>
                </div>

                {/* Shipped */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      ['Shipped', 'Delivered'].includes(order.status)
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}>
                      {['Shipped', 'Delivered'].includes(order.status) ? '✓' : '3'}
                    </div>
                    <div className="h-12 w-0.5 bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-800">Shipped</p>
                    <p className="text-sm text-gray-600">
                      {['Shipped', 'Delivered'].includes(order.status)
                        ? 'Your order is on the way'
                        : 'Estimated shipment within 2-3 days'}
                    </p>
                  </div>
                </div>

                {/* Delivered */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-600' : 'bg-gray-300'
                    }`}>
                      {order.status === 'Delivered' ? '✓' : '4'}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Delivered</p>
                    <p className="text-sm text-gray-600">
                      {order.status === 'Delivered'
                        ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}`
                        : 'Expected delivery within 3-5 business days'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items ({items.length})</h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-b-0">
                    <div className="flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.title || item.product?.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: <span className="font-semibold">{item.quantity || item.qty}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: <span className="font-semibold">{formatINR(item.price)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatINR(item.price * (item.quantity || item.qty))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= ORDER SUMMARY (Right) ================= */}
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-3 text-sm border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="text-gray-800 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items</span>
                  <span className="text-gray-800 font-semibold">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="text-green-600 font-semibold">✓ Paid</span>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">{formatINR(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatINR(order.totalAmount)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              {order.shippingAddress && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-blue-600" />
                    Delivery Address
                  </h3>
                  <div className="text-xs text-gray-700 space-y-1">
                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-2 flex items-center gap-1">
                        <PhoneIcon className="h-3 w-3" />
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/my-orders')}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold text-sm"
                >
                  View All Orders
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 font-semibold text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OrderTracking
