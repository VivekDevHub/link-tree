import apiClient from "@/lib/axios";

async function loginUser(payload) {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
}

async function signupUser(payload) {
    const response = await apiClient.post("/auth/signup", payload);
    return response.data;
}

async function getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data;
}

async function logoutUser() {
    const response = await apiClient.post("/auth/logout");
    return response.data;
}

async function checkUsername(username) {
    const response = await apiClient.get(`/auth/check-username/${username}`);
    return response.data;
}

async function getImagekitAuth() {
    const response = await apiClient.get("/auth/imagekit-auth");
    return response.data;
}

async function updateProfilePicture(profilePicture) {
    const response = await apiClient.put("/auth/profile-picture", { profilePicture });
    return response.data;
}

async function updateUsername(username) {
    const response = await apiClient.put("/auth/username", { username });
    return response.data;
}

async function updateTheme(bgColor, textColor) {
    const response = await apiClient.put("/auth/theme", { bgColor, textColor });
    return response.data;
}

async function getPublicUserTheme(username) {
    const response = await apiClient.get(`/auth/user/${username}`);
    return response.data;
}

async function forgotPassword(email) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
}

async function resetPassword(token, password) {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
    return response.data;
}

async function getPublicProfile(username) {
    const response = await apiClient.get(`/auth/profile/${username}`);
    return response.data;
}

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
    getPublicProfile,
};
