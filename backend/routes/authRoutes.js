const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

/**
 * Authentication Routes
 */

// Register new customer
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Logout (requires token)
router.post("/logout", authenticateToken, authController.logout);

// Get current user profile
router.get("/profile", authenticateToken, authController.getProfile);

// Update user profile
router.put("/profile", authenticateToken, authController.updateProfile);

module.exports = router;
