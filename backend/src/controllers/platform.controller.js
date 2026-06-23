import asyncWrapper from "../utils/asyncWrapper.js";
import ApiResponse from "../utils/ApiResponse.js";
import { PLATFORM_ICONS, getPlatformFromUrl } from "../utils/platformIcons.js";

const getPlatformIcons = asyncWrapper(async (req, res) => {
    return ApiResponse(res, 200, "Platform icons fetched", {
        platforms: PLATFORM_ICONS,
    });
});

const detectPlatform = asyncWrapper(async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return ApiResponse(res, 400, "URL is required");
    }
    try {
        const platform = getPlatformFromUrl(url);
        return ApiResponse(res, 200, "Platform detected", { platform });
    } catch {
        return ApiResponse(res, 400, "Invalid URL");
    }
});

export { getPlatformIcons, detectPlatform };