import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Help from './Pages/Help'
import Returns from './Pages/Returns'
import MyOrders from './Pages/MyOrders'
import MyAccount from './Pages/MyAccount'
import OrderConfirmation from './Pages/OrderConfirmation'
import OrderTracking from './Pages/OrderTracking'
import CartSummary from './Components/CartSummary'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import Analytics from './Pages/Admin/Analytics'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<CartSummary />} />
      <Route path="/help" element={<Help />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/track-order/:orderId" element={<OrderTracking />} />
      <Route path="/my-account" element={<MyAccount />} />
      
      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin={true}><Analytics /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
