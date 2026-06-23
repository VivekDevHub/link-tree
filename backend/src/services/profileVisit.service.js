import { findRecentProfileVisit, recordProfileVisit, countProfileVisitsByUsername, countProfileVisitsByUsernameSince, getProfileVisitTimelineByUsername } from "../dao/profileVisit.dao.js";

async function recordProfileVisitService(username, ip) {
    const dedupeSince = new Date(Date.now() - 60 * 1000);
    const existingVisit = await findRecentProfileVisit(username, ip, dedupeSince);

    if (existingVisit) {
        return existingVisit;
    }

    return recordProfileVisit(username, ip);
}

async function getProfileVisitAnalyticsService(username) {
    const now = new Date();

    const [total, last24h, last7d, last30d] = await Promise.all([
        countProfileVisitsByUsername(username),
        countProfileVisitsByUsernameSince(username, new Date(now - 24 * 60 * 60 * 1000)),
        countProfileVisitsByUsernameSince(username, new Date(now - 7 * 24 * 60 * 60 * 1000)),
        countProfileVisitsByUsernameSince(username, new Date(now - 30 * 24 * 60 * 60 * 1000)),
    ]);

    return { total, last24h, last7d, last30d };
}

async function getProfileVisitTimelineService(username, timeFilter) {
    const now = new Date();
    let since;
    let interval = "day";

    if (timeFilter === "last1h") {
        since = new Date(now - 60 * 60 * 1000);
        interval = "minute";
    } else if (timeFilter === "last24h") {
        since = new Date(now - 24 * 60 * 60 * 1000);
        interval = "hour";
    } else if (timeFilter === "last7d") {
        since = new Date(now - 7 * 24 * 60 * 60 * 1000);
    } else if (timeFilter === "last30d") {
        since = new Date(now - 30 * 24 * 60 * 60 * 1000);
    }

    const raw = await getProfileVisitTimelineByUsername(username, since, interval);

    const timeSet = new Set();
    const points = {};

    raw.forEach((item) => {
        const time = item._id;
        timeSet.add(time);
        points[time] = item.count;
    });

    const sortedTimes = Array.from(timeSet).sort();
    const data = sortedTimes.map((t) => points[t] || 0);

    return { times: sortedTimes, data };
}

export {
    recordProfileVisitService,
    getProfileVisitAnalyticsService,
    getProfileVisitTimelineService,
};