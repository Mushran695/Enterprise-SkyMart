import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],

  totalAmount: Number,

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

export default mongoose.model("Order", orderSchema)
