import express from "express"
import Order from "../../models/Order.js"
import Product from "../../models/Product.js"
import User from "../../models/User.js"

const router = express.Router()

/* ============================
   MAIN DASHBOARD STATS
============================ */
router.get("/", async (req, res) => {
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
      products: totalProducts
    })
  } catch (error) {
    res.status(500).json({ message: "Dashboard analytics failed" })
  }
})

/* ============================
   PRODUCTS BY CATEGORY
============================ */
router.get("/products/categories", async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ])

    res.json(
      data.map(d => ({
        category: d._id,
        value: d.count
      }))
    )
  } catch {
    res.status(500).json({ message: "Product category analytics failed" })
  }
})

/* ============================
   STOCK STATUS
============================ */
router.get("/products/stock", async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $group: {
          _id: { $cond: [{ $gt: ["$stock", 0] }, "In Stock", "Out of Stock"] },
          count: { $sum: 1 }
        }
      }
    ])

    res.json(
      data.map(d => ({
        status: d._id,
        value: d.count
      }))
    )
  } catch {
    res.status(500).json({ message: "Stock analytics failed" })
  }
})

/* ============================
   TOP SELLING PRODUCTS
============================ */
router.get("/products/top", async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.qty" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ])

    res.json(
      data.map(d => ({
        name: d.product.name,
        sold: d.totalSold
      }))
    )
  } catch {
    res.status(500).json({ message: "Top product analytics failed" })
  }
})

/* ============================
   REVENUE PER MONTH
============================ */
router.get("/revenue", async (req, res) => {
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

    res.json(data.map(d => ({
      month: d._id,
      revenue: d.revenue
    })))
  } catch {
    res.status(500).json({ message: "Revenue analytics failed" })
  }
})

export default router
