// Importing modules
import { createLinkService, getLinksService, getAllLinksService, getDeletedLinksService, deleteLinkService, hardDeleteLinkService, restoreLinkService, reorderLinkService, updateLinkStyleService, highlightLinkService } from "../services/link.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const createLink = asyncWrapper(async (req, res) => {
    const link = await createLinkService(req.body, req.user);
    return ApiResponse(res, 201, "Link created successfully", link);
});

const getLinks = asyncWrapper(async (req, res) => {
    const links = await getLinksService(req.params.username);
    return ApiResponse(res, 200, "Links fetched successfully", links);
});

const deleteLink = asyncWrapper(async (req, res) => {
    const link = await deleteLinkService(req.params.id, req.user.name);
    return ApiResponse(res, 200, "Link deleted successfully", link);
});

const hardDeleteLink = asyncWrapper(async (req, res) => {
    const link = await hardDeleteLinkService(req.params.id, req.user.name);
    return ApiResponse(res, 200, "Link permanently deleted", link);
});

const getAllLinks = asyncWrapper(async (req, res) => {
    const links = await getAllLinksService(req.user.name);
    return ApiResponse(res, 200, "Links fetched successfully", links);
});

const getDeletedLinks = asyncWrapper(async (req, res) => {
    const links = await getDeletedLinksService(req.user.name);
    return ApiResponse(res, 200, "Deleted links fetched successfully", links);
});

const getMyLinks = asyncWrapper(async (req, res) => {
    const links = await getLinksService(req.user.name);
    return ApiResponse(res, 200, "Links fetched successfully", links);
});

const restoreLink = asyncWrapper(async (req, res) => {
    const link = await restoreLinkService(req.params.id, req.user.name);
    return ApiResponse(res, 200, "Link restored successfully", link);
});

const reorderLinks = asyncWrapper(async (req, res) => {
    const links = await reorderLinkService(req.user.name, req.body.orderedIds);
    return ApiResponse(res, 200, "Links reordered successfully", links);
});

const updateLinkStyle = asyncWrapper(async (req, res) => {
    const link = await updateLinkStyleService(req.params.id, req.user, req.body);
    return ApiResponse(res, 200, "Link style updated", link);
});

const highlightLink = asyncWrapper(async (req, res) => {
    const { expiresAt } = req.body;
    const link = await highlightLinkService(req.params.id, req.user, expiresAt);
    return ApiResponse(res, 200, "Link highlighted", link);
});

export {
    createLink,
    getLinks,
    getMyLinks,
    getAllLinks,
    getDeletedLinks,
    deleteLink,
    hardDeleteLink,
    restoreLink,
    reorderLinks,
    updateLinkStyle,
    highlightLink,
};