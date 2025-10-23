import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
        onDelete: 'RESTRICT' // Prevent deleting category if it has transactions
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0.01],
                msg: 'Amount must be greater than 0'
            },
            isDecimal: {
                msg: 'Amount must be a valid number'
            }
        }
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['income', 'expense']],
                msg: 'Type must be either income or expense'
            }
        }
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: {
                msg: 'Date must be a valid date'
            }
        }
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: 'transactions',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['categoryId']
        },
        {
            fields: ['type']
        },
        {
            fields: ['date']
        },
        {
            fields: ['userId', 'date']
        }
    ]
});