import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Journal from "./JournalModel.js";

const { DataTypes } = Sequelize;

const AccountingEntry = db.define('accounting_entry', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    validated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    journalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Journal.hasMany(AccountingEntry);
AccountingEntry.belongsTo(Journal, { foreignKey: 'journalId' });

export default AccountingEntry;
