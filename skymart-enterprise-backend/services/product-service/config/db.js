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
  const uri = config.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI
  if (!uri) throw new Error('MONGO_URI is not set')
  if (isConnected && mongoose.connection && mongoose.connection.readyState === 1) return mongoose.connection
  const options = { ...defaultOpts, ...opts }
  const conn = await mongoose.connect(uri, options)
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

  console.log(`product-service: MongoDB Connected: ${conn.connection.host}`)
  return mongoose.connection
}
