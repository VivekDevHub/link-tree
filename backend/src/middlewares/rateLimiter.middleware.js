// Importing modules
import { requestCounts, blockedIps } from "../utils/rateLimiterStore.js";

// Creating a rate limiter middleware
function rateLimiter(options = {}) {
    const {
        windowMs = 60 * 1000,   // Time window in milliseconds (default: 1 minute)
        max = 20,                // Max requests per window (default: 20)
        blockDuration = 5 * 60 * 1000, // Block duration after exceeding limit (default: 5 minutes)
        message = "Too many requests. Blocked for 5 minutes.",
    } = options;

    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();

        // Checking if IP is currently blocked
        const unblockTime = blockedIps.get(ip);

        if (unblockTime) {
            if (now < unblockTime) {
                // IP is still blocked
                const remainingSeconds = Math.ceil((unblockTime - now) / 1000);
                return res.status(429).json({
                    success: false,
                    message: `Too many requests. Try again in ${remainingSeconds} seconds.`,
                });
            }

            // Block has expired, removing it
            blockedIps.delete(ip);
        }

        // Getting or creating request count for this IP
        let ipData = requestCounts.get(ip);

        if (!ipData || now > ipData.resetTime) {
            // Starting a new window for this IP
            ipData = { count: 1, resetTime: now + windowMs };
            requestCounts.set(ip, ipData);
        } else {
            // Incrementing request count within the current window
            ipData.count++;
        }

        // Checking if request limit exceeded
        if (ipData.count > max) {
            // Blocking the IP
            blockedIps.set(ip, now + blockDuration);
            requestCounts.delete(ip);

            return res.status(429).json({
                success: false,
                message,
            });
        }

        // Setting rate limit headers
        res.set({
            "X-RateLimit-Limit": max,
            "X-RateLimit-Remaining": Math.max(0, max - ipData.count),
            "X-RateLimit-Reset": Math.ceil(ipData.resetTime / 1000),
        });

        next();
    };
}

export default rateLimiter;