// Sanitizing signup request body
export function sanitizeSignup(req, _res, next) {
  const { name, email, password } = req.body;

  req.body = {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
  };
  return next();
}

// Sanitizing login request body
export function sanitizeLogin(req, _res, next) {
  const { email, password } = req.body;

  req.body = {
    email: email.toLowerCase().trim(),
    password,
  };

  return next();
}

// Sanitizing auth user response
export function sanitizeAuthUserResponse(user) {
  return {
    username: user.name,
    email: user.email,
  };
}

