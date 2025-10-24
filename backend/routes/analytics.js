import express from 'express';
import { protect } from '../middleware/auth.js';
import { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentTransactions, getTopCategories, getDailyPattern, getComparison } from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Analytics routes
router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-trends', getMonthlyTrends);
router.get('/recent-transactions', getRecentTransactions);
router.get('/top-categories', getTopCategories);
router.get('/daily-pattern', getDailyPattern);
router.get('/comparison', getComparison);

export default router;