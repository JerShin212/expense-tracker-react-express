import { User } from "./Users.js";
import { Category } from "./Category.js";

User.hasMany(Category, {
    foreignKey: 'userId',
    as: 'categories',
    onDelete: 'CASCADE'
});

Category.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
})

export { User, Category };