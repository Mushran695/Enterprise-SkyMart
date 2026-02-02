import { useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard'
import { formatINR } from '../../utils'
import api from '../../api'

const MyOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isUserAuthenticated } = useContext(ShoppingCartContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate('/sign-in')
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order')
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, isUserAuthenticated, navigate])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/my-orders" className="hover:bg-gray-100 p-2 rounded">
              <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
            </Link>
            <h1 className="text-2xl font-semibold">My Order</h1>
          </div>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
            {error || 'Order not found'}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/my-orders"
            className="hover:bg-gray-100 p-2 rounded"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </Link>
          <h1 className="text-2xl font-semibold">Order Details</h1>
        </div>

        {/* ================= ORDER INFO ================= */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold">{order._id?.slice(-8)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold capitalize text-green-600">{order.status || 'Processing'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold">{formatINR(order.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* ================= ORDER ITEMS ================= */}
        <div className="bg-white border rounded-lg p-5 space-y-6">
          <h2 className="text-lg font-semibold">Items</h2>

          {order.products && order.products.length > 0 ? (
            <>
              {order.products.map((item, idx) => (
                <OrderCard
                  key={idx}
                  title={item.title}
                  imageUrl={item.image}
                  price={item.price}
                  quantity={item.qty || item.quantity || 1}
                />
              ))}

              {/* ================= ORDER SUMMARY ================= */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Items</span>
                  <span>{order.products.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0)}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">{formatINR(order.totalAmount)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">No items in this order</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyOrder
