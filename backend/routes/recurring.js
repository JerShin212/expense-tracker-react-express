import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { getRecurringTransactions, getUpcomingRecurring, createRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction, generateRecurringTransactions, generateSingleRecurring } from '../controllers/recurringTransactionController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Recurring transaction routes
router.route('/')
    .get(getRecurringTransactions)
    .post(createRecurringTransaction);

router.get('/upcoming', getUpcomingRecurring);
router.post('/generate', generateRecurringTransactions);
router.post('/:id/generate', generateSingleRecurring);

router.route('/:id')
    .put(updateRecurringTransaction)
    .delete(deleteRecurringTransaction);

export default router;