// Importing modules
import { Router } from "express";
import { recordClick, getClickAnalyticsByUser, getClicksPerLink, getClickTimelinePerLink } from "../controllers/clickCount.controller.js";
import protect from "../middlewares/auth.middleware.js";

// Creating click count router
const router = Router();

// Recording a click (public)
router.post("/:linkId", recordClick);

// Getting click analytics for a user (protected)
router.get("/user/:username", protect, getClickAnalyticsByUser);

// Getting per-link click counts for a user (protected)
router.get("/per-link/:username", protect, getClicksPerLink);

// Getting click timeline per link for a user (protected)
router.get("/timeline/:username", protect, getClickTimelinePerLink);

// Exporting click count router
export default router;