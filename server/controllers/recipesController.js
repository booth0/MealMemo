import {
    createRecipe as createRecipeModel,
    getRecipesByOwner,
    getRecipeById as getRecipeModel,
    updateRecipe as updateRecipeModel,
    deleteRecipe as deleteRecipeModel,
    userOwnsRecipe,
    searchUserRecipes
} from '../models/recipesModel.js';
import { submitRecipeForReview as submitRecipeModel, isRecipeFeatured } from '../models/submissionsModel.js';
import { setRecipeCategories } from '../models/categoriesModel.js';

/**
 * Get current user's recipes
 * GET /api/recipes
 */
const getUserRecipes = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const searchTerm = req.query.search || '';

        let recipes;
        if (searchTerm) {
            recipes = await searchUserRecipes(userId, searchTerm);
        } else {
            recipes = await getRecipesByOwner(userId);
        }

        res.json({ recipes });
    } catch (error) {
        next(error);
    }
};

/**
 * Get specific recipe
 * GET /api/recipes/:id
 */
const getRecipeById = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.user_id;

        const recipe = await getRecipeModel(recipeId);

        if (!recipe) {
            return res.status(404).json ({
                error: 'Not Found',
                message: 'Recipe not found'
            });
        }

        // Check ownership
        if (recipe.owner_id !== userId) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You do not have permission to view this recipe'
            });
        }

        res.json({ recipe });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new recipe
 * POST /api/recipes
 */
const createRecipe = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const { title, description, instructions, prep_time, cook_time, servings, difficulty, image_url, ingredients, categories } = req.body;

        // Validation
        if (!title || !instructions) {
            return res.status(400).json({
                error:'Validation Error',
                message: 'Title and instructions are required'
            });
        }

        const recipeData = {
            title: title.trim(),
            description: description?.trim() || null,
            instructions: instructions.trim(),
            prep_time: prep_time ? parseInt(prep_time) : null,
            cook_time: cook_time ? parseInt(cook_time) : null,
            servings: servings ? parseInt(servings) : null,
            difficulty: difficulty || null,
            image_url: image_url?.trim() || null,
            owner_id: userId
        }

        const recipe = await createRecipeModel(recipeData, ingredients || []);

        // Set categories if provided
        if (categories && categories.length > 0) {
            await setRecipeCategories(recipe.recipe_id, categories);
        }

        res.status(201).json({
            message: 'Recipe created successfully',
            recipe
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update recipe
 * PUT /api/recipes/:id
 */
const updateRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.user_id;
        const { title, description, instructions, prep_time, cook_time, servings, difficulty, image_url, ingredients, categories } = req.body;

        // Check ownership
        const isOwner = await userOwnsRecipe(userId, recipeId);
        if (!isOwner) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'You can only edit your own recipes'
            });
        }

        // Check if featured
        const isFeatured = await isRecipeFeatured(recipeId);
        if (isFeatured) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Featured recipes cannot be edited'
            });
        }

        // Validation
        if (!title || !instructions) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Title and instructions are required'
            });
        }

        const recipeData = {
        title: title.trim(),
        description: description?.trim() || null,
        instructions: instructions.trim(),
        prep_time: prep_time ? parseInt(prep_time) : null,
        cook_time: cook_time ? parseInt(cook_time) : null,
        servings: servings ? parseInt(servings) : null,
        difficulty: difficulty || null,
        image_url: image_url?.trim() || null
        };

        const updatedRecipe = await updateRecipeModel(recipeId, recipeData, ingredients || []);
   
        // Update categories
        if (categories) {
            await setRecipeCategories(recipeId, categories);
        }

        res.json({
            message: 'Recipe updated successfully',
            recipe: updatedRecipe
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete recipe
 * DELETE /api/recipes/:id
 */
const deleteRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.user_id;

        // Check Ownership
        const isOwner = await userOwnsRecipe(userId, recipeId);
        if (!isOwner) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'You can only delete your own recipes' 
            });
        }

        await deleteRecipeModel(recipeId);

        res.json({
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Submit recipe for review
 * POST /api/recipes/:id/submit
 */
const submitRecipeForReview = async (req, res, next) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user.user_id;

        // Check ownership
        const isOwner = await userOwnsRecipe(userId, recipeId);
        if (!isOwner) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: 'You can only submit your own recipes' 
            });
        }

        const submission = await submitRecipeModel(recipeId, userId);

        res.status(201).json({
            message: 'Recipe submitted for review successfully',
            submission
        });
    } catch (error) {
        if (error.message === 'Recipe is already submitted for review') {
            return res.status(409).json({
                error: 'Conflict',
                message: error.message
            });
        }
        next(error);
    }
};


export {
    getUserRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    submitRecipeForReview
};

