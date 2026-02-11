import mongoose from 'mongoose'
import config from './index.js'

const defaultOpts = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
}

let isConnected = false

export default async function connectDB(opts = {}) {
  const uri = config.mongoUri
  if (!uri) throw new Error('MONGO_URI is not set')
  if (isConnected) return mongoose.connection
  const options = { ...defaultOpts, ...opts }
  await mongoose.connect(uri, options)
  isConnected = true

  mongoose.connection.on('connected', () => {
    console.info('MongoDB connected')
  })
  mongoose.connection.on('reconnected', () => {
    console.info('MongoDB reconnected')
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected')
    isConnected = false
  })
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB error', err)
  })

  return mongoose.connection
}
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) return mongoose.connection
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) throw new Error('Missing MongoDB URI')
    const conn = await mongoose.connect(mongoUri)
    console.log(`product-service: MongoDB Connected: ${conn.connection.host}`)
    return conn.connection
  } catch (err) {
    console.error('product-service: MongoDB Error:', err.message)
    throw err
  }
}

export default connectDB
