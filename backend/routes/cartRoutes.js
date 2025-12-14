const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Cart Routes
 * All routes require authentication
 */

// GET /api/cart - Get all items in user's cart
router.get('/', authenticateToken, cartController.getCart);

// POST /api/cart - Add item to cart
router.post('/', authenticateToken, cartController.addToCart);

// GET /api/cart/:plant_id - Get specific cart item
router.get('/:plant_id', authenticateToken, cartController.getCartItem);

// PUT /api/cart/:plant_id - Update cart item quantity
router.put('/:plant_id', authenticateToken, cartController.updateCartItem);

// DELETE /api/cart/:plant_id - Remove item from cart
router.delete('/:plant_id', authenticateToken, cartController.removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', authenticateToken, cartController.clearCart);

module.exports = router;
