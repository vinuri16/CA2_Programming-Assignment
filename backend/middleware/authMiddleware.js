const { verifyToken, sendResponse } = require("../utils/helpers");

/**
 * Middleware to verify JWT token and attach user to request
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return sendResponse(res, 401, null, "Access token required. Please login.");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return sendResponse(res, 401, null, "Invalid or expired token. Please login again.");
  }

  req.user = decoded;
  next();
}

/**
 * Middleware to check if user is an admin
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return sendResponse(res, 403, null, "Admin access required.");
  }
  next();
}


/**
 * Middleware to check if user is an admin or staff
 */
function requireStaffOrAdmin(req, res, next) {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "staff")) {
    return sendResponse(res, 403, null, "Admin or staff access required.");
  }
  next();
}

/**
 * Middleware to check if user is owner of resource or admin
 */
function requireOwnerOrAdmin(req, res, next) {
  const resourceUserId = parseInt(req.params.userId, 10);

  if (!req.user) {
    return sendResponse(res, 401, null, "Access token required.");
  }

  if (req.user.role === "admin") {
    return next();
  }

  if (req.user.user_id === resourceUserId) {
    return next();
  }

  return sendResponse(res, 403, null, "You do not have access to this resource.");
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireStaffOrAdmin,
  requireOwnerOrAdmin,
};
