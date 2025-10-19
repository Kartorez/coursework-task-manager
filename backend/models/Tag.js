import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Tag = sequelize.define(
  'Tag',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    timestamp: false,
  }
);

export default Tag;
