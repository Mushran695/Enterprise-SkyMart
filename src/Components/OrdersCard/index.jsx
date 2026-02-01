import { useEffect, useState } from "react"
import OrdersCard from "../../Components/OrdersCard"

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/api/orders/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
  }, [])

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map(order => (
        <OrdersCard
          key={order._id}
          date={new Date(order.createdAt).toLocaleDateString()}
          totalPrice={order.totalAmount}
          totalProducts={order.items.length}
        />
      ))}
    </div>
  )
}

export default Orders
