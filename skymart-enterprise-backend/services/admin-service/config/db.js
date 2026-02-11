import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return mongoose.connection
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) throw new Error('Missing MongoDB URI')
    const conn = await mongoose.connect(mongoUri)
    console.log(`admin-service: MongoDB Connected: ${conn.connection.host}`)
    return conn.connection
  } catch (err) {
    console.error('admin-service: MongoDB Error:', err.message)
    throw err
  }
}

export default connectDB
