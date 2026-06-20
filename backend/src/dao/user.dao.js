import User from "../models/user.model";

// Finding user by email
async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() });
}

// finding user by email with password
async function findUserByEmailWithPassword(email) {
  return User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password",
  );
  //The + means: Include a field that is excluded by default.
}

async function createUser(userData) {
  return User.create(userData);
}

export default {
  findUserByEmail,
  findUserByEmailWithPassword,
  createUser,
};
