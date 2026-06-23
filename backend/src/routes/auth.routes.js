import { Router } from "express";
import { loginUser, signupUser, getCurrentUser, logoutUser, checkUsername, getImagekitAuth, updateProfilePicture, updateUsername, updateTheme, getPublicUserTheme, forgotPassword, resetPassword, updateBrand, getPublicProfile } from "../controllers/auth.controller.js";
import validateErrors from "../middlewares/validateErrors.middleware.js";
import protect from "../middlewares/auth.middleware.js";
import { sanitizeLogin, sanitizeSignup } from "../sanitizers/auth.sanitize.js";
import { loginValidator, signupValidator } from "../validators/auth.validate.js";

const router = Router();

router.post("/signup", signupValidator, validateErrors, sanitizeSignup, signupUser);
router.post("/login", loginValidator, validateErrors, sanitizeLogin, loginUser);
router.get("/me", protect, getCurrentUser);
router.get("/check-username/:username", checkUsername);
router.get("/imagekit-auth", protect, getImagekitAuth);
router.put("/profile-picture", protect, updateProfilePicture);
router.put("/username", protect, updateUsername);
router.put("/theme", protect, updateTheme);
router.put("/brand", protect, updateBrand);
router.get("/user/:username", getPublicUserTheme);
router.get("/profile/:username", getPublicProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

export default router;