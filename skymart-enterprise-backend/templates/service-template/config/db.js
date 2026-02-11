import mongoose from 'mongoose'
import config from './index.js'

const defaultOpts = {
  // Recommended options for modern Mongoose
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
