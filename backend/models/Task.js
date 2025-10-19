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
    status: {
      type: DataTypes.ENUM('todo', 'in-progress', 'done'),
      defaultValue: 'todo',
    },
    role: {
      type: DataTypes.STRING(20),
      defaultValue: 'user',
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Task;
