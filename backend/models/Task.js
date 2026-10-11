import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    column_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    task_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    start_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    end_time: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default Task;
