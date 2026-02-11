#!/usr/bin/env node
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skymart_test'

const email = process.argv[2] || process.env.ADMIN_EMAIL
if (!email) {
  console.error('Usage: node make-admin.js <email>')
  process.exit(1)
}

const userSchema = new mongoose.Schema({}, { strict: false })
const User = mongoose.model('User', userSchema, 'users')

const run = async () => {
  try {
    await mongoose.connect(mongoUri)
    console.log('Connected to Mongo at', mongoUri)
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { role: 'admin', isAdmin: true } },
      { new: true }
    )
    if (!user) {
      console.error('User not found:', email)
      process.exit(2)
    }
    console.log('Updated user role to admin:', user.email)
    process.exit(0)
  } catch (err) {
    console.error('Error promoting user:', err.message)
    process.exit(3)
  }
}

run()
