const pool = require("../utils/db");

/**
 * Get all plants with optional search and sort
 */
async function getAllPlants(searchText = null, sortType = "newest") {
  try {
    let query = "SELECT * FROM plants";
    const params = [];

    if (searchText) {
      query += " WHERE name ILIKE $1 OR description ILIKE $2";
      params.push(`%${searchText}%`, `%${searchText}%`);
    }

    // Handle sorting
    switch (sortType) {
      case "price_asc":
        query += " ORDER BY price ASC";
        break;
      case "price_desc":
        query += " ORDER BY price DESC";
        break;
      case "name":
        query += " ORDER BY name ASC";
        break;
      default:
        query += " ORDER BY created_at DESC";
    }

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get single plant by ID
 */
async function getPlantById(plantId) {
  try {
    const result = await pool.query("SELECT * FROM plants WHERE plant_id = $1", [
      plantId,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new plant (admin only)
 */
async function createPlant(name, description, price, stockQuantity, lowStockThreshold, imageUrl) {
  try {
    const result = await pool.query(
      "INSERT INTO plants (name, description, price, stock_quantity, low_stock_threshold, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, stockQuantity, lowStockThreshold, imageUrl]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Update a plant (admin only)
 */
async function updatePlant(plantId, updateData) {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      return await getPlantById(plantId);
    }

    values.push(plantId);
    const query = `UPDATE plants SET ${fields.join(", ")} WHERE plant_id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a plant (admin only)
 */
async function deletePlant(plantId) {
  try {
    const result = await pool.query(
      "DELETE FROM plants WHERE plant_id = $1 RETURNING plant_id",
      [plantId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Get low stock plants (staff/admin)
 */
async function getLowStockPlants() {
  try {
    const result = await pool.query(
      "SELECT * FROM plants WHERE stock_quantity <= low_stock_threshold ORDER BY stock_quantity ASC"
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Update plant stock (when order is placed)
 */
async function updatePlantStock(plantId, quantityChange) {
  try {
    const result = await pool.query(
      "UPDATE plants SET stock_quantity = stock_quantity + $1 WHERE plant_id = $2 RETURNING *",
      [quantityChange, plantId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getLowStockPlants,
  updatePlantStock,
};
