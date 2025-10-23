import { User } from "./Users.js";
import { Category } from "./Category.js";
import { Transaction } from "./Transaction.js";

// User associations
User.hasMany(Category, {
    foreignKey: 'userId',
    as: 'categories',
    onDelete: 'CASCADE'
});

User.hasMany(Transaction, {
    foreignKey: 'userId',
    as: 'transactions',
    onDelete: 'CASCADE'
});

// Category associations
Category.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Category.hasMany(Transaction, {
    foreignKey: 'categoryId',
    as: 'transactions',
    onDelete: 'RESTRICT'
});

// Transaction associations
Transaction.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Transaction.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

export { User, Category, Transaction };