const Order = require("../models/Order");
const Plant = require("../models/Plant");
const { sendResponse } = require("../utils/helpers");

/**
 * CREATE a new order (customer)
 */
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.user_id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendResponse(res, 400, null, "Order must contain at least one item.");
    }

    let totalAmount = 0;
    const validatedItems = [];

    // Validate and calculate total
    for (const item of items) {
      if (!item.plant_id || !item.quantity || item.quantity <= 0) {
        return sendResponse(res, 400, null, "Each item must have plant_id and quantity > 0.");
      }

      const plant = await Plant.getPlantById(item.plant_id);
      if (!plant) {
        return sendResponse(res, 400, null, `Plant with ID ${item.plant_id} not found.`);
      }

      if (plant.stock_quantity < item.quantity) {
        return sendResponse(
          res,
          400,
          null,
          `Insufficient stock for ${plant.name}. Available: ${plant.stock_quantity}`
        );
      }

      validatedItems.push({
        ...item,
        price: plant.price,
      });

      totalAmount += plant.price * item.quantity;
    }

    // Create order
    const order = await Order.createOrder(userId, totalAmount, "pending");

    // Add items to order
    for (const item of validatedItems) {
      await Order.addOrderItem(order.order_id, item.plant_id, item.quantity, item.price);
      // Deduct from stock
      await Plant.updatePlantStock(item.plant_id, -item.quantity);
    }

    // Fetch complete order with items
    const orderItems = await Order.getOrderItems(order.order_id);
    const completeOrder = { ...order, items: orderItems };

    return sendResponse(res, 201, completeOrder, "Order created successfully.");
  } catch (error) {
    console.error("Error creating order:", error);
    return sendResponse(res, 500, null, "Server error creating order.");
  }
};

/**
 * GET order by ID (customer can view own, admin can view all)
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return sendResponse(res, 400, null, "Valid order ID is required.");
    }

    const order = await Order.getOrderById(parseInt(id, 10));
    if (!order) {
      return sendResponse(res, 404, null, "Order not found.");
    }

    // Check authorization
    if (req.user.role !== "admin" && order.user_id !== req.user.user_id) {
      return sendResponse(res, 403, null, "You do not have access to this order.");
    }

    // Get order items
    const items = await Order.getOrderItems(order.order_id);

    return sendResponse(res, 200, { ...order, items }, "Order retrieved successfully.");
  } catch (error) {
    console.error("Error getting order:", error);
    return sendResponse(res, 500, null, "Server error retrieving order.");
  }
};

/**
 * GET order history for customer
 */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const orders = await Order.getOrdersByUserId(userId);

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getOrderItems(order.order_id);
        return { ...order, items };
      })
    );

    return sendResponse(
      res,
      200,
      ordersWithItems,
      "Order history retrieved successfully."
    );
  } catch (error) {
    console.error("Error getting order history:", error);
    return sendResponse(res, 500, null, "Server error retrieving order history.");
  }
};

/**
 * GET all orders (admin/staff)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const orders = await Order.getAllOrders(status || null);

    // Fetch items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getOrderItems(order.order_id);
        return { ...order, items };
      })
    );

    return sendResponse(
      res,
      200,
      ordersWithItems,
      "Orders retrieved successfully."
    );
  } catch (error) {
    console.error("Error getting orders:", error);
    return sendResponse(res, 500, null, "Server error retrieving orders.");
  }
};

/**
 * UPDATE order status (staff/admin)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return sendResponse(res, 400, null, "Valid order ID is required.");
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return sendResponse(
        res,
        400,
        null,
        `Status must be one of: ${validStatuses.join(", ")}`
      );
    }

    const order = await Order.getOrderById(parseInt(id, 10));
    if (!order) {
      return sendResponse(res, 404, null, "Order not found.");
    }

    const updatedOrder = await Order.updateOrderStatus(parseInt(id, 10), status);
    const items = await Order.getOrderItems(updatedOrder.order_id);

    return sendResponse(
      res,
      200,
      { ...updatedOrder, items },
      "Order status updated successfully."
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return sendResponse(res, 500, null, "Server error updating order status.");
  }
};

/**
 * DELETE order (admin only)
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return sendResponse(res, 400, null, "Valid order ID is required.");
    }

    const order = await Order.getOrderById(parseInt(id, 10));
    if (!order) {
      return sendResponse(res, 404, null, "Order not found.");
    }

    // Get items to refund stock
    const items = await Order.getOrderItems(parseInt(id, 10));
    for (const item of items) {
      await Plant.updatePlantStock(item.plant_id, item.quantity);
    }

    await Order.deleteOrder(parseInt(id, 10));

    return sendResponse(res, 200, null, "Order deleted successfully.");
  } catch (error) {
    console.error("Error deleting order:", error);
    return sendResponse(res, 500, null, "Server error deleting order.");
  }
};

/**
 * GET order statistics (admin)
 */
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getOrderStats();

    return sendResponse(res, 200, stats, "Order statistics retrieved successfully.");
  } catch (error) {
    console.error("Error getting order stats:", error);
    return sendResponse(res, 500, null, "Server error retrieving statistics.");
  }
};
