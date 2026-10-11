import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TeamMember = sequelize.define(
  'TeamMember',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'member',
    },
  },
  {
    timestamps: true,
  }
);

export default TeamMember;
