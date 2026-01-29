import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // ✅ MOCK ORDER (later replace with API)
  const order = {
    id,
    status: "Pending",
    user: { email: "john@gmail.com" },
    date: "2026-01-15",
    total: 2499,
    items: [
      { id: 1, title: "Wireless Headphones", price: 1999, qty: 1 },
      { id: 2, title: "Mobile Cover", price: 500, qty: 1 },
    ],
  }

  const [status, setStatus] = useState(order.status)

  const statusColor = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Order #{id}
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      {/* Order Info */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Customer</h3>
          <p>Email: {order.user.email}</p>
          <p>Date: {order.date}</p>
        </div>

        {/* Status */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Order Status</h3>

          <span
            className={`inline-block px-3 py-1 rounded-full text-sm mb-3 ${
              statusColor[status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </span>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full border rounded px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Total */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Order Total</h3>
          <p className="text-2xl font-bold">₹{order.total}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.title}</td>
                <td className="p-3 text-center">₹{item.price}</td>
                <td className="p-3 text-center">{item.qty}</td>
                <td className="p-3 text-right font-medium">
                  ₹{item.price * item.qty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderDetails
