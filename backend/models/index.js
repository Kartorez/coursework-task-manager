import sequelize from '../config/db';
import Task from './Task.js';
import Tag from './Tag.js';
import User from './User.js';
import { setupAssociations } from './associations.js';

setupAssociations();

export { sequelize };
