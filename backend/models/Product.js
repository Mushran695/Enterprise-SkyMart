import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ["Fashion", "Electronics", "Beauty", "Wellness"],
      required: true,
    },
    description: String,
    stock: { type: Number, default: 1 }
  },
  { timestamps: true }
)

export default mongoose.model("Product", productSchema)
