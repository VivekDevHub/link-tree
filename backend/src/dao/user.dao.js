// Importing modules
import User from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";

// Finding user by email
async function findUserByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
}

// Finding user by email with password
async function findUserByEmailWithPassword(email) {
    return User.findOne({ email: email.toLowerCase().trim() }).select("+password");
}

// Creating user
async function createUser(userData) {
    return User.create(userData);
}

// Finding user by ID
async function findUserById(id) {
    return User.findById(id);
}

// Finding user by name
async function findUserByName(name) {
    return User.findOne({ name: name.trim() });
}

// Updating user profile picture
async function updateUserProfilePicture(userId, profilePicture) {
    return User.findByIdAndUpdate(userId, { profilePicture }, { new: true });
}

// Updating user username
async function updateUserUsername(userId, name) {
    return User.findByIdAndUpdate(userId, { name }, { new: true });
}

// Updating user theme
async function updateUserTheme(userId, bgColorOrData, textColor) {
    if (typeof bgColorOrData === "object") {
        return User.findByIdAndUpdate(userId, bgColorOrData, { new: true });
    }
    return User.findByIdAndUpdate(userId, { bgColor: bgColorOrData, textColor }, { new: true });
}

// Creating a password reset token
async function createResetToken(userId, token, expiresAt) {
    return PasswordResetToken.create({ userId, token, expiresAt });
}

// Finding a password reset token
async function findResetToken(token) {
    return PasswordResetToken.findOne({ token });
}

// Deleting a password reset token
async function deleteResetToken(token) {
    return PasswordResetToken.deleteOne({ token });
}

// Deleting all reset tokens for a user
async function deleteAllResetTokens(userId) {
    return PasswordResetToken.deleteMany({ userId });
}

// Updating user password
async function resetUserPassword(userId, password) {
    const user = await User.findById(userId);
    user.password = password;
    await user.save({ validateBeforeSave: false });
    return user;
}

// Exporting user DAO methods
export {
    createUser,
    findUserByEmail,
    findUserByEmailWithPassword,
    findUserById,
    findUserByName,
    updateUserProfilePicture,
    updateUserUsername,
    updateUserTheme,
    createResetToken,
    findResetToken,
    deleteResetToken,
    deleteAllResetTokens,
    resetUserPassword,
};