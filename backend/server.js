import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, testConnection } from './config/database.js';
import testRoutes from './routes/test.js';
import authRoutes from './routes/auth.js';
import { register } from './controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);

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
            logout: 'POST /api/auth/logout'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
});

const startServer = async () => {
    try {
        await testConnection();
        await sequelize.sync({ alter: false });
        console.log('Database synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
