import { Router } from "express";
import { recordVisit, getProfileVisitAnalytics, getProfileVisitTimeline } from "../controllers/profileVisit.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:username", recordVisit);
router.get("/analytics/:username", protect, getProfileVisitAnalytics);
router.get("/timeline/:username", protect, getProfileVisitTimeline);

export default router;