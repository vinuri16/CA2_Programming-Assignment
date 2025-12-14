const pool = require("../utils/db");
const { hashPassword, comparePassword } = require("../utils/helpers");

/**
 * Find user by username or email
 */
async function findUserByUsernameOrEmail(username, email) {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Find user by ID
 */
async function findUserById(userId) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    throw error;
  }
}

/**
 * Create a new user
 */
async function createUser(username, email, password, role = "customer") {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, role, created_at",
      [username, email, hashedPassword, role]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Verify user password
 */
async function verifyPassword(user, password) {
  return await comparePassword(password, user.password_hash);
}

/**
 * Get all users (admin only)
 */
async function getAllUsers() {
  try {
    const result = await pool.query(
      "SELECT user_id, username, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

/**
 * Update user role
 */
async function updateUserRole(userId, newRole) {
  try {
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE user_id = $2 RETURNING user_id, username, email, role",
      [newRole, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

/**
 * Delete user (admin only)
 */
async function deleteUser(userId) {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id",
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  findUserByUsernameOrEmail,
  findUserById,
  createUser,
  verifyPassword,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
