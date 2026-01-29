import productRoutes from "./routes/product.routes.js"
import adminProductRoutes from "./routes/admin.product.routes.js"
import authRoutes from "./routes/auth.js"
import orderRoutes from "./routes/order.routes.js"
import cartRoutes from "../routes/cart.routes.js"

app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminProductRoutes)
app.use("/api/products", productRoutes)
