// Importing modules
import { createLink, findLinksByUsername, findAllLinksByUsername, findDeletedLinksByUsername, findLinkById, softDeleteLinkById, hardDeleteLinkById, restoreLinkById, reorderLinks, getMaxOrder, updateLinkById } from "../dao/link.dao.js";
import ApiError from "../utils/ApiError.js";
import isPremiumUser from "../utils/isPremiumUser.js";

// Creating a new link
async function createLinkService(payload = {}, user) {
    const { title, url, borderColor } = payload;
    const username = user.name;
    const hasPremium = await isPremiumUser(user.id);

    const maxOrder = await getMaxOrder(username);

    const link = await createLink({
        title,
        url,
        username,
        order: maxOrder + 1,
        borderColor: hasPremium ? (borderColor || "#4f46e5") : "#e0e0e0",
    });

    return link;
}

// Getting all links for a user
async function getLinksService(username) {
    const links = await findLinksByUsername(username);

    if (!links || links.length === 0) {
        throw new ApiError(404, "No links found for this user");
    }

    return links;
}

// Getting all links including soft-deleted
async function getAllLinksService(username) {
    const links = await findAllLinksByUsername(username);
    return links;
}

// Getting only deleted links
async function getDeletedLinksService(username) {
    const links = await findDeletedLinksByUsername(username);
    return links;
}

// Soft deleting a link
async function deleteLinkService(linkId, username) {
    const link = await findLinkById(linkId);

    if (!link) {
        throw new ApiError(404, "Link not found");
    }

    if (link.username !== username) {
        throw new ApiError(403, "You are not authorized to delete this link");
    }

    const deletedLink = await softDeleteLinkById(linkId);
    return deletedLink;
}

// Hard deleting a link permanently
async function hardDeleteLinkService(linkId, username) {
    const link = await findLinkById(linkId);

    if (!link) {
        throw new ApiError(404, "Link not found");
    }

    if (link.username !== username) {
        throw new ApiError(403, "You are not authorized to delete this link");
    }

    const deletedLink = await hardDeleteLinkById(linkId);
    return deletedLink;
}

// Restoring a soft-deleted link
async function restoreLinkService(linkId, username) {
    const link = await findLinkById(linkId);

    if (!link) {
        throw new ApiError(404, "Link not found");
    }

    if (link.username !== username) {
        throw new ApiError(403, "You are not authorized to restore this link");
    }

    const restoredLink = await restoreLinkById(linkId);
    return restoredLink;
}

// Reordering links
async function reorderLinkService(username, orderedIds) {
    const links = await findLinksByUsername(username);
    const linkMap = {};
    links.forEach((link) => {
        linkMap[link._id.toString()] = link.username;
    });

    const updates = orderedIds.map((id, index) => {
        if (linkMap[id] !== username) {
            throw new ApiError(403, "You are not authorized to reorder this link");
        }
        return { id, order: index };
    });

    await reorderLinks(updates);
    return await findLinksByUsername(username);
}

async function updateLinkStyleService(linkId, user, payload) {
    const link = await findLinkById(linkId);
    if (!link) throw new ApiError(404, "Link not found");
    if (link.username !== user.name) throw new ApiError(403, "Not authorized");
    if (!(await isPremiumUser(user.id))) throw new ApiError(403, "Premium required for link styling");

    const { platformIcon, customIcon, borderColor, borderWidth, isHighlighted, highlightExpiresAt } = payload;
    const updateData = {};

    if (platformIcon !== undefined) updateData.platformIcon = platformIcon;
    if (customIcon !== undefined) updateData.customIcon = customIcon;
    if (borderColor !== undefined) updateData.borderColor = borderColor;
    if (borderWidth !== undefined) updateData.borderWidth = borderWidth;
    if (isHighlighted !== undefined) updateData.isHighlighted = isHighlighted;
    if (highlightExpiresAt !== undefined) updateData.highlightExpiresAt = highlightExpiresAt;

    return updateLinkById(linkId, updateData);
}

async function highlightLinkService(linkId, user, expiresAt) {
    const link = await findLinkById(linkId);
    if (!link) throw new ApiError(404, "Link not found");
    if (link.username !== user.name) throw new ApiError(403, "Not authorized");
    if (!(await isPremiumUser(user.id))) throw new ApiError(403, "Premium required to feature links");

    return updateLinkById(linkId, {
        isHighlighted: true,
        highlightExpiresAt: expiresAt || null,
    });
}

export {
    createLinkService,
    getLinksService,
    getAllLinksService,
    getDeletedLinksService,
    deleteLinkService,
    hardDeleteLinkService,
    restoreLinkService,
    reorderLinkService,
    updateLinkStyleService,
    highlightLinkService,
};