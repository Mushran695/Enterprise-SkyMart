import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"

import {
  getAdminStats,
  getOrderStats,
  getRevenueStats,
  getCategoryStats,
} from "../../services/analytics.api"

const Analytics = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    conversion: 0,
  })

  const [ordersData, setOrdersData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          statsRes,
          ordersRes,
          revenueRes,
          categoryRes,
        ] = await Promise.all([
          getAdminStats(),
          getOrderStats(),
          getRevenueStats(),
          getCategoryStats(),
        ])

        setStats(statsRes || {})
        setOrdersData(ordersRes || [])
        setRevenueData(revenueRes || [])
        setCategoryData(categoryRes || [])
      } catch (err) {
        console.error("Analytics API error", err)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return <p className="p-6">Loading analytics...</p>
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.revenue || 0}`} />
        <StatCard title="Total Orders" value={stats.orders || 0} />
        <StatCard title="Users" value={stats.users || 0} />
        <StatCard title="Conversion" value={`${stats.conversion || 0}%`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Orders per Month">
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#16a34a" />
          </BarChart>
        </ChartCard>
      </div>

      {/* PIE */}
      <ChartCard title="Sales by Category">
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          />
        </PieChart>
      </ChartCard>
    </div>
  )
}

/* ============================= */
/* UI Components */
/* ============================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
)

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h2 className="font-semibold mb-4">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
)

export default Analytics
