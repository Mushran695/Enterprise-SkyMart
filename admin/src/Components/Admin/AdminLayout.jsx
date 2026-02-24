import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import QuickActions from "./QuickActions"

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // disable background scroll when mobile drawer open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR (desktop & mobile drawer) */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <AdminHeader onToggleSidebar={() => setSidebarOpen(s => !s)} isSidebarOpen={sidebarOpen} />

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile quick actions floating button */}
      <QuickActions />
    </div>
  )
}

export default AdminLayout
