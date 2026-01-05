import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";  

const { DataTypes } = Sequelize;

const Transaction = db.define('transaction', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description_transaction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    type_transaction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    montant_transaction: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
     montant_total: {  // Nouveau champ pour montant_total
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        }
    },
    date_transaction: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
});

Users.hasMany(Transaction);
Transaction.belongsTo(Users, { foreignKey: 'userId' });


export default Transaction;
