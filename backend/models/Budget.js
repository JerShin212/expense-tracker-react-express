import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Budget = sequelize.define('Budget', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    period: {
        type: DataTypes.ENUM('monthly', 'yearly'),
        defaultValue: 'monthly'
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'budgets',
    timestamps: true
});
