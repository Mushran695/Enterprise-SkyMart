import Product from "../models/Product.js"
import Order from "../src/models/Order.model.js"

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()

    const lowStock = await Product.find({ stock: { $lte: 5 } })

    const orders = await Order.find()

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    const today = new Date().toISOString().slice(0, 10)

    const todayOrders = orders.filter(order =>
      order.createdAt.toISOString().slice(0, 10) === today
    )

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    )

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      totalProducts,
      totalOrders: orders.length,
      totalRevenue,
      todayRevenue,
      lowStock,
      categoryStats,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Analytics fetch failed" })
  }
}
