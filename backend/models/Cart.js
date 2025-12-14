const pool = require("../utils/db");

/**
 * Get all cart items for a user
 */
async function getCartByUserId(userId) {
  try {
    const result = await pool.query(
      `SELECT 
        c.cart_id, 
        c.user_id, 
        c.plant_id, 
        c.quantity, 
        c.added_at, 
        c.updated_at,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        p.image_url,
        p.category,
        p.care_level,
        p.light_requirement
      FROM carts c
      JOIN plants p ON c.plant_id = p.plant_id
      WHERE c.user_id = $1
      ORDER BY c.added_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Add or update item in cart
 */
async function addToCart(userId, plantId, quantity) {
  try {
    // Check if item already exists
    const existingItem = await pool.query(
      "SELECT * FROM carts WHERE user_id = $1 AND plant_id = $2",
      [userId, plantId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const result = await pool.query(
        "UPDATE carts SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND plant_id = $3 RETURNING *",
        [quantity, userId, plantId]
      );
      return result.rows[0];
    } else {
      // Insert new item
      const result = await pool.query(
        "INSERT INTO carts (user_id, plant_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [userId, plantId, quantity]
      );
      return result.rows[0];
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Update quantity of item in cart
 */
async function updateCartItemQuantity(userId, plantId, quantity) {
  try {
    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      return await removeFromCart(userId, plantId);
    }

    const result = await pool.query(
      "UPDATE carts SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND plant_id = $3 RETURNING *",
      [quantity, userId, plantId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Remove item from cart
 */
async function removeFromCart(userId, plantId) {
  try {
    const result = await pool.query(
      "DELETE FROM carts WHERE user_id = $1 AND plant_id = $2 RETURNING *",
      [userId, plantId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Clear entire cart for a user
 */
async function clearCart(userId) {
  try {
    await pool.query("DELETE FROM carts WHERE user_id = $1", [userId]);
    return { message: "Cart cleared successfully" };
  } catch (error) {
    throw error;
  }
}

/**
 * Get single cart item
 */
async function getCartItem(userId, plantId) {
  try {
    const result = await pool.query(
      `SELECT 
        c.cart_id, 
        c.user_id, 
        c.plant_id, 
        c.quantity, 
        c.added_at, 
        c.updated_at,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        p.image_url,
        p.category,
        p.care_level,
        p.light_requirement
      FROM carts c
      JOIN plants p ON c.plant_id = p.plant_id
      WHERE c.user_id = $1 AND c.plant_id = $2`,
      [userId, plantId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartItem
};
