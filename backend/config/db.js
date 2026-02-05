import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // If already connected, return existing connection
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection
    }

    // Support both MONGO_URI and MONGODB_URI environment variable names
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
      console.error("MongoDB connection string is not set. Set MONGO_URI or MONGODB_URI in env.")
      throw new Error("Missing MongoDB URI")
    }

    const conn = await mongoose.connect(mongoUri, {
      // recommended mongoose options (kept minimal for compatibility)
      // useNewUrlParser/useUnifiedTopology are defaults in mongoose v6+
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn.connection
  } catch (error) {
    console.error("MongoDB Error:", error)
    // Do not exit process when running in serverless environments.
    // Let the caller handle the error so the runtime can respond appropriately.
    throw error
  }
}

export default connectDB
