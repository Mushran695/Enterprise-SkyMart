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
  const uri = config?.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI
  if (!uri) {
    console.error('MongoDB connection string is not set. Set config.mongoUri or MONGO_URI/MONGODB_URI in env.')
    throw new Error('Missing MongoDB URI')
  }

  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  const options = { ...defaultOpts, ...opts }
  try {
    const conn = await mongoose.connect(uri, options)
    isConnected = true
    console.info(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection error', err)
    throw err
  }

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
