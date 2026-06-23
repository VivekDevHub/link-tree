import { body } from "express-validator";

const RESERVED_USERNAMES = [
    "admin", "api", "login", "signup", "auth", "dashboard",
    "settings", "profile", "user", "users", "link", "links",
    "clicks", "analytics", "health", "test", "root", "system",
    "premium", "pro", "upgrade", "pricing",
];

const signupValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be 3-20 characters long")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric only")
        .custom((value) => {
            if (RESERVED_USERNAMES.includes(value.toLowerCase())) {
                throw new Error("This username is reserved");
            }
            return true;
        }),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email must be valid"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("privacyPolicyAccepted")
        .equals("true")
        .withMessage("You must accept the Privacy Policy"),

    body("termsAccepted")
        .equals("true")
        .withMessage("You must accept the Terms & Conditions"),
];

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Email must be valid"),

    body("password")
        .notEmpty()
        .withMessage("Password cannot be empty"),
];

export { loginValidator, signupValidator };