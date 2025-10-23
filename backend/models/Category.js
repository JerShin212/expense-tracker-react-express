import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Category = sequelize.define('Category', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Category name is required'
            },
            len: {
                args: [1, 50],
                msg: 'Category name must be between 1 and 50 characters'
            }
        }
    },
    type: {
        type: DataTypes.ENUM('expense', 'income'),
        allowNull: false,
        defaultValue: 'expense',
        validate: {
            isIn: {
                args: [['expense', 'income']],
                msg: 'type must be either expense or income'
            }
        }
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#6366f1',
        validate: {
            is: {
                args: /^#[0-9A-F]{6}$/i,
                msg: 'Color must be a valid hex code'
            }
        }
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'categories',
    timestamps: true,
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['type']
        }
    ]
})