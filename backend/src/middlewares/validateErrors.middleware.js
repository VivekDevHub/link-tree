// Importing modules
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

// Handling express-validator errors
function validateErrors(req, _res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ApiError(400, firstError.msg);
    }

    return next();
}

// Exporting validator error middleware
export default validateErrors;