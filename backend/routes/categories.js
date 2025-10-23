import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory, initializeCategories } from '../controllers/categoryController.js';

const router = express.Router();

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Category name must be between 1 and 50 characters'),
    body('type')
        .isIn(['expense', 'income'])
        .withMessage('Type must be either expense or income'),
    body('color')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Color must be a valid hex code'),
    body('icon')
        .optional()
        .trim()
];

router.use(protect);

router.post('/initialize', initializeCategories);
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', categoryValidation, createCategory);
router.put('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

export default router