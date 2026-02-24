import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bars3Icon } from "@heroicons/react/24/outline"

const AdminHeader = ({ onToggleSidebar }) => {
  const [account, setAccount] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null")
      setAccount(u)
    } catch (e) {
      setAccount(null)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    // navigate to admin login
    navigate("/login")
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
      {/* LEFT: mobile hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
          className="lg:hidden p-2 rounded hover:bg-gray-100"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{account?.email}</span>

        <button onClick={logout} className="text-sm text-red-600">
          Logout
        </button>

      </div>
    </header>
  )
}

export default AdminHeader
