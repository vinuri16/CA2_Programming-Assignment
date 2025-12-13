const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");

// GET all plants
router.get("/", plantController.getAllPlants);

// GET a single plant by ID
router.get("/:id", plantController.getPlantById);

// POST a new plant
router.post("/", plantController.createPlant);

// PUT (update) a plant
router.put("/:id", plantController.updatePlant);

// DELETE a plant
router.delete("/:id", plantController.deletePlant);

module.exports = router;
