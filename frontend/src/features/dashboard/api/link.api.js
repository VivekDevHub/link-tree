import apiClient from "@/lib/axios";

async function createLink(payload) {
    const response = await apiClient.post("/links", payload);
    return response.data;
}

async function getLinksByUsername(username) {
    const response = await apiClient.get(`/links/user/${username}`);
    return response.data;
}

async function getAllLinks() {
    const response = await apiClient.get("/links/all");
    return response.data;
}

async function getMyLinks() {
    const response = await apiClient.get("/links/my");
    return response.data;
}

async function getDeletedLinks() {
    const response = await apiClient.get("/links/deleted");
    return response.data;
}

async function deleteLink(linkId) {
    const response = await apiClient.delete(`/links/${linkId}`);
    return response.data;
}

async function hardDeleteLink(linkId) {
    const response = await apiClient.delete(`/links/${linkId}/hard`);
    return response.data;
}

async function restoreLink(linkId) {
    const response = await apiClient.patch(`/links/${linkId}/restore`);
    return response.data;
}

async function recordClick(linkId) {
    const response = await apiClient.post(`/clicks/${linkId}`);
    return response.data;
}

async function getClickAnalytics(username) {
    const response = await apiClient.get(`/clicks/user/${username}`);
    return response.data;
}

async function getClicksPerLink(username, time) {
    const params = time ? { time } : {};
    const response = await apiClient.get(`/clicks/per-link/${username}`, { params });
    return response.data;
}

async function getClickTimeline(username, time) {
    const params = time ? { time } : {};
    const response = await apiClient.get(`/clicks/timeline/${username}`, { params });
    return response.data;
}

async function reorderLinks(orderedIds) {
    const response = await apiClient.put("/links/reorder", { orderedIds });
    return response.data;
}

async function recordProfileVisit(username) {
    const response = await apiClient.post(`/profile-visits/${username}`);
    return response.data;
}

async function getProfileVisitAnalytics(username) {
    const response = await apiClient.get(`/profile-visits/analytics/${username}`);
    return response.data;
}

async function getProfileVisitTimeline(username, time) {
    const params = time ? { time } : {};
    const response = await apiClient.get(`/profile-visits/timeline/${username}`, { params });
    return response.data;
}

export {
    createLink,
    getLinksByUsername,
    getAllLinks,
    getMyLinks,
    getDeletedLinks,
    deleteLink,
    hardDeleteLink,
    restoreLink,
    recordClick,
    getClickAnalytics,
    getClicksPerLink,
    getClickTimeline,
    reorderLinks,
    recordProfileVisit,
    getProfileVisitAnalytics,
    getProfileVisitTimeline,
};
