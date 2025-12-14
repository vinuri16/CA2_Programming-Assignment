const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateToken, requireAdmin, requireStaffOrAdmin } = require("../middleware/authMiddleware");

/**
 * Order Routes
 */

// CREATE order (customer)
router.post("/", authenticateToken, orderController.createOrder);

// GET my orders (customer - order history)
router.get("/my-orders", authenticateToken, orderController.getMyOrders);

// GET all orders (staff/admin)
router.get("/", authenticateToken, requireStaffOrAdmin, orderController.getAllOrders);

// GET order statistics (admin)
router.get("/stats", authenticateToken, requireAdmin, orderController.getOrderStats);

// GET order by ID (customer can view own, admin can view all)
router.get("/:id", authenticateToken, orderController.getOrderById);

// UPDATE order status (staff/admin)
router.put("/:id/status", authenticateToken, requireStaffOrAdmin, orderController.updateOrderStatus);

// DELETE order (admin only)
router.delete("/:id", authenticateToken, requireAdmin, orderController.deleteOrder);

module.exports = router;
