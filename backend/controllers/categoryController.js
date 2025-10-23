import { Category } from "../models/Category.js";
import { validationResult } from 'express-validator';
import { defaultCategories } from "../config/defaultCategories.js";

export const getCategories = async (req, res) => {
    try {
        const { type } = req.query;

        const whereClause = { userId: req.user.id };
        if (type && (type === 'expense' || type === 'income')) {
            whereClause.type = type
        }

        const categories = await Category.findAll({
            where: whereClause,
            order: [['isDefault', 'DESC'], ['createdAt', 'ASC']]
        });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
};

export const getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Get category error: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to feth category'
        })
    }
};

export const createCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, type, color, icon } = req.body;

        const existingCategory = await Category.findOne({
            where: {
                userId: req.user.id,
                name: name,
                type: type
            }
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: `Category "${name}" already exists for ${type}`
            });
        }

        const category = await Category.create({
            userId: req.user.id,
            name,
            type,
            color: color || '#6366f1',
            icon: icon || '📁',
            isDefault: false
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category'
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const category = await Category.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (category.isDefault) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify default categories'
            });
        }

        const { name, type, color, icon } = req.body;

        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({
                where: {
                    userId: req.user.id,
                    name: name,
                    type: type || category.type,
                    id: { [require('sequelize').Op.ne]: category.id }
                }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: `Category "${name}" already exists`
                })
            }
        }

        await category.update({
            name: name || category.name,
            type: type || category.type,
            color: color || category.color,
            icon: icon || category.icon
        });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });

    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category'
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        if (category.isDefault) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete default categories'
            });
        }

        await category.destroy();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Delete category error: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category'
        });
    }
};

export const initializeCategories = async (req, res) => {
    try {
        const existingCategories = await Category.count({
            where: { userId: req.user.id }
        });

        if (existingCategories > 0) {
            return res.status(400).json({
                success: false,
                message: 'Categories already initialized'
            });
        }

        const categoriesToCreate = defaultCategories.map(cat => ({
            ...cat,
            userId: req.user.id,
            isDefault: true
        }));

        const categories = await Category.bulkCreate(categoriesToCreate)

        res.status(201).json({
            success: true,
            message: 'Default categories initialized successfully',
            count: categories.length,
            data: categories
        });

    } catch (error) {
        console.error('Initialize categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize categories'
        });
    }
}
