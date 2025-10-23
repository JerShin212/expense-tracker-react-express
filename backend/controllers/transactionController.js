import { Transaction, Category } from "../models/index.js";
import { validationResult } from 'express-validator';
import { Op } from "sequelize";

export const getTransactions = async (req, res) => {
    try {
        const {
            type,
            categoryId,
            startDate,
            endDate,
            search,
            sortBy = 'date',
            order = 'DESC',
            page = 1,
            limit = 50
        } = req.query;

        // Build where clause
        const whereClause = { userId: req.user.id };

        // Filter by type
        if (type && (type === 'income' || type === 'expense')) {
            whereClause.type = type;
        }

        // Filter by category
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        // Filter by date range
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date[Op.gte] = startDate;
            }
            if (endDate) {
                whereClause.date[Op.lte] = endDate;
            }
        }

        // Search in description
        if (search) {
            whereClause.description = {
                [Op.iLike]: `%${search}%`
            };
        }

        // Calculate offset
        const offset = (page - 1) * limit;

        // Valid sort fields
        const validSortFields = ['date', 'amount', 'createdAt'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Get transactions with category info
        const { count, rows: transactions } = await Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'type', 'color', 'icon']
                }
            ],
            order: [[sortField, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            count: transactions.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: transactions
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions'
        });
    }
};

export const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'type', 'color', 'icon']
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction'
        });
    }
};

export const createTransaction = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { categoryId, amount, type, description, date, tags } = req.body;

        // Verify category exists and belongs to user
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

        // Verify type matches category type
        if (category.type !== type) {
            return res.status(400).json({
                success: false,
                message: `Category type (${category.type}) does not match transaction type (${type})`
            });
        }

        const transaction = await Transaction.create({
            userId: req.user.id,
            categoryId,
            amount,
            type,
            description,
            date: date || new Date(),
            tags: tags || []
        });

        // Fetch with category info
        const transactionWithCategory = await Transaction.findByPk(transaction.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'type', 'color', 'icon']
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transactionWithCategory
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create transaction'
        });
    }
};

export const updateTransaction = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        const { categoryId, amount, type, description, date, tags } = req.body;

        // If category is being changed, verify it exists and belongs to user
        if (categoryId && categoryId !== transaction.categoryId) {
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

            // Verify type matches category type
            const transactionType = type || transaction.type;
            if (category.type !== transactionType) {
                return res.status(400).json({
                    success: false,
                    message: `Category type (${category.type}) does not match transaction type (${transactionType})`
                });
            }
        }

        await transaction.update({
            categoryId: categoryId || transaction.categoryId,
            amount: amount || transaction.amount,
            type: type || transaction.type,
            description: description !== undefined ? description : transaction.description,
            date: date || transaction.date,
            tags: tags || transaction.tags
        });

        // Fetch updated transaction with category info
        const updatedTransaction = await Transaction.findByPk(transaction.id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'type', 'color', 'icon']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Transaction updated successfully',
            data: updatedTransaction
        });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update transaction'
        });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        await transaction.destroy();

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete transaction'
        });
    }
};

export const getTransactionSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = { userId: req.user.id };

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date[Op.gte] = startDate;
            }
            if (endDate) {
                whereClause.date[Op.lte] = endDate;
            }
        }

        const incomeResult = await Transaction.sum('amount', {
            where: { ...whereClause, type: 'expense' }
        });

        const expenseResult = await Transaction.sum('amount', {
            where: { ...whereClause, type: 'expense' }
        });

        const totalIncome = parseFloat(incomeResult) || 0;
        const totalExpense = parseFloat(expenseResult) || 0;
        const balance = totalIncome - totalExpense;

        const transactionCount = await Transaction.count({
            where: whereClause
        });

        res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                balance,
                transactionCount
            }
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch summary'
        });
    }
};
