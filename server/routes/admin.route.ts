import express from "express";
import { getAdminStats, createDeliveryPartner, updateDeliveryPartner, assignDeliveryPartner, getDeliveryPartners } from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);
router.get("/delivery-partners", authMiddleware, adminMiddleware, getDeliveryPartners);
router.post("/delivery-partners", authMiddleware, adminMiddleware, createDeliveryPartner);
router.put("/delivery-partners/:id", authMiddleware, adminMiddleware, updateDeliveryPartner);
router.post("/orders/:id/assign", authMiddleware, adminMiddleware, assignDeliveryPartner);

export default router;