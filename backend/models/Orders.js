import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        price: Number,
        qty: Number,
      },
    ],
    totalAmount: Number,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
)

export default mongoose.model("Order", orderSchema)
