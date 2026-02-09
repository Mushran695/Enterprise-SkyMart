import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE } from '../../services/baseUrl'
import { CheckCircleIcon, TruckIcon, ClockIcon, ShoppingBagIcon } from '@heroicons/react/24/solid'
import Layout from '../../Components/Layout'
import { formatINR } from '../../utils'

const OrderConfirmation = () => {
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
          navigate('/signin')
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
          <p className="text-red-500">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to My Orders
          </button>
        </div>
      </Layout>
    )
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircleIcon className="h-8 w-8 text-green-600" />
      case 'Shipped':
        return <TruckIcon className="h-8 w-8 text-blue-600" />
      case 'Processing':
        return <ClockIcon className="h-8 w-8 text-yellow-600" />
      default:
        return <ShoppingBagIcon className="h-8 w-8 text-orange-600" />
    }
  }

  const items = order.items || order.products || []

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* ================= SUCCESS BANNER ================= */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-green-700">Order Placed Successfully! 🎉</h1>
              <p className="text-green-600 mt-1">Thank you for your purchase</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= ORDER DETAILS (Left) ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order ID & Date */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-mono text-sm font-semibold text-gray-800">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-800">Razorpay</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="flex items-center gap-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className={`text-lg font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.status === 'Pending' && 'Your order is being prepared'}
                    {order.status === 'Processing' && 'Your order is being processed'}
                    {order.status === 'Shipped' && 'Your order is on the way'}
                    {order.status === 'Delivered' && 'Your order has been delivered'}
                    {order.status === 'Cancelled' && 'Your order has been cancelled'}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-600 mt-1.5"></div>
                    <div>
                      <p className="font-semibold text-sm">Order Placed</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${order.status !== 'Pending' ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`h-3 w-3 rounded-full ${order.status !== 'Pending' ? 'bg-blue-600' : 'bg-gray-300'} mt-1.5`}></div>
                    <div>
                      <p className="font-semibold text-sm">Processing</p>
                      <p className="text-xs text-gray-500">Usually within 24 hours</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${['Shipped', 'Delivered'].includes(order.status) ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`h-3 w-3 rounded-full ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-blue-600' : 'bg-gray-300'} mt-1.5`}></div>
                    <div>
                      <p className="font-semibold text-sm">Shipped</p>
                      <p className="text-xs text-gray-500">On the way to you</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 ${order.status === 'Delivered' ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`h-3 w-3 rounded-full ${order.status === 'Delivered' ? 'bg-green-600' : 'bg-gray-300'} mt-1.5`}></div>
                    <div>
                      <p className="font-semibold text-sm">Delivered</p>
                      <p className="text-xs text-gray-500">Expected by 3-5 business days</p>
                    </div>
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
            <div className="bg-white border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">{formatINR(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-800">{formatINR(0)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatINR(order.totalAmount)}</span>
                </div>
              </div>

              {/* Payment Details */}
              {order.payment && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold text-sm mb-3">Payment Details</h3>
                  <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                    <p>
                      <span className="font-semibold">Payment ID:</span>
                      <br />
                      <code className="text-xs break-all">{order.payment.razorpay_payment_id}</code>
                    </p>
                    <p className="mt-2">
                      <span className="font-semibold">Status:</span> <span className="text-green-600">✓ Paid</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate(`/track-order/${order._id}`)}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold text-sm"
                >
                  Track Order
                </button>
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

export default OrderConfirmation
