const Cart = require("../models/Cart");
const { sendResponse } = require("../utils/helpers");

/**
 * GET all cart items for authenticated user
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const cartItems = await Cart.getCartByUserId(userId);

    return sendResponse(res, 200, cartItems, "Cart retrieved successfully.");
  } catch (error) {
    console.error("Error getting cart:", error);
    return sendResponse(res, 500, null, "Server error retrieving cart.");
  }
};

/**
 * POST add item to cart
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { plant_id, quantity } = req.body;

    // Validation
    if (!plant_id || !quantity) {
      return sendResponse(
        res,
        400,
        null,
        "Plant ID and quantity are required."
      );
    }

    if (isNaN(quantity) || quantity <= 0) {
      return sendResponse(res, 400, null, "Quantity must be a positive number.");
    }

    const cartItem = await Cart.addToCart(userId, parseInt(plant_id), parseInt(quantity));

    return sendResponse(res, 201, cartItem, "Item added to cart successfully.");
  } catch (error) {
    console.error("Error adding to cart:", error);
    return sendResponse(res, 500, null, "Server error adding to cart.");
  }
};

/**
 * PUT update cart item quantity
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { plant_id } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity) {
      return sendResponse(res, 400, null, "Quantity is required.");
    }

    if (isNaN(quantity)) {
      return sendResponse(res, 400, null, "Quantity must be a number.");
    }

    const updatedItem = await Cart.updateCartItemQuantity(
      userId,
      parseInt(plant_id),
      parseInt(quantity)
    );

    if (!updatedItem) {
      return sendResponse(res, 404, null, "Cart item not found.");
    }

    return sendResponse(res, 200, updatedItem, "Cart item updated successfully.");
  } catch (error) {
    console.error("Error updating cart item:", error);
    return sendResponse(res, 500, null, "Server error updating cart item.");
  }
};

/**
 * DELETE remove item from cart
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { plant_id } = req.params;

    const removedItem = await Cart.removeFromCart(userId, parseInt(plant_id));

    if (!removedItem) {
      return sendResponse(res, 404, null, "Cart item not found.");
    }

    return sendResponse(res, 200, removedItem, "Item removed from cart successfully.");
  } catch (error) {
    console.error("Error removing from cart:", error);
    return sendResponse(res, 500, null, "Server error removing from cart.");
  }
};

/**
 * DELETE clear entire cart
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.user_id;

    await Cart.clearCart(userId);

    return sendResponse(res, 200, null, "Cart cleared successfully.");
  } catch (error) {
    console.error("Error clearing cart:", error);
    return sendResponse(res, 500, null, "Server error clearing cart.");
  }
};

/**
 * GET single cart item
 */
exports.getCartItem = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { plant_id } = req.params;

    const cartItem = await Cart.getCartItem(userId, parseInt(plant_id));

    if (!cartItem) {
      return sendResponse(res, 404, null, "Cart item not found.");
    }

    return sendResponse(res, 200, cartItem, "Cart item retrieved successfully.");
  } catch (error) {
    console.error("Error getting cart item:", error);
    return sendResponse(res, 500, null, "Server error retrieving cart item.");
  }
};
