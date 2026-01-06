import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Events = db.define('event', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    start: {
        type: DataTypes.DATEONLY, // Use DATEONLY to store only the date
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set to the current date
        validate: {
            notEmpty: true,
            isDate: true, // Ensure it's a valid date
        }
    },
    end: {
        type: DataTypes.DATEONLY, // Use DATEONLY to store only the date
        allowNull: true,
        defaultValue: null, // Default value if not provided
        validate: {
            isDate: true, // Ensure it's a valid date
        }
    },
    allDay: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

Users.hasMany(Events);
Events.belongsTo(Users, { foreignKey: 'userId' });

export default Events;
