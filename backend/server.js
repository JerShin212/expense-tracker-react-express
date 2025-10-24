import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './config/database.js';
import { initializeCronJobs } from './services/cronServices.js';
import testRoutes from './routes/test.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';
import settingsRoutes from './routes/settings.js';
import analyticsRoutes from './routes/analytics.js';
import exportRoutes from './routes/export.js';
import budgetRoutes from './routes/budgets.js';
import recurringRoutes from './routes/recurring.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/recurring', recurringRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Expense Tracker API',
        version: '1.0.0',
        endpoint: {
            test: '/api/test',
            health: '/api/health',
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me',
            logout: 'POST /api/auth/logout',
            categories: 'GET /api/categories',
            createCategory: 'POST /api/categories',
            initializeCategories: 'POST /api/categories/initialize',
            transactions: 'GET /api/transactions',
            transactionSummary: 'GET /api/transactions/summary',
            settings: 'GET /api/settings',
            currencies: 'GET /api/settings/currencies',
            analytics: 'GET /api/analytics/summary',
            export: 'GET /api/export/pdf',
            budgets: 'GET /api/budgets',
            recurring: 'GET /api/recurring'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const startServer = async () => {
    try {
        await testConnection();
        await sequelize.sync({ alter: false });
        console.log('Database synchronized successfully.');

        initializeCronJobs();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
