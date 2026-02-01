import { useContext, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { ShoppingCartContext } from '../../Context'
import Layout from '../../Components/Layout'
import OrderCard from '../../Components/OrderCard'
import { formatINR } from '../../utils'

const MyOrder = () => {
  const { id } = useParams()
  const { orders, loadOrders } = useContext(ShoppingCartContext)

  useEffect(() => {
    if (orders.length === 0) {
      loadOrders()
    }
  }, [])

  const currentOrder = orders.find(order => order._id === id)

  if (!currentOrder) {
    return (
      <Layout>
        <div className="max-w-screen-xl mx-auto px-4 py-10 text-center text-gray-500">
          Order not found
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
          <h1 className="text-2xl font-semibold">My Order</h1>
        </div>

        {/* ================= ORDER ITEMS ================= */}
        <div className="bg-white border rounded-lg p-5 space-y-6">

          {currentOrder.products.map((item, idx) => (
            <OrderCard
              key={idx}
              title={item.title}
              imageUrl={item.image}
              price={item.price}
              quantity={item.qty || item.quantity}
            />
          ))}

          {/* ================= ORDER SUMMARY ================= */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Total Items</span>
              <span>{currentOrder.products.length}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total Amount</span>
              <span>{formatINR(currentOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MyOrder
