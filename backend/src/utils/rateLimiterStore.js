// In-memory store for tracking request counts per IP
const requestCounts = new Map();

// In-memory store for blocked IPs and their unblock time
const blockedIps = new Map(); // Just O(1) paglu;

// Cleaning up expired entries every minute
setInterval(() => {
    const now = Date.now();

    // Removing expired request count windows
    for (const [ip, data] of requestCounts.entries()) {
        if (now > data.resetTime) {
            requestCounts.delete(ip);
        }
    }

    // Removing expired IP blocks
    for (const [ip, unblockTime] of blockedIps.entries()) {
        if (now >= unblockTime) {
            blockedIps.delete(ip);
        }
    }
}, 60 * 1000);

export { requestCounts, blockedIps };