// Importing modules
import { body } from "express-validator";

// Validating create link request body
const createLinkValidator = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),

    body("url")
        .trim()
        .notEmpty()
        .withMessage("URL cannot be empty")
        .isURL()
        .withMessage("URL must be valid"),

];

// Exporting link validators
export {
    createLinkValidator,
};