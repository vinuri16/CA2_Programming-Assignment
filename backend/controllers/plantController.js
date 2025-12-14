const Plant = require("../models/Plant");
const { sendResponse } = require("../utils/helpers");

/**
 * GET all plants (public - for customers to browse)
 */
exports.getAllPlants = async (req, res) => {
  try {
    const searchText = req.query.search || null;
    const sortType = req.query.sort || "newest";

    const plants = await Plant.getAllPlants(searchText, sortType);

    return sendResponse(res, 200, plants, "Plants retrieved successfully.");
  } catch (error) {
    console.error("Error getting plants:", error);
    return sendResponse(res, 500, null, "Server error retrieving plants.");
  }
};

/**
 * GET single plant by ID (public)
 */
exports.getPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return sendResponse(res, 400, null, "Valid plant ID is required.");
    }

    const plant = await Plant.getPlantById(parseInt(id, 10));
    if (!plant) {
      return sendResponse(res, 404, null, "Plant not found.");
    }

    return sendResponse(res, 200, plant, "Plant retrieved successfully.");
  } catch (error) {
    console.error("Error getting plant:", error);
    return sendResponse(res, 500, null, "Server error retrieving plant.");
  }
};

/**
 * CREATE a new plant (admin only)
 */
exports.createPlant = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, low_stock_threshold, image_url } = req.body;

    // Validation
    if (!name || !price || stock_quantity === undefined) {
      return sendResponse(
        res,
        400,
        null,
        "Name, price, and stock_quantity are required."
      );
    }

    if (isNaN(price) || price < 0) {
      return sendResponse(res, 400, null, "Price must be a positive number.");
    }

    if (isNaN(stock_quantity) || stock_quantity < 0) {
      return sendResponse(res, 400, null, "Stock quantity must be a non-negative number.");
    }

    const newPlant = await Plant.createPlant(
      name,
      description || null,
      parseFloat(price),
      parseInt(stock_quantity, 10),
      low_stock_threshold || 10,
      image_url || null
    );

    return sendResponse(res, 201, newPlant, "Plant created successfully.");
  } catch (error) {
    console.error("Error creating plant:", error);
    return sendResponse(res, 500, null, "Server error creating plant.");
  }
};

/**
 * UPDATE a plant (admin only)
 */
exports.updatePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return sendResponse(res, 400, null, "Valid plant ID is required.");
    }

    const plant = await Plant.getPlantById(parseInt(id, 10));
    if (!plant) {
      return sendResponse(res, 404, null, "Plant not found.");
    }

    const updateData = {};
    const { name, description, price, stock_quantity, low_stock_threshold, image_url, image } = req.body;

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock_quantity !== undefined) updateData.stock_quantity = parseInt(stock_quantity, 10);
    if (low_stock_threshold !== undefined) updateData.low_stock_threshold = parseInt(low_stock_threshold, 10);

    // Support both 'image' (Uploadcare CDN) and 'image_url' (backward compatibility)
    if (image) updateData.image_url = image;
    else if (image_url) updateData.image_url = image_url;

    const updatedPlant = await Plant.updatePlant(parseInt(id, 10), updateData);

    return sendResponse(res, 200, updatedPlant, "Plant updated successfully.");
  } catch (error) {
    console.error("Error updating plant:", error);
    return sendResponse(res, 500, null, "Server error updating plant.");
  }
};

/**
 * DELETE a plant (admin only)
 */
exports.deletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return sendResponse(res, 400, null, "Valid plant ID is required.");
    }

    const plant = await Plant.getPlantById(parseInt(id, 10));
    if (!plant) {
      return sendResponse(res, 404, null, "Plant not found.");
    }

    await Plant.deletePlant(parseInt(id, 10));

    return sendResponse(res, 200, null, "Plant deleted successfully.");
  } catch (error) {
    console.error("Error deleting plant:", error);
    return sendResponse(res, 500, null, "Server error deleting plant.");
  }
};

/**
 * GET low stock plants (staff/admin)
 */
exports.getLowStockPlants = async (req, res) => {
  try {
    const plants = await Plant.getLowStockPlants();
    return sendResponse(res, 200, plants, "Low stock plants retrieved successfully.");
  } catch (error) {
    console.error("Error getting low stock plants:", error);
    return sendResponse(res, 500, null, "Server error retrieving low stock plants.");
  }
};

