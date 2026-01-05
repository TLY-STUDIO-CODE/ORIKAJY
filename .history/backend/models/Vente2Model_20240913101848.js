import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Stock from "./StockModel.js";
import Users from "./UserModel.js";  

const { DataTypes } = Sequelize;

const Vente2 = db.define('vente2', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    categories: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    qte: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    montant: {
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
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['kilo', 'litre', 'gramme', 'unité']] // Unités disponibles
        }
    },
    name_client: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    date_vente: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    num_factV:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    stockId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Stock.hasMany(Vente2);
Users.hasMany(Vente2);
Vente2.belongsTo(Stock, { foreignKey: 'stockId' });
Vente2.belongsTo(Users, { foreignKey: 'userId' });


export default Vente2;
