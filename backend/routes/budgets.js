import express from 'express';
import { protect } from '../middleware/auth.js';
import { getBudgets, getBudgetStatus, createBudget, updateBudget, deleteBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.use(protect);

// Budget routes
router.route('/')
    .get(getBudgets)
    .post(createBudget);

router.get('/status', getBudgetStatus);

router.route('/:id')
    .put(updateBudget)
    .delete(deleteBudget);

export default router;