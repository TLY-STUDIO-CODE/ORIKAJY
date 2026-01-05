import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Assurez-vous que vous avez la configuration correcte
import User from './UserModel.js'; // Importer le modèle User si vous souhaitez établir une relation

const Audit = sequelize.define('Audit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    freezeTableName: true
});

// Associer le modèle Audit au modèle User, si vous le souhaitez
Audit.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Audit, { foreignKey: 'userId', as: 'audits' });

export default Audit;

