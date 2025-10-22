import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { register, login, getMe, logout } from '../controllers/authController.js';

const router = express.Router();

const registerValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').optional().trim(),
    body('lastName').optional().trim()
];

const loginValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
