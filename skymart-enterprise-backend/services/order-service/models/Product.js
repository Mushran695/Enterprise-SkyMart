import mongoose from 'mongoose'

// Minimal Product model ONLY for populate() in order-service.
// Reads the same "products" collection in MongoDB.
const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema, 'products')
