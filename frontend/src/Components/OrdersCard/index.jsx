import { useEffect, useState } from "react"
import { API_BASE } from "../../services/baseUrl"

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/my`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        if (!res.ok) throw new Error(`Status ${res.status}`)
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load orders:", err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) return <div className="p-6 text-gray-500">Loading orders...</div>

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 && <div className="text-gray-500">No orders found</div>}
      <ul className="space-y-4 w-full max-w-2xl">
        {orders.map(o => (
          <li key={o._id} className="border rounded p-4 bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-mono text-sm">{o._id}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{o.totalAmount}</div>
                <div className="text-sm text-gray-500">{o.products?.length || 0} items</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OrdersList
