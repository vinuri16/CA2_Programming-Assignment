const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const { authenticateToken, requireAdmin, requireStaffOrAdmin } = require("../middleware/authMiddleware");

/**
 * Plant Routes
 */

// GET all plants (public - for browsing)
router.get("/", plantController.getAllPlants);

// GET low stock plants (staff/admin)
router.get("/low-stock", authenticateToken, requireStaffOrAdmin, plantController.getLowStockPlants);

// GET a single plant by ID (public)
router.get("/:id", plantController.getPlantById);

// POST a new plant (admin only)
router.post("/", authenticateToken, requireAdmin, plantController.createPlant);

// PUT (update) a plant (admin only)
router.put("/:id", authenticateToken, requireAdmin, plantController.updatePlant);

// DELETE a plant (admin only)
router.delete("/:id", authenticateToken, requireAdmin, plantController.deletePlant);

module.exports = router;
