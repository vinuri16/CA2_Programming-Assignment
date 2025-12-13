// dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Loads variables from .env file
const path = require("path");

// Import Routes
const plantRoutes = require("./routes/plantRoutes");

// Initialize the App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows server to parse JSON data sent in requests
app.use(express.static("public")); // Serve static files from the public folder

// API Routes
app.use("/api/plants", plantRoutes);

// Fallback route for SPA (optional, but good practice if we had client-side routing,
// though for this regular HTML setup it just ensures index.html is served)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
