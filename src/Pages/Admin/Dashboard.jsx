import { useEffect, useState } from "react"
import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline"
import { getAdminStats } from "../../services/analytics.api"

/* -------------------- DATA (dynamic) -------------------- */
const initialStats = {
  products: 0,
  orders: 0,
  users: 0,
  revenue: 0,
}

/* -------------------- COMPONENTS -------------------- */
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
        <Icon className="w-6 h-6" />
      </div>

      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-semibold text-gray-800">
          {value}
        </h2>
      </div>
    </div>
  )
}

/* -------------------- DASHBOARD -------------------- */
const Dashboard = () => {
  const [stats, setStats] = useState(initialStats)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getAdminStats()
        if (!mounted) return
        // backend returns { revenue, orders, users, conversion, products }
        setStats({
          products: data.products || data.productCount || 0,
          orders: data.orders || data.totalOrders || 0,
          users: data.users || 0,
          revenue: data.revenue || data.totalRevenue || 0,
        })
      } catch (err) {
        console.error("Failed to load dashboard stats:", err)
      }
    }

    load()
    return () => { mounted = false }
  }, [])
  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Overview of your store performance
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={stats.products} icon={ShoppingBagIcon} />
        <StatCard title="Total Orders" value={stats.orders} icon={ClipboardDocumentListIcon} />
        <StatCard title="Total Users" value={stats.users} icon={UsersIcon} />
        <StatCard title="Revenue" value={`₹${Number(stats.revenue).toLocaleString("en-IN")}`} icon={CurrencyRupeeIcon} />
      </div>

      {/* EXTRA SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Recent Orders
          </h3>
          <p className="text-gray-500 text-sm">
            Orders list will appear here.
          </p>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Top Products
          </h3>
          <p className="text-gray-500 text-sm">
            Product analytics will appear here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
