import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    const res = await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    const data = await res.json()
    setOrder(data)
    setStatus(capitalize(data.status))
  }

  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

  const updateStatus = async (value) => {
    setStatus(value)
    await fetch(`http://localhost:5000/api/orders/admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ status: value.toLowerCase() })
    })
  }

  if (!order) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold">Order {order._id}</h1>

      <p>Email: {order.user?.email}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <p className="text-xl font-bold">₹{order.totalAmount}</p>

      <select
        value={status}
        onChange={e => updateStatus(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option>Pending</option>
        <option>Shipped</option>
        <option>Delivered</option>
      </select>

      <div className="bg-white rounded shadow mt-6">
        {order.products.map((p, i) => (
          <div key={i} className="p-3 border-b">
            {p.title} × {p.qty || 1} — ₹{(p.price || 0) * (p.qty || 1)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderDetails
