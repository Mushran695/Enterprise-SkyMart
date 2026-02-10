import { NavLink } from "react-router-dom"
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"

const menu = [
  {
    name: "Dashboard",
    path: "",
    icon: Squares2X2Icon,
  },
  {
    name: "Products",
    path: "products",
    icon: ShoppingBagIcon,
  },
  {
    name: "Orders",
    path: "orders",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "Users",
    path: "users",
    icon: UsersIcon,
  },
  {
    name: "Analytics",
    path: "analytics",
    icon: ChartBarIcon,
  },
]

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-black text-white min-h-screen">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-gray-800">
        SkyMart
      </div>

      {/* MENU */}
      <nav className="p-4 space-y-2">
        {menu.map(item => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === ""}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded text-sm transition
                ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default AdminSidebar
