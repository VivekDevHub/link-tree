// Importing modules
import { loginService, signupService, checkUsernameService, getImageKitAuth, updateProfilePictureService, updateUsernameService, getCurrentUserService, updateThemeService, getPublicUserThemeService, forgotPasswordService, resetPasswordService, updateBrandService, getPublicProfileService } from "../services/auth.service.js";
import { sanitizeAuthUserResponse } from "../sanitizers/auth.sanitize.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import setAuthCookie from "../utils/setCookie.js";
import clearAuthCookie from "../utils/clearCookie.js";

// Handling user signup
const signupUser = asyncWrapper(async (req, res) => {
    const result = await signupService(req.body);

    // Setting the cookies in the response
    setAuthCookie(res, result.token);

    return ApiResponse(res, 201, "User registered successfully", sanitizeAuthUserResponse(result.user));
});

// Handling user login
const loginUser = asyncWrapper(async (req, res) => {
    const result = await loginService(req.body);

    // Setting the cookies in the response
    setAuthCookie(res, result.token);

    return ApiResponse(res, 200, "User logged in successfully", sanitizeAuthUserResponse(result.user));
});

// Getting current user
const getCurrentUser = asyncWrapper(async (req, res) => {
    const user = await getCurrentUserService(req.user.id);

    return ApiResponse(res, 200, "User fetched successfully", sanitizeAuthUserResponse(user));
});

// Handling user logout
const logoutUser = asyncWrapper(async (req, res) => {
    clearAuthCookie(res);
    return ApiResponse(res, 200, "User logged out successfully");
});

// Checking username availability
const checkUsername = asyncWrapper(async (req, res) => {
    const result = await checkUsernameService(req.params.username);

    return ApiResponse(res, 200, "Username checked successfully", result);
});

// Getting ImageKit authentication parameters
const getImagekitAuth = asyncWrapper(async (req, res) => {
    const result = getImageKitAuth();

    return ApiResponse(res, 200, "ImageKit auth fetched successfully", result);
});

// Updating profile picture
const updateProfilePicture = asyncWrapper(async (req, res) => {
    const user = await updateProfilePictureService(req.user.id, req.body.profilePicture);

    return ApiResponse(res, 200, "Profile picture updated successfully", sanitizeAuthUserResponse(user));
});

// Updating username
const updateUsername = asyncWrapper(async (req, res) => {
    const { user, token } = await updateUsernameService(req.user.id, req.body.username);

    setAuthCookie(res, token);

    return ApiResponse(res, 200, "Username updated successfully", sanitizeAuthUserResponse(user));
});

// Updating theme colors
const updateTheme = asyncWrapper(async (req, res) => {
    const { bgColor, textColor } = req.body;
    const user = await updateThemeService(req.user.id, bgColor, textColor);

    return ApiResponse(res, 200, "Theme updated successfully", sanitizeAuthUserResponse(user));
});

// Getting public user theme by username
const getPublicUserTheme = asyncWrapper(async (req, res) => {
    const data = await getPublicUserThemeService(req.params.username);

    return ApiResponse(res, 200, "User theme fetched successfully", data);
});

// Sending forgot password email
const forgotPassword = asyncWrapper(async (req, res) => {
    const result = await forgotPasswordService(req.body.email);

    return ApiResponse(res, 200, result.message);
});

// Resetting password with token
const resetPassword = asyncWrapper(async (req, res) => {
    const result = await resetPasswordService(req.params.token, req.body.password);
    return ApiResponse(res, 200, result.message);
});

const updateBrand = asyncWrapper(async (req, res) => {
    const user = await updateBrandService(req.user.id, req.body);
    return ApiResponse(res, 200, "Brand settings updated", sanitizeAuthUserResponse(user));
});

const getPublicProfile = asyncWrapper(async (req, res) => {
    const data = await getPublicProfileService(req.params.username);
    return ApiResponse(res, 200, "Profile fetched", data);
});

export {
    loginUser,
    signupUser,
    getCurrentUser,
    logoutUser,
    checkUsername,
    getImagekitAuth,
    updateProfilePicture,
    updateUsername,
    updateTheme,
    getPublicUserTheme,
    forgotPassword,
    resetPassword,
    updateBrand,
    getPublicProfile,
};