import API from "../../../lib/axios";

export async function updateBrand({ customLogo, customName, removeLinkterBranding }) {
    const { data } = await API.put("/auth/brand", { customLogo, customName, removeLinkterBranding });
    return data;
}

export async function getPublicProfile(username) {
    const { data } = await API.get(`/auth/profile/${username}`);
    return data.data;
}

export async function updateLinkStyle(linkId, style) {
    const { data } = await API.put(`/links/${linkId}/style`, style);
    return data;
}

export async function highlightLink(linkId, expiresAt) {
    const { data } = await API.put(`/links/${linkId}/highlight`, { expiresAt });
    return data;
}

export async function getPlatformIcons() {
    const { data } = await API.get("/platforms/icons");
    return data.data;
}

export async function detectPlatform(url) {
    const { data } = await API.get(`/platforms/detect?url=${encodeURIComponent(url)}`);
    return data.data;
}

export async function getFavicon(url) {
    const { data } = await API.get(`/favicon?url=${encodeURIComponent(url)}`);
    return data.data;
}
