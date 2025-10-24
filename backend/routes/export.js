import express from 'express';
import { protect } from '../middleware/auth.js';
import { exportPDF } from '../controllers/exportController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Export routes
router.get('/pdf', exportPDF);

export default router;
