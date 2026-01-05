import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Event = db.define('events', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  allDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  freezeTableName: true
});

export default Event;
