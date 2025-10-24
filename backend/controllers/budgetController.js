import { Budget } from "../models/Budget.js";
import { Category } from "../models/Category.js";
import { Transaction } from "../models/Transaction.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";

export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'icon', 'color', 'type']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        req.json({
            success: true,
            data: budgets
        });
    } catch (error) {
        console.error('Get budgets error: ', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch budgets'
        })
    }
};

export const getBudgetStatus = async (req, res) => {
    try {
        const { period = 'monthly' } = req.query;

        // Get all budgets
        const budgets = await Budget.findAll({
            where: {
                userId: req.user.id,
                period
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'icon', 'color', 'type']
                }
            ]
        });

        // Calculate date range based on period
        const today = new Date();
        let startDate, endDate;

        if (period === 'monthly') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (period === 'yearly') {
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
        }

        // Get spending for each category
        const budgetStatus = await Promise.all(
            budgets.map(async (budget) => {
                const spent = await Transaction.sum('amount', {
                    where: {
                        userId: req.user.id,
                        categoryId: budget.categoryId,
                        type: 'expense',
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                });

                const spentAmount = parseFloat(spent) || 0;
                const budgetAmount = parseFloat(budget.amount);
                const percentage = (spentAmount / budgetAmount) * 100;
                const remaining = budgetAmount - spentAmount;

                // Determine status
                let status = 'safe'; // green
                if (percentage >= 100) {
                    status = 'exceeded'; // red
                } else if (percentage >= 70) {
                    status = 'warning'; // yellow
                }

                return {
                    id: budget.id,
                    category: budget.category,
                    budgetAmount,
                    spentAmount,
                    remaining,
                    percentage: Math.min(percentage, 100),
                    status,
                    period: budget.period
                };
            })
        );

        // Sort by percentage (highest first)
        budgetStatus.sort((a, b) => b.percentage - a.percentage);

        res.json({
            success: true,
            data: budgetStatus
        });
    } catch (error) {
        console.error('Get budget status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch budget status'
        });
    }
};

export const createBudget = async (req, res) => {
    try {
        const { categoryId, amount, period = 'monthly' } = req.body;

        // Validation
        if (!categoryId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Category and amount are required'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        // Check if category exists and belongs to user
        const category = await Category.findOne({
            where: {
                id: categoryId,
                userId: req.user.id
            }
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if budget already exists for this category
        const existingBudget = await Budget.findOne({
            where: {
                userId: req.user.id,
                categoryId,
                period
            }
        });

        if (existingBudget) {
            return res.status(400).json({
                success: false,
                message: 'Budget already exists for this category'
            });
        }

        // Create budget
        const budget = await Budget.create({
            userId: req.user.id,
            categoryId,
            amount,
            period,
            startDate: new Date()
        });

        // Fetch with category info
        const budgetWithCategory = await Budget.findByPk(budget.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'icon', 'color', 'type']
                }
            ]
        });

        res.status(201).json({
            success: true,
            data: budgetWithCategory
        });
    } catch (error) {
        console.error('Create budget error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create budget'
        });
    }
};

export const updateBudget = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, period } = req.body;

        // Find budget
        const budget = await Budget.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        // Validation
        if (amount !== undefined && amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        // Update budget
        if (amount !== undefined) budget.amount = amount;
        if (period !== undefined) budget.period = period;

        await budget.save();

        // Fetch with category info
        const updatedBudget = await Budget.findByPk(budget.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'icon', 'color', 'type']
                }
            ]
        });

        res.json({
            success: true,
            data: updatedBudget
        });
    } catch (error) {
        console.error('Update budget error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update budget'
        });
    }
};

export const deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;

        const budget = await Budget.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found'
            });
        }

        await budget.destroy();

        res.json({
            success: true,
            message: 'Budget deleted successfully'
        });
    } catch (error) {
        console.error('Delete budget error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete budget'
        });
    }
}