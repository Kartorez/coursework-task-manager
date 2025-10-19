import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Token = sequelize.define(
  'Token',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
  }
);

Token.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Token, { foreignKey: 'userId' });

export default Token;
