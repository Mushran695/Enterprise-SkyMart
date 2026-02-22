import mongoose from 'mongoose'

// Minimal permissive Product model to satisfy populate() if ever used.
// Bind explicitly to the 'products' collection and allow any fields.
const productSchema = new mongoose.Schema({}, { strict: false })

// register model name 'Product' and bind to 'products' collection
mongoose.models.Product || mongoose.model('Product', productSchema, 'products')

export default mongoose.models.Product
