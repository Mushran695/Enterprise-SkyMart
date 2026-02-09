import { Outlet } from "react-router-dom"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <AdminHeader />

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
