// server/routes/categoriesRoutes.js
import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoriesController.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/categories - Get all categories (public for users to see when creating recipes)
router.get('/', getAllCategories);

// GET /api/categories/:id - Get specific category
router.get('/:id', getCategoryById);

// Admin-only routes
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;