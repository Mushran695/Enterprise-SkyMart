import { NavLink, Outlet } from "react-router-dom"

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <NavLink to="/admin" end className="hover:text-blue-400">
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className="hover:text-blue-400">
            Products
          </NavLink>
          <NavLink to="/admin/orders" className="hover:text-blue-400">
            Orders
          </NavLink>
          <NavLink to="/admin/users" className="hover:text-blue-400">
            Users
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  )
}

export default AdminLayout
