import User from './User.js';
import Task from './Task.js';
import Tag from './Tag.js';
import Column from './Column.js';
import TaskType from './TaskType.js';
import Team from './Team.js';
import TeamMember from './TeamMember.js';

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

Task.belongsTo(TaskType, { foreignKey: 'task_type_id', as: 'taskType' });
TaskType.hasMany(Task, { foreignKey: 'task_type_id', as: 'tasks' });

TaskType.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(TaskType, { foreignKey: 'user_id', as: 'taskTypes' });

Team.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(Team, { foreignKey: 'owner_id', as: 'ownedTeams' });

Team.belongsToMany(User, {
  through: TeamMember,
  as: 'members',
  foreignKey: 'team_id',
  otherKey: 'user_id',
});
User.belongsToMany(Team, {
  through: TeamMember,
  as: 'teams',
  foreignKey: 'user_id',
  otherKey: 'team_id',
});

export { User, Task, Tag, Column, TaskType, Team, TeamMember };
