import express from 'express'
import { createProduct, deleteProduct, getFlashDeals, getProduct, getProducts, updateProduct } from '../controllers/product.controllers.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/flash-deals", getFlashDeals);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;