const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Hash a password
 */
async function hashPassword(password) {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
  return await bcrypt.hash(password, rounds);
}

/**
 * Compare password with hashed password
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Standard response formatter
 */
function sendResponse(res, status, data, message = null) {
  const response = {
    status: status >= 400 ? "error" : "success",
    data,
  };
  if (message) response.message = message;
  res.status(status).json(response);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength (at least 6 characters)
 */
function isValidPassword(password) {
  return password && password.length >= 6;
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  sendResponse,
  isValidEmail,
  isValidPassword,
};
