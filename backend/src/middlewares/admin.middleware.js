import ApiError from "../utils/ApiError.js";

function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Admin access only");
    }
    next();
}

export default adminOnly;