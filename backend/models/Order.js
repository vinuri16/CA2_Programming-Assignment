const pool = require("../utils/db");

/**
 * Create a new order
 */
async function createOrder(userId, totalAmount, status = "pending") {
  try {
    const result = await pool.query(
      "INSERT INTO orders (user_id, status, total_amount) VALUES ($1, $2, $3) RETURNING *",
      [userId, status, totalAmount]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Get order by ID
 */
async function getOrderById(orderId) {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE order_id = $1", [
      orderId,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all orders for a user
 */
async function getOrdersByUserId(userId) {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC",
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all orders (admin/staff)
 */
async function getAllOrders(status = null) {
  try {
    let query = "SELECT o.*, u.username, u.email FROM orders o JOIN users u ON o.user_id = u.user_id";

    if (status) {
      query += " WHERE o.status = $1";
    }

    query += " ORDER BY o.order_date DESC";

    const result = status
      ? await pool.query(query, [status])
      : await pool.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, newStatus) {
  try {
    const result = await pool.query(
      "UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *",
      [newStatus, orderId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Delete order (admin only)
 */
async function deleteOrder(orderId) {
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING order_id",
      [orderId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Add item to order
 */
async function addOrderItem(orderId, plantId, quantity, price) {
  try {
    const result = await pool.query(
      "INSERT INTO order_items (order_id, plant_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [orderId, plantId, quantity, price]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Get items for an order
 */
async function getOrderItems(orderId) {
  try {
    const result = await pool.query(
      "SELECT oi.*, p.name, p.description, p.image_url FROM order_items oi JOIN plants p ON oi.plant_id = p.plant_id WHERE oi.order_id = $1",
      [orderId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Remove item from order
 */
async function removeOrderItem(orderItemId) {
  try {
    const result = await pool.query(
      "DELETE FROM order_items WHERE order_item_id = $1 RETURNING order_item_id",
      [orderItemId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Update order item quantity
 */
async function updateOrderItemQuantity(orderItemId, newQuantity) {
  try {
    const result = await pool.query(
      "UPDATE order_items SET quantity = $1 WHERE order_item_id = $2 RETURNING *",
      [newQuantity, orderItemId]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Get order summary stats (for admin dashboard)
 */
async function getOrderStats() {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
      FROM orders
    `);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  addOrderItem,
  getOrderItems,
  removeOrderItem,
  updateOrderItemQuantity,
  getOrderStats,
};
