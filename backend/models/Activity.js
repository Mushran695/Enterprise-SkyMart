import mongoose from "mongoose"

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
)

export default mongoose.model("Activity", activitySchema)
