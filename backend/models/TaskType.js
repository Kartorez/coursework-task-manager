import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const TaskType = sequelize.define(
  'TaskType',
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
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '#3b82f6',
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

export default TaskType;
