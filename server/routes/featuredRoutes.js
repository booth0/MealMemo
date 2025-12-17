// server/routes/featuredRoutes.js
import { Router } from 'express';
import {
  getAllFeaturedRecipes,
  getFeaturedRecipeById,
  copyFeaturedRecipe,
  unfeatureRecipe,
  deleteFeaturedRecipe
} from '../controllers/featuredController.js';
import { requireAuth, requireContributor, optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/featured - Get all featured recipes (public, but can be authenticated)
router.get('/', optionalAuth, getAllFeaturedRecipes);

// GET /api/featured/:id - Get specific featured recipe (public)
router.get('/:id', optionalAuth, getFeaturedRecipeById);

// POST /api/featured/:id/copy - Copy featured recipe to user's collection
router.post('/:id/copy', requireAuth, copyFeaturedRecipe);

// POST /api/featured/:id/unfeature - Remove featured status
router.post('/:id/unfeature', requireContributor, unfeatureRecipe);

// DELETE /api/featured/:id - Delete featured recipe
router.delete('/:id', requireAuth, deleteFeaturedRecipe);

export default router;