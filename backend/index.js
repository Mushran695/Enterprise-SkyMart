import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

import authRoutes from "./routes/auth.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"
import adminRoutes from "./routes/admin.routes.js"

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

// Cart
app.use("/api/cart", cartRoutes)

// Razorpay
app.use("/api/payment", paymentRoutes)

// Orders
app.use("/api/orders", orderRoutes)

// Analytics
app.use("/api/analytics", analyticsRoutes)
// Admin (users, dashboard)
app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on http://localhost:5000")
})
