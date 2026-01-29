import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

await mongoose.connect(process.env.MONGO_URI)

await User.create({
  name: "Admin",
  email: "admin@skymart.com",
  password: await bcrypt.hash("Admin@123", 10),
  role: "admin",
})

console.log("✅ Admin created")
process.exit()
