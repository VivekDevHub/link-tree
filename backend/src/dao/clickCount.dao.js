// Importing modules
import ClickCount from "../models/clickCount.model.js";

// Recording a click
async function recordClick(linkId, username) {
    return ClickCount.create({ linkId, username });
}

// Counting total clicks for a link
async function countClicksByLinkId(linkId) {
    return ClickCount.countDocuments({ linkId });
}

// Counting clicks for a user
async function countClicksByUsername(username) {
    return ClickCount.countDocuments({ username });
}

// Counting clicks in last N hours for a link
async function countClicksByLinkIdSince(linkId, since) {
    return ClickCount.countDocuments({
        linkId,
        createdAt: { $gte: since }
    });
}

// Counting clicks in last N hours for a user
async function countClicksByUsernameSince(username, since) {
    return ClickCount.countDocuments({
        username,
        createdAt: { $gte: since }
    });
}

// Getting click analytics for a link
async function getClickAnalyticsByLinkId(linkId) {
    const now = new Date();

    const [total, last24h, last7d, last30d] = await Promise.all([
        ClickCount.countDocuments({ linkId }),
        ClickCount.countDocuments({ linkId, createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } }),
        ClickCount.countDocuments({ linkId, createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } }),
        ClickCount.countDocuments({ linkId, createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } }),
    ]);

    return { total, last24h, last7d, last30d };
}

// Getting click analytics for a user
async function getClickAnalyticsByUsername(username) {
    const now = new Date();

    const [total, last24h, last7d, last30d] = await Promise.all([
        ClickCount.countDocuments({ username }),
        ClickCount.countDocuments({ username, createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } }),
        ClickCount.countDocuments({ username, createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } }),
        ClickCount.countDocuments({ username, createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } }),
    ]);

    return { total, last24h, last7d, last30d };
}

// Getting per-link click counts for a user
async function getClicksPerLinkByUsername(username) {
    const result = await ClickCount.aggregate([
        { $match: { username } },
        { $group: { _id: "$linkId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
    return result;
}

// Getting per-link click counts for a user since a date
async function getClicksPerLinkByUsernameSince(username, since) {
    const result = await ClickCount.aggregate([
        { $match: { username, createdAt: { $gte: since } } },
        { $group: { _id: "$linkId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);
    return result;
}

// Getting click timeline per link grouped by interval
async function getClickTimelinePerLinkByUsername(username, since, interval) {
    let dateFormat;

    if (interval === "minute") {
        dateFormat = { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } };
    } else if (interval === "hour") {
        dateFormat = { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } };
    } else {
        dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }

    const matchStage = { username };
    if (since) {
        matchStage.createdAt = { $gte: since };
    }

    const result = await ClickCount.aggregate([
        { $match: matchStage },
        { $group: { _id: { linkId: "$linkId", time: dateFormat }, count: { $sum: 1 } } },
        { $sort: { "_id.time": 1 } },
    ]);

    return result;
}

// Exporting click count DAO methods
export {
    recordClick,
    countClicksByLinkId,
    countClicksByUsername,
    countClicksByLinkIdSince,
    countClicksByUsernameSince,
    getClickAnalyticsByLinkId,
    getClickAnalyticsByUsername,
    getClicksPerLinkByUsername,
    getClicksPerLinkByUsernameSince,
    getClickTimelinePerLinkByUsername,
};