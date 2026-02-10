import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"

const AdminHeader = () => {
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
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-gray-800">
        Admin Panel
      </h1>

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
