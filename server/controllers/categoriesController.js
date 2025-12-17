import {
    getAllCategories as getAllCategoriesModel,
    getCategoryById as getCategoryByIdModel,
    getCategoriesWithCount,
    createCategory as createCategoryModel,
    updateCategory as updateCategoryModel,
    deleteCategory as deleteCategoryModel
} from '../models/categoriesModel.js';


/**
 * Get all categories
 * GET /api/categories
 */
const getAllCategories = async (req, res, next) => {
    try {
        const includeCount = req.query.includeCount === 'true';
        
        let categories;
        if (includeCount) {
            categories = await getCategoriesWithCount();
        } else {
            categories = await getAllCategoriesModel();
        }
        
        res.json({ categories });
    } catch (error) {
        next(error);
    }
};

/**
 * Get category by ID
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = await getCategoryByIdModel(categoryId);
        
        if (!category) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Category not found'
            });
        }
        
        res.json({ category });
    } catch (error) {
        next(error);
    }
};

/**
 * Create new category (admin only)
 * POST /api/categories
 */
const createCategory = async (req, res, next) => {
    try {
        const { category_name, description } = req.body;
        
        if (!category_name || category_name.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Category name is required'
            });
        }
        
        const category = await createCategoryModel(category_name, description);
        
        res.status(201).json({
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        if (error.message === 'A category with this name already exists') {
            return res.status(409).json({
                error: 'Conflict',
                message: error.message
            });
        }
        next(error);
    }
};

/**
 * Update category (admin only)
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        const { category_name, description } = req.body;
        
        if (!category_name || category_name.trim().length === 0) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Category name is required'
            });
        }
        
        const category = await updateCategoryModel(categoryId, category_name, description);
        
        if (!category) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Category not found'
            });
        }
        
        res.json({
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        if (error.message === 'A category with this name already exists') {
            return res.status(409).json({
                error: 'Conflict',
                message: error.message
            });
        }
        next(error);
    }
};

/**
 * Delete category (admin only)
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = await deleteCategoryModel(categoryId);
        
        if (!category) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Category not found'
            });
        }
        
        res.json({
            message: 'Category deleted successfully',
            category
        });
    } catch (error) {
        next(error);
    }
};


export {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};