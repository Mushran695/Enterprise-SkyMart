import { Navigate, Outlet } from "react-router-dom"

const AdminProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  // ❌ Not logged in or not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/sign-in" replace />
  }

  // ✅ Admin verified
  return <Outlet />
}

export default AdminProtectedRoute
