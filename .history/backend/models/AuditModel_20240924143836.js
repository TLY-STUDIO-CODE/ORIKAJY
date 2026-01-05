// backend/models/AuditModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js"; // Assurez-vous que le modèle User est importé correctement

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
        type: DataTypes.INTEGER, // Utiliser INTEGER si userId est un identifiant numérique
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

// Définir les relations
User.hasMany(Audit, { foreignKey: 'userId' });
Audit.belongsTo(User, { foreignKey: 'userId' });

export default Audit;


