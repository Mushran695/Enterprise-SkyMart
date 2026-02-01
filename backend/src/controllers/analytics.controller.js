import Order from "../models/Orders.js"
import User from "../models/User.model.js"
import Product from "../models/Product.js"

// ============================
// DASHBOARD STATS
// ============================
export const getAdminStats = async (req, res) => {
  try {
    const orders = await Order.find()
    const users = await User.countDocuments()

    const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

    const conversion =
      users > 0 ? ((orders.length / users) * 100).toFixed(2) : 0

    res.json({
      revenue,
      orders: orders.length,
      users,
      conversion,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Analytics failed" })
  }
}

// ============================
// ORDERS PER MONTH
// ============================
export const getOrderStats = async (req, res) => {
  const orders = await Order.find()

  const monthly = {}

  orders.forEach(o => {
    const month = new Date(o.createdAt).toLocaleString("default", { month: "short" })
    monthly[month] = (monthly[month] || 0) + 1
  })

  const result = Object.keys(monthly).map(m => ({
    month: m,
    orders: monthly[m],
  }))

  res.json(result)
}

// ============================
// REVENUE PER MONTH
// ============================
export const getRevenueStats = async (req, res) => {
  const orders = await Order.find()

  const monthly = {}

  orders.forEach(o => {
    const month = new Date(o.createdAt).toLocaleString("default", { month: "short" })
    monthly[month] = (monthly[month] || 0) + (o.totalAmount || 0)
  })

  const result = Object.keys(monthly).map(m => ({
    month: m,
    revenue: monthly[m],
  }))

  res.json(result)
}

// ============================
// CATEGORY SALES
// ============================
export const getCategoryStats = async (req, res) => {
  const orders = await Order.find()

  const categoryMap = {}

  orders.forEach(order => {
    order.products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + p.qty
    })
  })

  const result = Object.keys(categoryMap).map(c => ({
    name: c,
    value: categoryMap[c],
  }))

  res.json(result)
}
