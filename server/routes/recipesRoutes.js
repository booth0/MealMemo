// server/routes/recipesRoutes.js
import { Router } from 'express';
import {
  getUserRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  submitRecipeForReview
} from '../controllers/recipesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/recipes - Get current user's recipes
router.get('/', getUserRecipes);

// POST /api/recipes - Create new recipe
router.post('/', createRecipe);

// GET /api/recipes/:id - Get specific recipe
router.get('/:id', getRecipeById);

// PUT /api/recipes/:id - Update recipe
router.put('/:id', updateRecipe);

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', deleteRecipe);

// POST /api/recipes/:id/submit - Submit recipe for review
router.post('/:id/submit', submitRecipeForReview);

export default router;