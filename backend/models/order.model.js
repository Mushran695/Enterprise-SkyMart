import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      category: String,
      title: String,
      price: Number,
      qty: Number,
      image: String
    }
  ],

  totalAmount: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["cart", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },

  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
export default Order
