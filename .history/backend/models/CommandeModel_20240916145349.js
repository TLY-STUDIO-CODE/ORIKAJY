import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Stock from "./StockModel.js";
import Users from "./UserModel.js";  

const { DataTypes } = Sequelize;

const Commande = db.define('commande', {
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
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    montantC: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    montant_totalC: {  // Nouveau champ pour montant_total
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
    date_commande: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    num_factC:{
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

Stock.hasMany(Commande);
Users.hasMany(Commande);
Commande.belongsTo(Stock, { foreignKey: 'stockId' });
Commande.belongsTo(Users, { foreignKey: 'userId' });


export default Commande;