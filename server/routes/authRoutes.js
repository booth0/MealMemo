// server/routes/authRoutes.js
import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/me - Get current user info
router.get('/me', requireAuth, getCurrentUser);

export default router;