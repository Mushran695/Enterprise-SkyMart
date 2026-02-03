import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import mongoose from "mongoose"
import "./models/cart.model.js"
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import cartRoutes from "./routes/cart.routes.js"   // 🔥 REQUIRED
import orderRoutes from "./routes/order.routes.js" // 🔥 REQUIRED
import paymentRoutes from "./routes/payment.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"
dotenv.config()

const app = express()

// Allow configuring allowed origin via env (set to your Vercel URL in Render)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"
app.use(cors({ origin: allowedOrigin }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🔥 API ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/cart", cartRoutes)        // 🔥 REQUIRED
app.use("/api/orders", orderRoutes)     // 🔥 REQUIRED
app.use("/api/payment", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)
app.get("/", (req, res) => {
  res.send("API Running")
})

// Health/status endpoint to check DB connection
app.get("/api/status", (req, res) => {
  const state = mongoose.connection.readyState // 0 = disconnected, 1 = connected
  res.json({ ok: state === 1, mongoReadyState: state })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
