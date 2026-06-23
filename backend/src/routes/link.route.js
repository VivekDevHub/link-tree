import { Router } from "express";
import { createLink, getLinks, getMyLinks, getAllLinks, getDeletedLinks, deleteLink, hardDeleteLink, restoreLink, reorderLinks, updateLinkStyle, highlightLink } from "../controllers/link.controller.js";
import validateErrors from "../middlewares/validateErrors.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import { createLinkValidator } from "../validators/link.validate.js";
import rateLimiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

const publicLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 100,
    blockDuration: 5 * 60 * 1000,
    message: "Too many requests. Try again later.",
});

const dashboardLimiter = rateLimiter({
    windowMs: 500 * 60 * 1000,
    max: 500,
    blockDuration: 5 * 60 * 1000,
    message: "Too many requests. Try again later.",
});

router.post("/", protect, dashboardLimiter, createLinkValidator, validateErrors, createLink);
router.get("/my", protect, dashboardLimiter, getMyLinks);
router.get("/user/:username", publicLimiter, getLinks);
router.get("/all", protect, dashboardLimiter, getAllLinks);
router.get("/deleted", protect, dashboardLimiter, getDeletedLinks);
router.delete("/:id", protect, dashboardLimiter, deleteLink);
router.delete("/:id/hard", protect, dashboardLimiter, hardDeleteLink);
router.patch("/:id/restore", protect, dashboardLimiter, restoreLink);
router.put("/reorder", protect, dashboardLimiter, reorderLinks);
router.put("/:id/style", protect, dashboardLimiter, updateLinkStyle);
router.put("/:id/highlight", protect, dashboardLimiter, highlightLink);

export default router;