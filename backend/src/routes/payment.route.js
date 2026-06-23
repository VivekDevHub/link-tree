import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import {
    getPlans,
    submitPayment,
    getMyPayments,
    getPendingPayments,
    approvePayment,
    rejectPayment,
    getMySubscription,
    runExpiryCheck,
} from "../controllers/subscription.controller.js";

const router = Router();

router.get("/plans", getPlans);

router.post("/submit", protect, submitPayment);
router.get("/my", protect, getMyPayments);
router.get("/subscription", protect, getMySubscription);

router.get("/admin/pending", protect, adminOnly, getPendingPayments);
router.patch("/admin/:id/approve", protect, adminOnly, approvePayment);
router.patch("/admin/:id/reject", protect, adminOnly, rejectPayment);

router.post("/admin/check-expiry", protect, adminOnly, runExpiryCheck);

export default router;