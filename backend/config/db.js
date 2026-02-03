import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // Support both MONGO_URI and MONGODB_URI environment variable names
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
      console.error("MongoDB connection string is not set. Set MONGO_URI or MONGODB_URI in env.")
      throw new Error("Missing MongoDB URI")
    }

    const conn = await mongoose.connect(mongoUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("MongoDB Error:", error)
    process.exit(1)
  }
}

export default connectDB
