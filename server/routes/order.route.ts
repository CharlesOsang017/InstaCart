import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js'
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders, updateOrderStatus } from '../controllers/orders.controller.js'
import adminMiddleware from '../middleware/admin.middleware.js'

const router = express.Router()

router.post("/", authMiddleware, createOrder)
router.get("/", authMiddleware, getUserOrders)
router.get("/all", authMiddleware, adminMiddleware, getAllOrders)
router.get("/:id", authMiddleware, getOrder)
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus)
router.get("/:id/location", authMiddleware, getOrderLocation)

export default router