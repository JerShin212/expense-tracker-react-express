import { User } from "./Users.js";
import { Category } from "./Category.js";
import { Transaction } from "./Transaction.js";
import { Budget } from "./Budget.js";
import { RecurringTransaction } from "./RecurringTransaction.js";

// User has many Categories
User.hasMany(Category, {
    foreignKey: 'userId',
    as: 'categories',
    onDelete: 'CASCADE'
});

Category.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// User has many Transactions
User.hasMany(Transaction, {
    foreignKey: 'userId',
    as: 'transactions',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Category has many Transactions
Category.hasMany(Transaction, {
    foreignKey: 'categoryId',
    as: 'transactions',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

// User has many Budgets
User.hasMany(Budget, {
    foreignKey: 'userId',
    as: 'budgets',
    onDelete: 'CASCADE'
});

Budget.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Category has many Budgets
Category.hasMany(Budget, {
    foreignKey: 'categoryId',
    as: 'budgets',
    onDelete: 'CASCADE'
});

Budget.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

// User has many RecurringTransactions
User.hasMany(RecurringTransaction, {
    foreignKey: 'userId',
    as: 'recurringTransactions',
    onDelete: 'CASCADE'
});

RecurringTransaction.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Category has many RecurringTransactions
Category.hasMany(RecurringTransaction, {
    foreignKey: 'categoryId',
    as: 'recurringTransactions',
    onDelete: 'CASCADE'
});

RecurringTransaction.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category'
});

export { User, Category, Transaction, Budget, RecurringTransaction };