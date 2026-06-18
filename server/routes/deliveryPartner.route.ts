import express from "express";
import { getMyDeliveries, getDeliveryDetail, completeDelivery, cancelDelivery, updateDeliveryStatus, updateDeliveryLocation, loginPartner } from "../controllers/deliveryPartner.controller.js";
import deliveryAuth from "../middleware/deliveryAuth.middleware.js";

const router = express.Router();

router.post("/login", loginPartner);
router.get("/my-deliveries", deliveryAuth, getMyDeliveries);
router.get("/my-deliveries/:id", deliveryAuth, getDeliveryDetail);
router.put("/my-deliveries/:id/complete", deliveryAuth, completeDelivery);
router.put("/my-deliveries/:id/cancel", deliveryAuth, cancelDelivery);
router.put("/my-deliveries/:id/status", deliveryAuth, updateDeliveryStatus);
router.put("/my-deliveries/:id/location", deliveryAuth, updateDeliveryLocation);

export default router;
