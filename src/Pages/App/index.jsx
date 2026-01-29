import { BrowserRouter, useRoutes } from "react-router-dom"
import { useContext } from "react"
import { ShoppingCartProvider, ShoppingCartContext } from "../../Context"

/* ===== USER PAGES ===== */
import Home from "../Home"
import MyAccount from "../MyAccount"
import MyOrder from "../MyOrder"
import MyOrders from "../MyOrders"
import NotFound from "../NotFound"
import SignIn from "../SignIn"
import SignUp from "../SignUp"
import Fashion from "../Fashion"
import Electronics from "../Electronics"
import Beauty from "../Beauty"
import Wellness from "../Wellness"

/* ===== COMPONENTS ===== */
import CheckoutSideMenu from "../../Components/CheckoutSideMenu"
import ProtectedRoute from "../../Components/ProtectedRoute"
import CartSummary from "../../Components/CartSummary"

/* ===== ADMIN ===== */
import AdminLayout from "../../Components/Admin/AdminLayout"
import Dashboard from "../Admin/Dashboard"
import Products from "../Admin/Products"
import Orders from "../Admin/Orders"
import Users from "../Admin/Users"
import Analytics from "../Admin/Analytics"
import OrderDetails from "../Admin/OrderDetails"
import AdminProtectedRoute from "../../Components/Admin/AdminProtectedRoute"

import "./App.css"

/* ================= ROUTES ================= */

const AppRoutes = () => {
  return useRoutes([
    { path: "/", element: <Home /> },
    { path: "/cart-summary", element: <CartSummary /> },
    { path: "/fashion", element: <Fashion /> },
    { path: "/electronics", element: <Electronics /> },
    { path: "/beauty", element: <Beauty /> },
    { path: "/wellness", element: <Wellness /> },

    {
      path: "/my-account",
      element: (
        <ProtectedRoute>
          <MyAccount />
        </ProtectedRoute>
      ),
    },
    {
      path: "/my-orders",
      element: (
        <ProtectedRoute>
          <MyOrders />
        </ProtectedRoute>
      ),
    },
    {
      path: "/my-orders/:id",
      element: (
        <ProtectedRoute>
          <MyOrder />
        </ProtectedRoute>
      ),
    },

    { path: "/sign-in", element: <SignIn /> },
    { path: "/sign-up", element: <SignUp /> },

    {
      path: "/admin",
      element: <AdminProtectedRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: "products", element: <Products /> },
            { path: "orders", element: <Orders /> },
            { path: "orders/:id", element: <OrderDetails /> },
            { path: "users", element: <Users /> },
            { path: "analytics", element: <Analytics /> },
          ],
        },
      ],
    },

    { path: "*", element: <NotFound /> },
  ])
}

/* ================= UI WRAPPER ================= */

const AppLayout = () => {
  const { isCheckoutSideMenuOpen } = useContext(ShoppingCartContext)

  return (
    <>
      <AppRoutes />
      {isCheckoutSideMenuOpen && <CheckoutSideMenu />}
    </>
  )
}

/* ================= APP ROOT ================= */

const App = () => {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ShoppingCartProvider>
  )
}

export default App
