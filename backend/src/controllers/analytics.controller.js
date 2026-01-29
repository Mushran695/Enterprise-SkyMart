// import Product from "../models/Product.js"
// import Order from "../models/Order.model.js"
// import User from "../models/User.model.js"

// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalProducts = await Product.countDocuments()
//     const totalUsers = await User.countDocuments()
//     const totalOrders = await Order.countDocuments()

//     const orders = await Order.find()
//     const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)

//     res.json({
//       totalProducts,
//       totalUsers,
//       totalOrders,
//       totalRevenue
//     })
//   } catch (err) {
//     res.status(500).json({ message: "Analytics error" })
//   }
// }
