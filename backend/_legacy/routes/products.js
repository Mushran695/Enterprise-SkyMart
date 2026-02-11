import express from "express"
import Product from "../models/Product.js"

const router = express.Router()

// ✅ GET ALL PRODUCTS (Store + Admin)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ✅ GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch {
    res.status(404).json({ message: "Product not found" })
  }
})

// ✅ CREATE PRODUCT (Admin)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body)
    const saved = await product.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// ✅ UPDATE PRODUCT (Admin)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch {
    res.status(400).json({ message: "Update failed" })
  }
})

// ✅ DELETE PRODUCT (Admin)
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: "Product deleted" })
  } catch {
    res.status(400).json({ message: "Delete failed" })
  }
})

export default router
