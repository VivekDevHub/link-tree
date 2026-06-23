// Importing modules
import { createUser, findUserByEmail, findUserByEmailWithPassword, findUserByName, findUserById, updateUserProfilePicture, updateUserUsername, updateUserTheme, createResetToken, findResetToken, deleteResetToken, deleteAllResetTokens, resetUserPassword } from "../dao/user.dao.js";
import ApiError from "../utils/ApiError.js";
import ImageKit from "@imagekit/nodejs";
import { IMAGEKIT_PRIVATE_KEY } from "../config/env.config.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import { passwordResetEmailTemplate, buildResetUrl } from "../utils/emailTemplate.js";
import isPremiumUser from "../utils/isPremiumUser.js";

async function signupService(payload = {}) {
    const { name, email, password, privacyPolicyAccepted, termsAccepted } = payload;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const user = await createUser({
        name,
        email,
        password,
        privacyPolicyAccepted: privacyPolicyAccepted === true || privacyPolicyAccepted === "true",
        termsAccepted: termsAccepted === true || termsAccepted === "true",
    });

    const token = user.generateToken();
    return { user, token };
}

// Creating login service
async function loginService(payload = {}) {
    const { email, password } = payload;

    // Checking user credentials
    const user = await findUserByEmailWithPassword(email);

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Creating single auth token
    const token = user.generateToken();

    user.password = undefined;

    return {
        user,
        token
    };
}

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
    "admin", "api", "login", "signup", "auth", "dashboard",
    "settings", "profile", "user", "users", "link", "links",
    "clicks", "analytics", "health", "test", "root", "system",
];

// Checking if username is available
async function checkUsernameService(username) {
    // Checking format: 3-20 chars, alphanumeric only
    if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
        return { available: false, reason: "Username must be 3-20 characters, alphanumeric only" };
    }

    // Checking reserved words
    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
        return { available: false, reason: "This username is reserved" };
    }

    // Checking database
    const user = await findUserByName(username);
    return { available: !user, reason: user ? "Username already taken" : null };
}

// Getting ImageKit authentication parameters for client upload
function getImageKitAuth() {
    const imagekit = new ImageKit({
        privateKey: IMAGEKIT_PRIVATE_KEY,
    });

    const result = imagekit.helper.getAuthenticationParameters();
    return result;
}

// Deleting a file from ImageKit by URL
async function deleteImageKitFile(fileUrl) {
    if (!fileUrl) return;

    const imagekit = new ImageKit({
        privateKey: IMAGEKIT_PRIVATE_KEY,
    });

    try {
        const urlPath = new URL(fileUrl).pathname;
        await imagekit.files.delete(urlPath);
    } catch {
        // ignore deletion errors
    }
}

// Updating user profile picture
async function updateProfilePictureService(userId, imageUrl) {
    if (!imageUrl) {
        throw new ApiError(400, "Image URL is required");
    }

    const currentUser = await findUserById(userId);

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    if (currentUser.profilePicture) {
        await deleteImageKitFile(currentUser.profilePicture);
    }

    const user = await updateUserProfilePicture(userId, imageUrl);

    return user;
}

// Getting current user from DB
async function getCurrentUserService(userId) {
    const user = await findUserById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
}

// Updating user username
async function updateUsernameService(userId, newName) {
    if (!newName || !newName.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const username = newName.trim();

    if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
        throw new ApiError(400, "Username must be 3-20 characters, alphanumeric only");
    }

    if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
        throw new ApiError(400, "This username is reserved");
    }

    const currentUser = await findUserById(userId);

    if (!currentUser) {
        throw new ApiError(404, "User not found");
    }

    if (currentUser.name === username) {
        throw new ApiError(400, "New username must be different from current username");
    }

    const existingUser = await findUserByName(username);

    if (existingUser) {
        throw new ApiError(409, "Username already taken");
    }

    const user = await updateUserUsername(userId, username);

    const token = user.generateToken();

    return { user, token };
}

// Updating user theme
async function updateThemeService(userId, bgColor, textColor) {
    if (!bgColor || !textColor) {
        throw new ApiError(400, "Both bgColor and textColor are required");
    }

    const user = await updateUserTheme(userId, bgColor, textColor);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
}

// Getting public user theme by username
async function getPublicUserThemeService(username) {
    const user = await findUserByName(username);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return {
        username: user.name,
        profilePicture: user.profilePicture || "",
        bgColor: user.bgColor || "#ffffff",
        textColor: user.textColor || "#333333",
    };
}

// Sending forgot password email
async function forgotPasswordService(email) {
    if (!email || !email.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const user = await findUserByEmail(email.trim());

    if (!user) {
        throw new ApiError(404, "No account found with this email");
    }

    await deleteAllResetTokens(user._id);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await createResetToken(user._id, hashedToken, expiresAt);

    const resetUrl = buildResetUrl(rawToken);

    try {
        await sendMail({
            to: user.email,
            subject: "Reset Your Password - Linkter",
            html: passwordResetEmailTemplate(user.name, resetUrl),
        });
    } catch (err) {
        console.error("Email send error:", err);
        await deleteAllResetTokens(user._id);
        throw new ApiError(500, "Failed to send email. Please try again later.");
    }

    return { message: "Reset link has been sent to your email" };
}

// Resetting password with token
async function resetPasswordService(token, newPassword) {
    if (!token || !newPassword) {
        throw new ApiError(400, "Token and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken = await findResetToken(hashedToken);

    if (!resetToken) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    await resetUserPassword(resetToken.userId, newPassword);
    await deleteResetToken(hashedToken);

    return { message: "Password reset successfully" };
}
async function updateBrandService(userId, payload) {
    const { customLogo, customName, removeLinkterBranding } = payload;
    const updateData = {};
    if (customLogo !== undefined) updateData.customLogo = customLogo;
    if (customName !== undefined) updateData.customName = customName;
    if (removeLinkterBranding !== undefined) updateData.removeLinkterBranding = removeLinkterBranding;
    return updateUserTheme(userId, updateData);
}

async function getPublicProfileService(username) {
    const user = await findUserByName(username);
    if (!user) throw new ApiError(404, "User not found");
    const premium = await isPremiumUser(user._id);
    return {
        username: user.name,
        profilePicture: user.profilePicture || "",
        bgColor: user.bgColor || "#ffffff",
        textColor: user.textColor || "#333333",
        customLogo: user.customLogo || "",
        customName: user.customName || "",
        removeLinkterBranding: premium && user.removeLinkterBranding,
        isPremium: premium,
    };
}

export {
    loginService,
    signupService,
    checkUsernameService,
    getImageKitAuth,
    updateProfilePictureService,
    updateUsernameService,
    getCurrentUserService,
    updateThemeService,
    getPublicUserThemeService,
    forgotPasswordService,
    resetPasswordService,
    updateBrandService,
    getPublicProfileService,
};