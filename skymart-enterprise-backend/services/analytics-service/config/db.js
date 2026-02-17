import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!uri) {
      console.warn('No Mongo URI provided for analytics-service')
      return
    }
    await mongoose.connect(uri)
    console.log('analytics-service MongoDB connected')
  } catch (error) {
    console.error('analytics-service MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
