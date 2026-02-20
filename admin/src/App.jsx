import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./Pages/Admin/Dashboard"
import Products from "./Pages/Admin/Products"
import Orders from "./Pages/Admin/Orders"
import Users from "./Pages/Admin/Users"
import Analytics from "./Pages/Admin/Analytics"
import OrderDetails from "./Pages/Admin/OrderDetails"
import Login from "./Pages/Admin/Login"
import Health from "./Pages/Admin/Health"
import ProtectedRoute from "./Components/Admin/AdminProtectedRoute"
import AdminLayout from "./Components/Admin/AdminLayout"

function App() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes nested under AdminLayout */}
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="health" element={<Health />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App
