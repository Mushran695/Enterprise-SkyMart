import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema(
  {
    // store productId only (no ref, so no populate dependency)
    product: { type: mongoose.Schema.Types.ObjectId, required: true },

    category: String,
    title: String,
    price: Number,
    image: String,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
)
    
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema)
export default Cart