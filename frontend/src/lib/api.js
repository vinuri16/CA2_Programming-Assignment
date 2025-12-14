const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper function to get authorization headers
 */
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

/**
 * Helper function to handle API responses
 */
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    // Extract error message from backend response
    const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Authentication APIs
 */
export const authAPI = {
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  /**
   * Register a new user
   * @param {string} username - Username
   * @param {string} email - User email
   * @param {string} password - Password
   * @returns {Promise<object>} User object
   */
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(response);
  },

  /**
   * Get current user profile
   * @returns {Promise<object>} User profile data
   */
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

/**
 * Plant APIs
 */
export const plantAPI = {
  /**
   * Get all plants with optional search and filtering
   * @param {object} options - Query options
   * @param {string} options.search - Search term
   * @param {string} options.category - Filter by category
   * @param {string} options.sort - Sort field
   * @returns {Promise<Array>} Array of plants
   */
  getAll: async (options = {}) => {
    const params = new URLSearchParams();
    if (options.search) params.append('search', options.search);
    if (options.category) params.append('category', options.category);
    if (options.sort) params.append('sort', options.sort);

    const url = `${API_BASE_URL}/plants${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Get a single plant by ID
   * @param {number} id - Plant ID
   * @returns {Promise<object>} Plant data
   */
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Create a new plant (admin only)
   * @param {object} plantData - Plant data
   * @returns {Promise<object>} Created plant
   */
  create: async (plantData) => {
    const response = await fetch(`${API_BASE_URL}/plants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(plantData)
    });
    return handleResponse(response);
  },

  /**
   * Update a plant (admin only)
   * @param {number} id - Plant ID
   * @param {object} plantData - Updated plant data
   * @returns {Promise<object>} Updated plant
   */
  update: async (id, plantData) => {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(plantData)
    });
    return handleResponse(response);
  },

  /**
   * Delete a plant (admin only)
   * @param {number} id - Plant ID
   * @returns {Promise<object>} Confirmation response
   */
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/plants/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

/**
 * Order APIs
 */
export const orderAPI = {
  /**
   * Get all orders (admin) or user's orders (customer)
   * @param {object} options - Query options
   * @returns {Promise<Array>} Array of orders
   */
  getAll: async (options = {}) => {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.search) params.append('search', options.search);

    const url = `${API_BASE_URL}/orders${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Get orders for the current user
   * @returns {Promise<Array>} Array of user's orders
   */
  getForUser: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Get a single order by ID
   * @param {number} id - Order ID
   * @returns {Promise<object>} Order data
   */
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Create a new order (customer)
   * @param {object} orderData - Order data with items
   * @returns {Promise<object>} Created order
   */
  create: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(response);
  },

  /**
   * Update order status (admin only)
   * @param {number} id - Order ID
   * @param {string} status - New status
   * @returns {Promise<object>} Updated order
   */
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  /**
   * Get order statistics (admin only)
   * @returns {Promise<object>} Order statistics
   */
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

/**
 * Cart APIs
 */
export const cartAPI = {
  /**
   * Get all items in user's cart
   * @returns {Promise<Array>} Array of cart items
   */
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Add item to cart
   * @param {number} plant_id - Plant ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<object>} Cart item
   */
  addToCart: async (plant_id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ plant_id, quantity })
    });
    return handleResponse(response);
  },

  /**
   * Get specific cart item
   * @param {number} plant_id - Plant ID
   * @returns {Promise<object>} Cart item
   */
  getCartItem: async (plant_id) => {
    const response = await fetch(`${API_BASE_URL}/cart/${plant_id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Update cart item quantity
   * @param {number} plant_id - Plant ID
   * @param {number} quantity - New quantity
   * @returns {Promise<object>} Updated cart item
   */
  updateCartItem: async (plant_id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${plant_id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    return handleResponse(response);
  },

  /**
   * Remove item from cart
   * @param {number} plant_id - Plant ID
   * @returns {Promise<object>} Removed item
   */
  removeFromCart: async (plant_id) => {
    const response = await fetch(`${API_BASE_URL}/cart/${plant_id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Clear entire cart
   * @returns {Promise<object>} Confirmation
   */
  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse(response);
};
