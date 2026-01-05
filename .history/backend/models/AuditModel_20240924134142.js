// backend/models/AuditModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Audit = db.define('audit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    freezeTableName: true,
});
// Définir la relation entre Audit et User
Audit.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Audit;
