import { Navigate } from "react-router-dom"

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  // parse safely
  let user = null
  try {
    user = JSON.parse(localStorage.getItem("user") || "null")
  } catch (e) {
    user = null
  }

  // Not logged in -> send to login route inside router (basename handles /admin)
  if (!token || !user) return <Navigate to="/login" replace />

  // Not an admin -> clear auth and redirect to login
  if (user.role !== "admin") {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminProtectedRoute
