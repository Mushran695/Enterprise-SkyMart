import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"
import adminRoutes from "./routes/admin.routes.js"

dotenv.config()
// Warn if critical env vars are missing (helps debugging on Render)
if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.warn("Warning: MONGO_URI or MONGODB_URI is not set. Database connection will fail until set.")
}
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set. Authentication will fail until set.")
}

connectDB()

const app = express()
// Allow configuring allowed origin via env (set to your Vercel URL in Render)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"
// Log the configured allowed origin so deployed logs show the CORS setting
console.info("Configured ALLOWED_ORIGIN:", allowedOrigin)
// Use explicit CORS options and allow Authorization header for protected routes
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
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

// Health/status endpoint to check DB connection from CI or frontend
app.get("/api/status", (req, res) => {
  const state = mongoose.connection.readyState // 0 = disconnected, 1 = connected
  res.json({ ok: state === 1, mongoReadyState: state })
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on http://localhost:5000")
})
