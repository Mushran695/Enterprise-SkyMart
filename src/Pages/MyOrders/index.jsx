import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard'
import { ShoppingCartContext } from '../../Context'

function MyOrders() {
  const { orders, loadOrders } = useContext(ShoppingCartContext)

  useEffect(() => {
    loadOrders()
  }, [])

  return (
    <Layout>
      <h1 className='text-xl mb-6'>My Orders</h1>

      <div className='flex flex-col gap-4'>
        {orders.length === 0 && (
          <p className="text-gray-500 text-center">No orders yet</p>
        )}

        {orders.map(order => (
        <Link key={order._id} to={`/my-orders/${order._id}`}>
            <OrderCard
              totalPrice={order.totalAmount || 0}
              totalProducts={order.products?.length || 0}
            />
          </Link>
        ))}
      </div>
    </Layout>
  )
}

export default MyOrders
