import { Route } from 'react-router-dom'
import AdminDashboard from '../Pages/AdminDashboard'
import Analytics from '../Pages/Analytics'
import Products from '../Pages/Products'
import ProtectedRoute from '../Components/ProtectedRoute'

export const AdminRoutes = [
  <Route key="admin-dashboard" path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />,
  <Route key="admin-analytics" path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />,
  <Route key="admin-products" path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />,
]

export default AdminRoutes