import express from "express"
import Order from "../../models/order.model.js"
import Product from "../../models/Product.js"
import User from "../../models/User.js"
import { protect } from "../../middleware/auth.middleware.js"

const router = express.Router()

/* ============================
   DASHBOARD STATS
============================ */
router.get("/stats", protect, async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      revenueAgg,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ])

    res.json({
      revenue: revenueAgg[0]?.total || 0,
      orders: totalOrders,
      users: totalUsers,
      conversion: totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(2) : 0,
      products: totalProducts
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Dashboard analytics failed" })
  }
})

/* ============================
   ORDERS PER MONTH
============================ */
router.get("/orders", protect, async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    res.json(
      data.map(d => ({
        month: months[d._id - 1],
        orders: d.orders
      }))
    )
  } catch {
    res.status(500).json({ message: "Order analytics failed" })
  }
})

/* ============================
   REVENUE PER MONTH
============================ */
router.get("/revenue", protect, async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    res.json(
      data.map(d => ({
        month: months[d._id - 1],
        revenue: d.revenue
      }))
    )
  } catch {
    res.status(500).json({ message: "Revenue analytics failed" })
  }
})

/* ============================
   CATEGORY PIE (SALES BASED)
============================ */
router.get("/categories", protect, async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.category",
          total: { $sum: "$products.qty" }
        }
      }
    ])

    res.json(
      data.map(d => ({
        name: d._id,
        value: d.total
      }))
    )
  } catch {
    res.status(500).json({ message: "Category analytics failed" })
  }
})

export default router
