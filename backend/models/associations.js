import Tag from './Tag.js';
import Task from './Task.js';
import User from './User.js';

Task.belongsTo(User, { as: 'creator', foreignKey: 'creatorId' });

Task.belongsToMany(Tag, { through: 'TaskTags', foreignKey: 'taskId' });
Tag.belongsToMany(Task, { through: 'TaskTags', foreignKey: 'tagId' });

Task.belongsToMany(User, {
  through: 'TaskAssignees',
  as: 'assignees',
  foreignKey: 'taskId',
});
User.belongsToMany(Task, {
  through: 'TaskAssignees',
  as: 'assignedTasks',
  foreignKey: 'userId',
});
