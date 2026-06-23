import ProfileVisit from "../models/profileVisit.model.js";

async function findRecentProfileVisit(username, ip, since) {
    return ProfileVisit.findOne({
        username,
        ip,
        createdAt: { $gte: since }
    });
}

async function recordProfileVisit(username, ip) {
    return ProfileVisit.create({ username, ip });
}

async function countProfileVisitsByUsername(username) {
    return ProfileVisit.countDocuments({ username });
}

async function countProfileVisitsByUsernameSince(username, since) {
    return ProfileVisit.countDocuments({
        username,
        createdAt: { $gte: since }
    });
}

async function getProfileVisitTimelineByUsername(username, since, interval) {
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

    const result = await ProfileVisit.aggregate([
        { $match: matchStage },
        { $group: { _id: dateFormat, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
    ]);

    return result;
}

export {
    findRecentProfileVisit,
    recordProfileVisit,
    countProfileVisitsByUsername,
    countProfileVisitsByUsernameSince,
    getProfileVisitTimelineByUsername,
};