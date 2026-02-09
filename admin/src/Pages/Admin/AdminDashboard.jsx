import { useEffect, useState } from "react"
import { getAllUsers } from "../../services/adminApi"
import {
  getAdminStats as fetchStats,
  getOrderStats as fetchOrders,
  getRevenueStats as fetchRevenue,
  getCategoryStats as fetchCategories,
} from "../../services/analytics.api"

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [revenue, setRevenue] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Loading analytics data...")
      
      // In development, call local backend directly to avoid hitting the deployed API (which may not have admin analytics)
      const isDev = import.meta.env && import.meta.env.DEV
      let statsRes, ordersRes, revenueRes, categoriesRes

      if (isDev) {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const [s, o, r, c] = await Promise.all([
          fetch("http://localhost:5000/api/analytics/stats", { headers }).then(res => res.json()),
          fetch("http://localhost:5000/api/analytics/orders", { headers }).then(res => res.json()),
          fetch("http://localhost:5000/api/analytics/revenue", { headers }).then(res => res.json()),
          fetch("http://localhost:5000/api/analytics/categories", { headers }).then(res => res.json()),
        ])
        statsRes = s
        ordersRes = o
        revenueRes = r
        categoriesRes = c
      } else {
        // production / deployed behavior: use existing analytics helpers
        ;[statsRes, ordersRes, revenueRes, categoriesRes] = await Promise.all([
          fetchStats(),
          fetchOrders(),
          fetchRevenue(),
          fetchCategories(),
        ])
      }

      console.log("✅ Analytics data received:", { statsRes, ordersRes, revenueRes, categoriesRes })

      // fetch users separately to get user count
      let users = []
      try {
        users = await getAllUsers()
        console.log("✅ Users fetched:", users.length)
      } catch (uErr) {
        console.warn("⚠️ Failed to fetch users for dashboard:", uErr)
      }

      // normalize stats shape (support different backend field names)
      const src = statsRes || {}
      const normalized = {
        totalProducts: src.totalProducts || src.products || src.productCount || src.productsCount || 0,
        totalOrders: src.totalOrders || src.orders || src.orderCount || src.ordersCount || 0,
        totalRevenue: src.totalRevenue || src.revenue || src.total || src.totalRevenue || 0,
        users: Array.isArray(users) ? users.length : (src.users || src.userCount || 0),
        conversion: src.conversion || 0,
      }

      setStats(normalized)
      setOrders(ordersRes || [])
      setRevenue(revenueRes || [])
      setCategories(categoriesRes || [])
    } catch (err) {
      console.error("❌ Failed to load admin dashboard:", err)
      setError(err.message || "Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6"><h3 className="text-lg">Loading dashboard...</h3></div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button 
          onClick={loadDashboard}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats?.totalProducts || 0} />
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} />
        <StatCard title="Total Users" value={stats?.users || 0} />
        <StatCard title="Revenue" value={`₹${stats?.totalRevenue || 0}`} />
      </div>

      {/* CATEGORIES */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Sales by Category</h3>
        {categories.length > 0 ? (
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={i} className="flex justify-between p-2 border-b">
                <span>{cat.name}</span>
                <span className="font-bold">{cat.value} units</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No category data yet</p>
        )}
      </div>

      {/* ORDERS TREND */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Orders per Month</h3>
        {orders.length > 0 ? (
          <ul className="space-y-2">
            {orders.map((ord, i) => (
              <li key={i} className="flex justify-between p-2 border-b">
                <span>{ord.month}</span>
                <span className="font-bold">{ord.orders} orders</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No order data yet</p>
        )}
      </div>

      {/* REVENUE TREND */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Revenue per Month</h3>
        {revenue.length > 0 ? (
          <ul className="space-y-2">
            {revenue.map((rev, i) => (
              <li key={i} className="flex justify-between p-2 border-b">
                <span>{rev.month}</span>
                <span className="font-bold">₹{rev.revenue}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No revenue data yet</p>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
)

export default AdminDashboard
