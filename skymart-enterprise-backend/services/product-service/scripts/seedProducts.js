#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config()
import connectDB from '../config/db.js'
import Product from '../models/Product.js'

async function seed() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI
  if (!uri) {
    console.error('Please set MONGO_URI environment variable')
    process.exit(1)
  }

  try {
    await connectDB()

    const count = await Product.countDocuments()
    console.log(`Existing product count: ${count}`)

    if (count > 0) {
      console.log('DB already has products — aborting seed.')
      process.exit(0)
    }

    const sample = [
      {
        name: 'Classic T-Shirt',
        price: 399,
        image: '/images/fashion/tshirt.jpg',
        category: 'Fashion',
        description: 'Comfortable cotton t-shirt in multiple sizes.',
        stock: 50
      },
      {
        name: 'Wireless Headphones',
        price: 2499,
        image: '/images/electronics/headphones.jpg',
        category: 'Electronics',
        description: 'Bluetooth headphones with active noise cancellation.',
        stock: 25
      },
      {
        name: 'Vitamin C Serum',
        price: 799,
        image: '/images/beauty/serum.jpg',
        category: 'Beauty',
        description: 'Brightening vitamin C serum for daily use.',
        stock: 100
      },
      {
        name: 'Yoga Mat',
        price: 1299,
        image: '/images/wellness/yoga-mat.jpg',
        category: 'Wellness',
        description: 'Eco-friendly non-slip yoga mat.',
        stock: 40
      }
    ]

    const created = await Product.insertMany(sample)
    console.log(`Inserted ${created.length} products`)
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed', err)
    process.exit(2)
  }
}

seed()
