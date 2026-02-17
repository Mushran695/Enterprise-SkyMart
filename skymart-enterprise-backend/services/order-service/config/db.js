import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!uri) {
      console.warn('No Mongo URI provided for order-service')
      return
    }
    await mongoose.connect(uri)
    console.log('order-service MongoDB connected')
  } catch (error) {
    console.error('order-service MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
