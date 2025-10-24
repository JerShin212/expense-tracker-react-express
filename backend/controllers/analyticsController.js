import { Transaction } from "../models/Transaction.js";
import { Category } from "../models/Category.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";

export const getSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = { userId: req.user.id };

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

        // Get income total
        const totalIncome = await Transaction.sum('amount', {
            where: { ...whereClause, type: 'income' }
        }) || 0;

        // Get expense total
        const totalExpense = await Transaction.sum('amount', {
            where: { ...whereClause, type: 'expense' }
        }) || 0;

        // Calculate balance
        const balance = parseFloat(totalIncome) - parseFloat(totalExpense);

        // Get transaction count
        const transactionCount = await Transaction.count({
            where: whereClause
        });

        // Get income transaction count
        const incomeCount = await Transaction.count({
            where: { ...whereClause, type: 'income' }
        });

        // Get expense transaction count
        const expenseCount = await Transaction.count({
            where: { ...whereClause, type: 'expense' }
        });

        // Calculate average transaction amounts
        const avgIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;
        const avgExpense = expenseCount > 0 ? totalExpense / expenseCount : 0;

        res.status(200).json({
            success: true,
            data: {
                totalIncome: parseFloat(totalIncome).toFixed(2),
                totalExpense: parseFloat(totalExpense).toFixed(2),
                balance: balance.toFixed(2),
                transactionCount,
                incomeCount,
                expenseCount,
                avgIncome: avgIncome.toFixed(2),
                avgExpense: avgExpense.toFixed(2)
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

export const getCategoryBreakdown = async (req, res) => {
    try {
        const { startDate, endDate, type = 'expense' } = req.query;

        const whereClause = {
            userId: req.user.id,
            type: type === 'income' ? 'income' : 'expense'
        };

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

        // Get transactions grouped by category
        const breakdown = await Transaction.findAll({
            attributes: [
                'categoryId',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
                [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'count']
            ],
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'color', 'icon', 'type']
                }
            ],
            group: ['categoryId', 'category.id'],
            order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
        });

        // Calculate total for percentage
        const total = breakdown.reduce((sum, item) => {
            return sum + parseFloat(item.dataValues.total);
        }, 0);

        // Format data with percentages
        const formattedBreakdown = breakdown.map(item => ({
            categoryId: item.categoryId,
            categoryName: item.category.name,
            categoryColor: item.category.color,
            categoryIcon: item.category.icon,
            total: parseFloat(item.dataValues.total).toFixed(2),
            count: parseInt(item.dataValues.count),
            percentage: total > 0 ? ((parseFloat(item.dataValues.total) / total) * 100).toFixed(2) : 0
        }));

        res.status(200).json({
            success: true,
            data: {
                breakdown: formattedBreakdown,
                total: total.toFixed(2),
                type: type
            }
        });
    } catch (error) {
        console.error('Get category breakdown error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category breakdown'
        });
    }
};

export const getMonthlyTrends = async (req, res) => {
    try {
        const { months = 6 } = req.query;

        // Calculate date range (last N months)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(months));

        const whereClause = {
            userId: req.user.id,
            date: {
                [Op.gte]: startDate.toISOString().split('T')[0],
                [Op.lte]: endDate.toISOString().split('T')[0]
            }
        };

        // Get transactions grouped by month and type
        const trends = await Transaction.findAll({
            attributes: [
                [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('date')), 'month'],
                'type',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: whereClause,
            group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('date')), 'type'],
            order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('date')), 'ASC']]
        });

        // Format data by month
        const monthlyData = {};

        trends.forEach(item => {
            const month = new Date(item.dataValues.month).toISOString().slice(0, 7); // YYYY-MM format

            if (!monthlyData[month]) {
                monthlyData[month] = {
                    month,
                    income: 0,
                    expense: 0,
                    balance: 0,
                    incomeCount: 0,
                    expenseCount: 0
                };
            }

            if (item.type === 'income') {
                monthlyData[month].income = parseFloat(item.dataValues.total);
                monthlyData[month].incomeCount = parseInt(item.dataValues.count);
            } else {
                monthlyData[month].expense = parseFloat(item.dataValues.total);
                monthlyData[month].expenseCount = parseInt(item.dataValues.count);
            }
        });

        // Calculate balance for each month and format
        const formattedTrends = Object.values(monthlyData).map(month => ({
            ...month,
            balance: (month.income - month.expense).toFixed(2),
            income: month.income.toFixed(2),
            expense: month.expense.toFixed(2)
        }));

        // Fill in missing months with zero values
        const allMonths = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            const monthKey = current.toISOString().slice(0, 7);
            const existing = formattedTrends.find(m => m.month === monthKey);

            if (existing) {
                allMonths.push(existing);
            } else {
                allMonths.push({
                    month: monthKey,
                    income: '0.00',
                    expense: '0.00',
                    balance: '0.00',
                    incomeCount: 0,
                    expenseCount: 0
                });
            }

            current.setMonth(current.getMonth() + 1);
        }

        res.status(200).json({
            success: true,
            data: allMonths
        });
    } catch (error) {
        console.error('Get monthly trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly trends'
        });
    }
};

export const getRecentTransactions = async (req, res) => {
    try {
        const { limit = 5 } = req.query;

        const transactions = await Transaction.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'color', 'icon', 'type']
                }
            ],
            order: [['date', 'DESC'], ['createdAt', 'DESC']],
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        console.error('Get recent transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent transactions'
        });
    }
};

export const getTopCategories = async (req, res) => {
    try {
        const { limit = 5, type = 'expense', startDate, endDate } = req.query;

        const whereClause = {
            userId: req.user.id,
            type: type === 'income' ? 'income' : 'expense'
        };

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

        const topCategories = await Transaction.findAll({
            attributes: [
                'categoryId',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
                [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'count']
            ],
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'color', 'icon', 'type']
                }
            ],
            group: ['categoryId', 'category.id'],
            order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
            limit: parseInt(limit)
        });

        const formattedCategories = topCategories.map(item => ({
            categoryId: item.categoryId,
            categoryName: item.category.name,
            categoryColor: item.category.color,
            categoryIcon: item.category.icon,
            total: parseFloat(item.dataValues.total).toFixed(2),
            count: parseInt(item.dataValues.count)
        }));

        res.status(200).json({
            success: true,
            data: formattedCategories
        });
    } catch (error) {
        console.error('Get top categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top categories'
        });
    }
};

export const getDailyPattern = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const whereClause = { userId: req.user.id };

        // Default to last 30 days if no range specified
        if (!startDate && !endDate) {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            whereClause.date = {
                [Op.gte]: thirtyDaysAgo.toISOString().split('T')[0]
            };
        } else if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date[Op.gte] = startDate;
            }
            if (endDate) {
                whereClause.date[Op.lte] = endDate;
            }
        }

        // Get transactions grouped by date
        const dailyData = await Transaction.findAll({
            attributes: [
                'date',
                'type',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: whereClause,
            group: ['date', 'type'],
            order: [['date', 'ASC']]
        });

        // Format data by date
        const dailyMap = {};

        dailyData.forEach(item => {
            const date = item.date;

            if (!dailyMap[date]) {
                dailyMap[date] = {
                    date,
                    income: 0,
                    expense: 0,
                    balance: 0
                };
            }

            if (item.type === 'income') {
                dailyMap[date].income = parseFloat(item.dataValues.total);
            } else {
                dailyMap[date].expense = parseFloat(item.dataValues.total);
            }
        });

        // Calculate balance and format
        const formattedDaily = Object.values(dailyMap).map(day => ({
            ...day,
            balance: (day.income - day.expense).toFixed(2),
            income: day.income.toFixed(2),
            expense: day.expense.toFixed(2)
        }));

        res.status(200).json({
            success: true,
            data: formattedDaily
        });
    } catch (error) {
        console.error('Get daily pattern error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch daily pattern'
        });
    }
};

export const getComparison = async (req, res) => {
    try {
        const { period = 'month' } = req.query; // 'week', 'month', 'year'

        // Calculate date ranges
        const now = new Date();
        let currentStart, currentEnd, previousStart, previousEnd;

        if (period === 'week') {
            currentEnd = new Date(now);
            currentStart = new Date(now);
            currentStart.setDate(currentStart.getDate() - 7);

            previousEnd = new Date(currentStart);
            previousStart = new Date(currentStart);
            previousStart.setDate(previousStart.getDate() - 7);
        } else if (period === 'month') {
            currentEnd = new Date(now);
            currentStart = new Date(now);
            currentStart.setMonth(currentStart.getMonth() - 1);

            previousEnd = new Date(currentStart);
            previousStart = new Date(currentStart);
            previousStart.setMonth(previousStart.getMonth() - 1);
        } else { // year
            currentEnd = new Date(now);
            currentStart = new Date(now);
            currentStart.setFullYear(currentStart.getFullYear() - 1);

            previousEnd = new Date(currentStart);
            previousStart = new Date(currentStart);
            previousStart.setFullYear(previousStart.getFullYear() - 1);
        }

        // Get current period data
        const currentIncome = await Transaction.sum('amount', {
            where: {
                userId: req.user.id,
                type: 'income',
                date: {
                    [Op.gte]: currentStart.toISOString().split('T')[0],
                    [Op.lte]: currentEnd.toISOString().split('T')[0]
                }
            }
        }) || 0;

        const currentExpense = await Transaction.sum('amount', {
            where: {
                userId: req.user.id,
                type: 'expense',
                date: {
                    [Op.gte]: currentStart.toISOString().split('T')[0],
                    [Op.lte]: currentEnd.toISOString().split('T')[0]
                }
            }
        }) || 0;

        // Get previous period data
        const previousIncome = await Transaction.sum('amount', {
            where: {
                userId: req.user.id,
                type: 'income',
                date: {
                    [Op.gte]: previousStart.toISOString().split('T')[0],
                    [Op.lte]: previousEnd.toISOString().split('T')[0]
                }
            }
        }) || 0;

        const previousExpense = await Transaction.sum('amount', {
            where: {
                userId: req.user.id,
                type: 'expense',
                date: {
                    [Op.gte]: previousStart.toISOString().split('T')[0],
                    [Op.lte]: previousEnd.toISOString().split('T')[0]
                }
            }
        }) || 0;

        // Calculate changes
        const incomeChange = previousIncome > 0
            ? ((currentIncome - previousIncome) / previousIncome * 100).toFixed(2)
            : currentIncome > 0 ? 100 : 0;

        const expenseChange = previousExpense > 0
            ? ((currentExpense - previousExpense) / previousExpense * 100).toFixed(2)
            : currentExpense > 0 ? 100 : 0;

        res.status(200).json({
            success: true,
            data: {
                period,
                current: {
                    income: parseFloat(currentIncome).toFixed(2),
                    expense: parseFloat(currentExpense).toFixed(2),
                    balance: (currentIncome - currentExpense).toFixed(2)
                },
                previous: {
                    income: parseFloat(previousIncome).toFixed(2),
                    expense: parseFloat(previousExpense).toFixed(2),
                    balance: (previousIncome - previousExpense).toFixed(2)
                },
                change: {
                    income: parseFloat(incomeChange),
                    expense: parseFloat(expenseChange)
                }
            }
        });
    } catch (error) {
        console.error('Get comparison error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comparison data'
        });
    }
}