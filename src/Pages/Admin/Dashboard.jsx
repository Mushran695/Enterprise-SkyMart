import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline"

/* -------------------- DATA -------------------- */
const stats = [
  {
    title: "Total Products",
    value: 128,
    icon: ShoppingBagIcon,
  },
  {
    title: "Total Orders",
    value: 542,
    icon: ClipboardDocumentListIcon,
  },
  {
    title: "Total Users",
    value: 312,
    icon: UsersIcon,
  },
  {
    title: "Revenue",
    value: "₹1,24,500",
    icon: CurrencyRupeeIcon,
  },
]

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
        {stats.map((item, index) => (
          <StatCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
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
