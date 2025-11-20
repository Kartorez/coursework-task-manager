import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Token = sequelize.define(
  'Token',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'Tokens',
    timestamps: false,
  }
);

Token.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Token, { foreignKey: 'user_id', as: 'token' });

export default Token;
