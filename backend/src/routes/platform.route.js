import { Router } from "express";
import { getPlatformIcons, detectPlatform } from "../controllers/platform.controller.js";

const router = Router();

router.get("/icons", getPlatformIcons);
router.get("/detect", detectPlatform);

export default router;