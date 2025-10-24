import { RecurringTransaction } from "../models/RecurringTransaction.js";
import { Category } from "../models/Category.js";
import { Transaction } from "../models/Transaction.js";
import { Op } from "sequelize";

// Helper function to calculate next date based on frequency
function calculateNextDate(currentDate, frequency) {
    const date = new Date(currentDate);

    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date.toISOString().split('T')[0];
};

export const getRecurringTransactions = async (req, res) => {
    try {
        const recurringTransactions = await RecurringTransaction.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'icon', 'color', 'type']
                }
            ],
            order: [['nextDate', 'ASC']]
        });

        res.json({
            success: true,
            data: recurringTransactions
        });
    } catch (error) {
        console.error('Get recurring transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recurring transactions'
        });
    }
};

export const getUpcomingRecurring = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + parseInt(days));

        const recurringTransactions = await RecurringTransaction.findAll({
            where: {
                userId: req.user.id,
                isActive: true,
                nextDate: {
                    [Op.between]: [today.toISOString().split('T')[0], futureDate.toISOString().split('T')[0]]
                }
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'icon', 'color', 'type']
                }
            ],
            order: [['nextDate', 'ASC']]
        });

        res.json({
            success: true,
            data: recurringTransactions
        });
    } catch (error) {
        console.error('Get upcoming recurring error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming recurring transactions'
        });
    }
};

export const createRecurringTransaction = async (req, res) => {
    try {
        const { categoryId, type, amount, description, frequency, startDate, endDate } = req.body;

        // Validation
        if (!categoryId || !type || !amount || !description || !frequency || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than 0'
            });
        }

        // Check if category exists
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

        // Validate type matches category
        if (category.type !== type) {
            return res.status(400).json({
                success: false,
                message: `Category type (${category.type}) does not match transaction type (${type})`
            });
        }

        // Calculate initial nextDate
        const nextDate = startDate;

        // Create recurring transaction
        const recurringTransaction = await RecurringTransaction.create({
            userId: req.user.id,
            categoryId,
            type,
            amount,
            description,
            frequency,
            startDate,
            endDate: endDate || null,
            nextDate,
            isActive: true
        });

        // Fetch with category info
        const recurringWithCategory = await RecurringTransaction.findByPk(recurringTransaction.id, {
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
            data: recurringWithCategory
        });
    } catch (error) {
        console.error('Create recurring transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create recurring transaction'
        });
    }
};

export const updateRecurringTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, frequency, startDate, endDate, isActive } = req.body;

        const recurringTransaction = await RecurringTransaction.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!recurringTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Recurring transaction not found'
            });
        }

        // Update fields
        if (amount !== undefined) {
            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Amount must be greater than 0'
                });
            }
            recurringTransaction.amount = amount;
        }

        if (description !== undefined) recurringTransaction.description = description;
        if (frequency !== undefined) {
            recurringTransaction.frequency = frequency;
            // Recalculate nextDate based on new frequency
            recurringTransaction.nextDate = calculateNextDate(recurringTransaction.nextDate, frequency);
        }
        if (startDate !== undefined) recurringTransaction.startDate = startDate;
        if (endDate !== undefined) recurringTransaction.endDate = endDate;
        if (isActive !== undefined) recurringTransaction.isActive = isActive;

        await recurringTransaction.save();

        // Fetch with category info
        const updatedRecurring = await RecurringTransaction.findByPk(recurringTransaction.id, {
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
            data: updatedRecurring
        });
    } catch (error) {
        console.error('Update recurring transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update recurring transaction'
        });
    }
};

export const deleteRecurringTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const recurringTransaction = await RecurringTransaction.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!recurringTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Recurring transaction not found'
            });
        }

        await recurringTransaction.destroy();

        res.json({
            success: true,
            message: 'Recurring transaction deleted successfully'
        });
    } catch (error) {
        console.error('Delete recurring transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete recurring transaction'
        });
    }
};

export const generateRecurringTransactions = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find all active recurring transactions that are due
        const dueRecurring = await RecurringTransaction.findAll({
            where: {
                userId: req.user.id,
                isActive: true,
                nextDate: {
                    [Op.lte]: today
                },
                [Op.or]: [
                    { endDate: null },
                    { endDate: { [Op.gte]: today } }
                ]
            }
        });

        const generatedTransactions = [];
        const errors = [];

        for (const recurring of dueRecurring) {
            try {
                // Create the transaction
                const transaction = await Transaction.create({
                    userId: recurring.userId,
                    categoryId: recurring.categoryId,
                    type: recurring.type,
                    amount: recurring.amount,
                    description: `${recurring.description} (Auto-generated)`,
                    date: recurring.nextDate
                });

                generatedTransactions.push(transaction);

                // Update recurring transaction
                recurring.lastGenerated = recurring.nextDate;
                recurring.nextDate = calculateNextDate(recurring.nextDate, recurring.frequency);

                // Check if we've passed the end date
                if (recurring.endDate && recurring.nextDate > recurring.endDate) {
                    recurring.isActive = false;
                }

                await recurring.save();
            } catch (err) {
                console.error(`Error generating transaction for recurring ${recurring.id}:`, err);
                errors.push({
                    recurringId: recurring.id,
                    error: err.message
                });
            }
        }

        res.json({
            success: true,
            message: `Generated ${generatedTransactions.length} transactions`,
            data: {
                generated: generatedTransactions.length,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    } catch (error) {
        console.error('Generate recurring transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate recurring transactions'
        });
    }
};

export const generateSingleRecurring = async (req, res) => {
    try {
        const { id } = req.params;

        const recurring = await RecurringTransaction.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!recurring) {
            return res.status(404).json({
                success: false,
                message: 'Recurring transaction not found'
            });
        }

        if (!recurring.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Recurring transaction is not active'
            });
        }

        // Create the transaction
        const transaction = await Transaction.create({
            userId: recurring.userId,
            categoryId: recurring.categoryId,
            type: recurring.type,
            amount: recurring.amount,
            description: `${recurring.description} (Manual generation)`,
            date: new Date().toISOString().split('T')[0]
        });

        // Update recurring transaction
        recurring.lastGenerated = new Date().toISOString().split('T')[0];
        recurring.nextDate = calculateNextDate(new Date().toISOString().split('T')[0], recurring.frequency);

        // Check if we've passed the end date
        if (recurring.endDate && recurring.nextDate > recurring.endDate) {
            recurring.isActive = false;
        }

        await recurring.save();

        res.json({
            success: true,
            message: 'Transaction generated successfully',
            data: transaction
        });
    } catch (error) {
        console.error('Generate single recurring error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate transaction'
        });
    }
}