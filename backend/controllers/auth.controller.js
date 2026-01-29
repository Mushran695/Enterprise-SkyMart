import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const register = async (req, res) => {
  const { email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: "User exists" })

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password: hashed })

  res.json({ message: "Registered" })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ message: "Invalid credentials" })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ message: "Invalid credentials" })

  const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
)


  res.json({ token, user })
}
