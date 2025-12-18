// server/routes/adminRoutes.js
import { Router } from 'express';
import {
  getAllUsers,
  searchUserByEmail,
  updateUserRole
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

// All routes require admin role
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/users', getAllUsers);

// GET /api/admin/users/search?email=... - Search user by email
router.get('/users/search', searchUserByEmail);

// PUT /api/admin/users/:id/role - Update user role
router.put('/users/:id/role', updateUserRole);

export default router;