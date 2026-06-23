// Importing modules
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";
import ApiError from "../utils/ApiError.js";
import asyncWrapper from "../utils/asyncWrapper.js";

// Protecting routes with JWT authentication
const protect = asyncWrapper(async (req, res, next) => {
    const token = req.cookies?.linkters;

    if (!token) {
        throw new ApiError(401, "Not authorized, please login");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.username,
        role: decoded.role,
    };

    next();
});

export default protect;