import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";  

const {DataTypes} = Sequelize;

const Stocks = db.define('stock',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    qte:{
        type: DataTypes.FLOAT,
        allowNull: false,
        validate:{
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
    montantS: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    montant_totalS: {  // Nouveau champ pour montant_total
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notEmpty: true
        }
    },
    categories:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    date_stock: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    num_fact:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }

},{
    freezeTableName: true
});

Users.hasMany(Stocks);
Stocks.belongsTo(Users, {foreignKey: 'userId'});

export default Stocks;