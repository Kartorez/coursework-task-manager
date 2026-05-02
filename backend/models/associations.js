import User from './User.js';
import Task from './Task.js';
import Tag from './Tag.js';
import Column from './Column.js';

Task.belongsTo(User, {
  as: 'creator',
  foreignKey: 'creator_id',
});

User.hasMany(Task, {
  as: 'createdTasks',
  foreignKey: 'creator_id',
});

Task.belongsToMany(User, {
  through: { model: 'TaskAssignees', timestamps: false },
  as: 'assignees',
  foreignKey: 'task_id',
  otherKey: 'user_id',
});

User.belongsToMany(Task, {
  through: { model: 'TaskAssignees', timestamps: false },
  as: 'assignedTasks',
  foreignKey: 'user_id',
  otherKey: 'task_id',
});

Task.belongsToMany(Tag, {
  through: { model: 'TaskTags', timestamps: false },
  as: 'tags',
  foreignKey: 'task_id',
  otherKey: 'tag_id',
});

Tag.belongsToMany(Task, {
  through: { model: 'TaskTags', timestamps: false },
  as: 'tasks',
  foreignKey: 'tag_id',
  otherKey: 'task_id',
});

Column.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
User.hasMany(Column, { foreignKey: 'user_id', as: 'columns' });

Task.belongsTo(Column, { foreignKey: 'column_id', as: 'column' });
Column.hasMany(Task, { foreignKey: 'column_id', as: 'tasks' });

export { User, Task, Tag, Column };
