import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction, getTransactionSummary } from '../controllers/transactionController.js';

const router = express.Router();

const transactionValidation = [
    body('categoryId')
        .notEmpty()
        .withMessage('Category is required')
        .isUUID()
        .withMessage('Invalid category ID'),
    body('amount')
        .notEmpty()
        .withMessage('Amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be greater than 0'),
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage('Description must be less than 255 characters'),
    body('date')
        .optional()
        .isDate()
        .withMessage('Date must be a valid date'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
];

router.use(protect);

router.get('/summary', getTransactionSummary);
router.get('/', getTransactions);
router.get('/:id', getTransaction);
router.post('/', transactionValidation, createTransaction);
router.put('/:id', transactionValidation, updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;