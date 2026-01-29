import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ShoppingCartContext } from "../../Context"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"

const AdminHeader = () => {
  const { account, handleSignOut } = useContext(ShoppingCartContext)
  const navigate = useNavigate()

  const logout = () => {
    handleSignOut()
    navigate("/sign-in")
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-gray-800">
        Admin Panel
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {account?.email}
        </span>

        <button
  onClick={() => {
    localStorage.removeItem("user")
    window.location.href = "/sign-in"
  }}
  className="text-sm text-red-600"
>
  Logout
</button>

      </div>
    </header>
  )
}

export default AdminHeader
