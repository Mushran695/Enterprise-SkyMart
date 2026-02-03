import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("https://mern-ecommerce-1-mpg2.onrender.com/api/orders/admin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (!res.ok) throw new Error(`Error: ${res.status}`)
      const data = await res.json()
      console.log("[Admin Orders] Response:", data)
      if (!Array.isArray(data)) throw new Error("Invalid response from server")
      const formatted = data.map(o => ({
        id: o._id,
        user: o.user?.email || "Guest",
        total: o.totalAmount,
        status: capitalize(o.status),
        date: new Date(o.createdAt).toISOString().split("T")[0]
      }))
      setOrders(formatted)
    } catch (err) {
      setError(err.message || "Failed to fetch orders")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

  const statusColor = status => {
    if (status === "Delivered") return "text-green-600"
    if (status === "Shipped") return "text-blue-600"
    return "text-yellow-600"
  }

  const updateStatus = async (id, newStatus) => {
    await fetch(`https://mern-ecommerce-1-mpg2.onrender.com/api/orders/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ status: newStatus.toLowerCase() })
    })

    setOrders(prev =>
      prev.map(o =>
        o.id === id ? { ...o, status: newStatus } : o
      )
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      {loading && <div className="p-6 text-gray-500">Loading orders...</div>}
      {error && <div className="p-6 text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">No orders found.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.user}</td>
                    <td className="p-3">₹{order.total}</td>
                    <td className={`p-3 font-medium ${statusColor(order.status)}`}>{order.status}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        View
                      </button>
                      {order.status !== "Delivered" && (
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Orders
