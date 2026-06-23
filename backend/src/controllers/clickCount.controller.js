// Importing modules
import { recordClickService, getClickAnalyticsByUserService, getClicksPerLinkService, getClickTimelinePerLinkService } from "../services/clickCount.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncWrapper from "../utils/asyncWrapper.js";

// Recording a click
const recordClick = asyncWrapper(async (req, res) => {
    const click = await recordClickService(req.params.linkId);

    return ApiResponse(res, 201, "Click recorded successfully", click);
});

// Getting click analytics for a user
const getClickAnalyticsByUser = asyncWrapper(async (req, res) => {
    const analytics = await getClickAnalyticsByUserService(req.params.username);

    return ApiResponse(res, 200, "Analytics fetched successfully", analytics);
});

// Getting per-link click counts for a user
const getClicksPerLink = asyncWrapper(async (req, res) => {
    const { time } = req.query;
    const data = await getClicksPerLinkService(req.params.username, time);

    return ApiResponse(res, 200, "Per-link analytics fetched successfully", data);
});

// Getting click timeline per link for a user
const getClickTimelinePerLink = asyncWrapper(async (req, res) => {
    const { time } = req.query;
    const data = await getClickTimelinePerLinkService(req.params.username, time);

    return ApiResponse(res, 200, "Timeline analytics fetched successfully", data);
});

// Exporting click count controllers
export {
    recordClick,
    getClickAnalyticsByUser,
    getClicksPerLink,
    getClickTimelinePerLink,
};