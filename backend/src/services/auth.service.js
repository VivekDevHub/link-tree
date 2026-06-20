// Importing modules
import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../dao/user.dao.js";
import ApiError from "../utils/ApiError.js";

// Creating signup service
async function signupService(payload = {}) {
  const { name, email, password } = payload;

  // Checking existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Creating new user
  const user = await createUser({
    name,
    email,
    password,
  });

  // Creating single auth token
  const token = user.generateToken();

  return {
    user,
    token,
  };
}

// Creating login service
async function loginService(payload = {}) {
  const { email, password } = payload;

  // Checking user credentials
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Creating single auth token
  const token = user.generateToken();

  user.password = undefined;

  return {
    user,
    token,
  };
}

// Exporting auth services
export { loginService, signupService };
