import { Route } from 'react-router-dom'
import AdminDashboard from '../Pages/Admin/AdminDashboard'
import Analytics from '../Pages/Admin/Analytics'
import Products from '../Pages/Admin/Products'
import ProtectedRoute from '../Components/ProtectedRoute'

export const AdminRoutes = [
  <Route key="admin-dashboard" path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />,
  <Route key="admin-analytics" path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />,
  <Route key="admin-products" path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />,
]

export default AdminRoutes