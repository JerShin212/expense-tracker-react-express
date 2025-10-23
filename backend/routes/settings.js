import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { getSettings, updateSettings, getCurrencies } from '../controllers/settingsController.js';

const router = express.Router();

const settingsValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must be less than 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must be less than 50 characters'),
  body('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency code must be 3 characters')
];

// All routes require authentication
router.use(protect);

// Routes
router.get('/currencies', getCurrencies);
router.get('/', getSettings);
router.put('/', settingsValidation, updateSettings);

export default router;