// dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Loads variables from .env file
const path = require("path");

// Import database connection
const pool = require("./utils/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const plantRoutes = require("./routes/plantRoutes");

// Initialize the App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/plants", plantRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🌱 Urban Plant Life Inventory & Order Tracking System API",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("📋 Available endpoints:");
  console.log("\tPOST   /api/auth/register");
  console.log("\tPOST   /api/auth/login");
  console.log("\tPOST   /api/auth/logout");
  console.log("\tGET    /api/auth/profile");
  console.log("\tPUT    /api/auth/profile");
  console.log("\tGET    /api/plants");
  console.log("\tGET    /api/plants/:id");
  console.log("\tPOST   /api/plants (admin)");
  console.log("\tPUT    /api/plants/:id (admin)");
  console.log("\tDELETE /api/plants/:id (admin)");
});
