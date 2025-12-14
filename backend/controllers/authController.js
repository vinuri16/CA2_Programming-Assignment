const User = require("../models/User");
const { sendResponse, generateToken, isValidEmail, isValidPassword } = require("../utils/helpers");

/**
 * Register a new user (customer)
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    // Validation
    if (!username || !email || !password || !passwordConfirm) {
      return sendResponse(
        res,
        400,
        null,
        "All fields are required (username, email, password, passwordConfirm)."
      );
    }

    if (!isValidEmail(email)) {
      return sendResponse(res, 400, null, "Invalid email format.");
    }

    if (!isValidPassword(password)) {
      return sendResponse(
        res,
        400,
        null,
        "Password must be at least 6 characters long."
      );
    }

    if (password !== passwordConfirm) {
      return sendResponse(res, 400, null, "Passwords do not match.");
    }

    // Check if user already exists
    const existingUser = await User.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return sendResponse(
        res,
        409,
        null,
        "Username or email already in use. Please choose another."
      );
    }

    // Create user
    const newUser = await User.createUser(username, email, password, "customer");

    return sendResponse(res, 201, newUser, "User registered successfully.");
  } catch (error) {
    console.error("Registration error:", error);
    return sendResponse(res, 500, null, "Server error during registration.");
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendResponse(res, 400, null, "Email and password are required.");
    }

    // Find user by email
    const user = await User.findUserByUsernameOrEmail(null, email);
    if (!user) {
      return sendResponse(res, 401, null, "Invalid email or password.");
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(user, password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, null, "Invalid email or password.");
    }

    // Generate token
    const token = generateToken(user);

    return sendResponse(
      res,
      200,
      {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful."
    );
  } catch (error) {
    console.error("Login error:", error);
    return sendResponse(res, 500, null, "Server error during login.");
  }
};

/**
 * Logout user (token blacklisting would be needed for production)
 * For now, client-side logout (removing token) is sufficient
 */
exports.logout = (req, res) => {
  return sendResponse(res, 200, null, "Logout successful. Please remove your token on the client.");
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findUserById(req.user.user_id);
    if (!user) {
      return sendResponse(res, 404, null, "User not found.");
    }

    return sendResponse(res, 200, {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return sendResponse(res, 500, null, "Server error retrieving profile.");
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.user_id;

    // Check if email/username is already taken by another user
    if (email) {
      const existingUser = await User.findUserByUsernameOrEmail(null, email);
      if (existingUser && existingUser.user_id !== userId) {
        return sendResponse(res, 409, null, "Email already in use.");
      }
    }

    if (username) {
      const existingUser = await User.findUserByUsernameOrEmail(username, null);
      if (existingUser && existingUser.user_id !== userId) {
        return sendResponse(res, 409, null, "Username already in use.");
      }
    }

    // Update user would require additional functionality in User model
    // For now, just return message
    return sendResponse(res, 200, null, "Profile update not yet implemented.");
  } catch (error) {
    console.error("Update profile error:", error);
    return sendResponse(res, 500, null, "Server error updating profile.");
  }
};
