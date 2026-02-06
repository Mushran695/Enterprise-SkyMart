import dotenv from "dotenv"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

dotenv.config()

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) throw new Error("MONGO_URI not set")
    await mongoose.connect(mongoUri)
    const email = "admin@skymart.com"
    const plain = "Admin@123"
    const hash = await bcrypt.hash(plain, 10)
    const res = await User.updateOne({ email }, { $set: { password: hash } })
    console.log("Updated:", res.nModified || res.modifiedCount || res.ok)
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
