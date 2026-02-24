import { NavLink } from "react-router-dom"
import {
  Squares2X2Icon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
  XMarkIcon,
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
  {
    name: "Health",
    path: "health",
    icon: ChartBarIcon,
  },
]

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 bg-black text-white min-h-screen">
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

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "block" : "pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        {/* overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
        />

        {/* drawer panel */}
        <aside
          role="dialog"
          aria-modal="true"
          className={`absolute left-0 top-0 bottom-0 w-64 bg-black text-white transform transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="h-16 flex items-center px-4 justify-between border-b border-gray-800">
            <div className="font-bold text-xl">SkyMart</div>
            <button aria-label="Close sidebar" onClick={onClose} className="p-2">
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menu.map(item => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === ""}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded text-sm transition
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
      </div>
    </>
  )
}

export default AdminSidebar
