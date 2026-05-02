import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Column = sequelize.define(
  'Column',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(7),
      defaultValue: '#6366f1',
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Column;
