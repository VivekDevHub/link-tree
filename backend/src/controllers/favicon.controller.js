import asyncWrapper from "../utils/asyncWrapper.js";
import ApiResponse from "../utils/ApiResponse.js";

const getFavicon = asyncWrapper(async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return ApiResponse(res, 400, "URL is required");
    }

    try {
        const parsedUrl = new URL(url);
        const domain = parsedUrl.hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        return ApiResponse(res, 200, "Favicon fetched", { favicon: faviconUrl });
    } catch {
        return ApiResponse(res, 400, "Invalid URL");
    }
});

export { getFavicon };