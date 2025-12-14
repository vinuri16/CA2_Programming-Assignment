'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '@/lib/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // Load user from localStorage and fetch cart on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      fetchCart();
    }
  }, []);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartAPI.getCart();
      setCartItems(Array.isArray(response) ? response : response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (plant) => {
    try {
      setError('');
      const response = await cartAPI.addToCart(plant.plant_id, 1);

      // Update local state with the full plant data
      const existingItem = cartItems.find(item => item.plant_id === plant.plant_id);

      if (existingItem) {
        setCartItems(cartItems.map(item =>
          item.plant_id === plant.plant_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCartItems([...cartItems, { ...plant, quantity: 1 }]);
      }

      return response;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (plantId) => {
    try {
      setError('');
      await cartAPI.removeFromCart(plantId);
      setCartItems(prevItems => prevItems.filter(item => item.plant_id !== plantId));
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateQuantity = async (plantId, quantity) => {
    try {
      setError('');

      if (quantity <= 0) {
        await removeFromCart(plantId);
        return;
      }

      await cartAPI.updateCartItem(plantId, quantity);

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.plant_id === plantId
            ? { ...item, quantity }
            : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError('');
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message);
      throw err;
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isLoading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
