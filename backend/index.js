import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

import authRoutes from "./routes/auth.js"
import productRoutes from "./routes/product.routes.js"
import adminProductRoutes from "./src/routes/admin.product.routes.js"
import orderRoutes from "./src/routes/order.routes.js"
import adminUserRoutes from "./src/routes/admin.user.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import paymentRoutes from "./routes/payment.routes.js"   // 🔥 ADD THIS
// import analyticsRoutes from "./src/routes/analytics.routes.js"

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Auth
app.use("/api/auth", authRoutes)

// Frontend products
app.use("/api/products", productRoutes)

// Admin products
app.use("/api/admin/products", adminProductRoutes)

// Cart
app.use("/api/cart", cartRoutes)

// Razorpay 🔥
app.use("/api/payment", paymentRoutes)

// Orders
app.use("/api/orders", orderRoutes)

// Admin users
app.use("/api/admin/users", adminUserRoutes)

//  Analytics
// app.use("/api/analytics", analyticsRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on http://localhost:5000")
})
