import express from "express"
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from "../controllers/admin.product.controller.js"

const router = express.Router()

router.get("/", getAllProducts)
router.post("/", addProduct)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

export default router
