// /server/controllers/featuredController.js
import {
    getAllFeaturedRecipes as getAllFeaturedRecipesModel,
    searchFeaturedRecipes as searchFeaturedRecipesModel,
    getFeaturedRecipeById as getFeaturedRecipeByIdModel,
    unfeatureRecipe as unfeatureRecipeModel
} from '../models/featuredModel.js';
import { copyRecipe, deleteRecipe } from '../models/recipesModel.js';


/**
 * Get all featured recipes
 * GET /api/featured
 */
const getAllFeaturedRecipes = async (req, res, next) => {
    try {
        const searchTerm = req.query.search || '';
        
        let recipes;
        if (searchTerm) {
            recipes = await searchFeaturedRecipesModel(searchTerm);
        } else {
            recipes = await getAllFeaturedRecipesModel();
        }
        
        res.json({ recipes });
    } catch (error) {
        next(error);
    }
};

/**
 * Get featured recipe by ID
 * GET /api/featured/:id
 */
const getFeaturedRecipeById = async (req, res, next) => {
    try {
        const recipeId = parseInt(req.params.id);
        const recipe = await getFeaturedRecipeByIdModel(recipeId);
        
        if (!recipe) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Featured recipe not found'
            });
        }
        
        // Check if current user owns this recipe
        const isOwner = req.user && recipe.owner_id === req.user.user_id;
        
        res.json({ 
            recipe,
            isOwner 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Copy featured recipe to user's collection
 * POST /api/featured/:id/copy
 */
const copyFeaturedRecipe = async (req, res, next) => {
    try {
        const recipeId = parseInt(req.params.id);
        const userId = req.user.user_id;
        
        // Verify recipe is featured
        const recipe = await getFeaturedRecipeByIdModel(recipeId);
        if (!recipe) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Featured recipe not found'
            });
        }
        
        // Don't allow users to copy their own featured recipes
        if (recipe.owner_id === userId) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'You already own this recipe'
            });
        }
        
        const newRecipe = await copyRecipe(recipeId, userId);
        
        res.status(201).json({
            message: 'Recipe copied to your collection successfully',
            recipe: newRecipe
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Remove featured status from a recipe (contributor/admin only)
 * POST /api/featured/:id/unfeature
 */
const unfeatureRecipe = async (req, res, next) => {
    try {
        const recipeId = parseInt(req.params.id);
        const result = await unfeatureRecipeModel(recipeId);
        
        if (!result) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Featured recipe not found'
            });
        }
        
        res.json({
            message: 'Recipe removed from featured list successfully',
            recipe: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a featured recipe (owner, contributor, or admin)
 * DELETE /api/featured/:id
 */
const deleteFeaturedRecipe = async (req, res, next) => {
    try {
        const recipeId = parseInt(req.params.id);
        const userId = req.user.user_id;
        const userRole = req.user.role;
        
        const recipe = await getFeaturedRecipeByIdModel(recipeId);
        
        if (!recipe) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Recipe not found'
            });
        }
        
        // Check permissions: owner can delete OR contributor/admin can delete any
        const canDelete = recipe.owner_id === userId || ['contributor', 'admin'].includes(userRole);
        
        if (!canDelete) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to delete this recipe'
            });
        }
        
        await deleteRecipe(recipeId);
        
        res.json({
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};


export {
    getAllFeaturedRecipes,
    getFeaturedRecipeById,
    copyFeaturedRecipe,
    unfeatureRecipe,
    deleteFeaturedRecipe
};