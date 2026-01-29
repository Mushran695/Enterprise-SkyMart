import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import "./models/cart.model.js"
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import cartRoutes from "./routes/cart.routes.js"   // 🔥 REQUIRED
import orderRoutes from "./src/routes/order.routes.js" // 🔥 REQUIRED
import paymentRoutes from "./routes/payment.routes.js";
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🔥 API ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/cart", cartRoutes)        // 🔥 REQUIRED
app.use("/api/orders", orderRoutes)     // 🔥 REQUIRED
app.use("/api/payment", paymentRoutes);
app.get("/", (req, res) => {
  res.send("API Running")
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
