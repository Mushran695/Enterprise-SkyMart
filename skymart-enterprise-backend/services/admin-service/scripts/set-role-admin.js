#!/usr/bin/env node
import mongoose from 'mongoose'

async function main() {
  const email = process.argv[2]
  const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/skymart_test'
  if (!email) {
    console.error('Usage: node set-role-admin.js user@example.com')
    process.exit(1)
  }
  try {
    await mongoose.connect(mongo, { maxPoolSize: 10 })
    const coll = mongoose.connection.db.collection('users')
    const res = await coll.updateOne({ email }, { $set: { role: 'admin' } })
    if (res.matchedCount === 0) {
      console.error('No user found with email:', email)
      process.exit(2)
    }
    console.log('User role set to admin:', email)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(3)
  }
}

main()
