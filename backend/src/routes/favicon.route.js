import { Router } from "express";
import { getFavicon } from "../controllers/favicon.controller.js";

const router = Router();
router.get("/", getFavicon);

export default router;