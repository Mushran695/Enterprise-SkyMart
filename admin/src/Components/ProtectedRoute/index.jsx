import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
