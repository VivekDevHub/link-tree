import apiClient from "@/lib/axios";

async function getLinksByUsername(username) {
    const response = await apiClient.get(`/links/user/${username}`);
    return response.data;
}

async function recordClick(linkId) {
    const response = await apiClient.post(`/clicks/${linkId}`);
    return response.data;
}

export {
    getLinksByUsername,
    recordClick,
};
