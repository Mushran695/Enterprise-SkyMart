import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Orders = () => {
  const navigate = useNavigate()

  // ✅ Orders state (important for status change)
  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      user: "john@gmail.com",
      total: 2499,
      status: "Pending",
      date: "2026-01-15",
    },
    {
      id: "ORD-1002",
      user: "admin@gmail.com",
      total: 4999,
      status: "Delivered",
      date: "2026-01-16",
    },
  ])

  // ✅ Status color helper
  const statusColor = status => {
    switch (status) {
      case "Pending":
        return "text-yellow-600"
      case "Shipped":
        return "text-blue-600"
      case "Delivered":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  // ✅ Status update handler
  const updateStatus = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

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
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-3 font-medium">{order.id}</td>
                <td className="p-3">{order.user}</td>
                <td className="p-3">₹{order.total}</td>

                {/* ✅ STATUS */}
                <td className={`p-3 font-medium ${statusColor(order.status)}`}>
                  {order.status}
                </td>

                <td className="p-3">{order.date}</td>

                {/* ✅ ACTIONS */}
                <td className="p-3 flex gap-2">
                  {/* VIEW */}
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View
                  </button>

                  {/* STATUS CHANGE */}
                  {order.status !== "Delivered" && (
                    <select
                      className="px-2 py-1 text-sm border rounded"
                      value={order.status}
                      onChange={e =>
                        updateStatus(order.id, e.target.value)
                      }
                    >
                      {order.status === "Pending" && (
                        <>
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                        </>
                      )}

                      {order.status === "Shipped" && (
                        <>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </>
                      )}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders
