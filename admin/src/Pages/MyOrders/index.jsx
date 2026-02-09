import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard'
import { ShoppingCartContext } from '../../Context'
import api from '../../api'

function MyOrders() {
  const navigate = useNavigate()
  const { isUserAuthenticated } = useContext(ShoppingCartContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isUserAuthenticated) {
      navigate('/sign-in')
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await api.get('/orders/my')
        setOrders(Array.isArray(res.data) ? res.data : [])
        setError(null)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        setError('Failed to load orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isUserAuthenticated, navigate])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className='text-3xl font-bold mb-8'>My Orders</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className='flex flex-col gap-4'>
          {orders.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link 
                to="/" 
                className="text-blue-600 hover:underline font-medium"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <Link key={order._id} to={`/my-orders/${order._id}`}>
                <OrderCard
                  totalPrice={order.totalAmount || 0}
                  totalProducts={order.products?.length || 0}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}

export default MyOrders
