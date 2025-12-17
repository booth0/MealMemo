// server/controllers/authController.js
import { createUser, verifyPassword, getUserByEmail, getUserById } from '../models/usersModel.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    
    // Validation
    const errors = [];
    
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      errors.push('All fields are required');
    }
    
    if (password && password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        messages: errors 
      });
    }
    
    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'An account with this email already exists' 
      });
    }
    
    // Create user
    const newUser = await createUser(email, password, firstName, lastName, 'user');
    
    // Generate token
    const token = generateToken(newUser);
    
    // Return user and token
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        message: 'Email and password are required' 
      });
    }
    
    // Verify credentials
    const user = await verifyPassword(email, password);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid email or password' 
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user info
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    // req.user is set by requireAuth middleware
    const user = await getUserById(req.user.user_id);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Not Found', 
        message: 'User not found' 
      });
    }
    
    res.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        created_at: user.created_at
      }
    });
    
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  getCurrentUser
};