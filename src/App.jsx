import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Help from './Pages/Help'
import Returns from './Pages/Returns'
import MyOrders from './Pages/MyOrders'
import MyAccount from './Pages/MyAccount'
import CartSummary from './Pages/cartSummary'   // 🔥 THIS

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<CartSummary />} />   {/* 🔥 FIXED */}
      <Route path="/help" element={<Help />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/my-account" element={<MyAccount />} />
    </Routes>
  )
}

export default App
