import Task from '../models/Task.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import TaskType from '../models/TaskType.js';
import ApiError from '../error/ApiError.js';
import { Op } from 'sequelize';

const taskIncludes = [
  { model: User, as: 'creator', attributes: ['id', 'username'] },
  {
    model: Tag,
    as: 'tags',
    attributes: ['id', 'name'],
    through: { attributes: [] },
  },
  {
    model: User,
    as: 'assignees',
    attributes: ['id', 'username'],
    through: { attributes: [] },
  },
  {
    model: TaskType,
    as: 'taskType',
    attributes: ['id', 'name', 'color'],
  },
];

class TaskController {
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;

      const tasks = await Task.findAll({
        include: taskIncludes,
        order: [['id', 'DESC']],
      });

      const visibleTasks = tasks.filter(
        (task) =>
          Number(task.creator_id) === Number(userId) ||
          (task.assignees &&
            task.assignees.some((a) => a.id === Number(userId)))
      );

      res.json(visibleTasks);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const {
        title,
        description,
        tags = [],
        assignees = [],
        column_id,
        task_type_id,
        date,
        start_time,
        end_time,
        duration,
      } = req.body;

      if (!title) return next(ApiError.badRequest('Title is required'));

      const task = await Task.create({
        title,
        description,
        creator_id: req.user.id,
        column_id: column_id ?? null,
        task_type_id: task_type_id ?? null,
        date: date ?? null,
        start_time: start_time ?? null,
        end_time: end_time ?? null,
        duration: duration ?? null,
      });

      if (tags.length) {
        const tagInstances = await Promise.all(
          tags.map(async (t) => {
            if (Number.isInteger(t)) return Tag.findByPk(t);
            const [tag] = await Tag.findOrCreate({ where: { name: t } });
            return tag;
          })
        );
        await task.setTags(tagInstances.filter(Boolean));
      }

      if (assignees.length) {
        const users = await User.findAll({
          where: {
            [Op.or]: [
              { id: assignees.filter((a) => Number.isInteger(a)) },
              { username: assignees.filter((a) => typeof a === 'string') },
            ],
          },
        });
        await task.setAssignees(users);
      }

      const created = await Task.findByPk(task.id, {
        include: taskIncludes,
      });

      res.status(201).json(created);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        tags = [],
        assignees = [],
        column_id,
        task_type_id,
        date,
        start_time,
        end_time,
        duration,
      } = req.body;

      const task = await Task.findByPk(id, {
        include: ['tags', 'assignees'],
      });
      if (!task) return next(ApiError.notFound('Task not found'));
      if (task.creator_id !== req.user.id)
        return next(ApiError.forbidden('Only creator can edit'));

      await task.update({
        title: title ?? task.title,
        description: description ?? task.description,
        column_id: column_id !== undefined ? column_id : task.column_id,
        task_type_id: task_type_id !== undefined ? task_type_id : task.task_type_id,
        date: date !== undefined ? date : task.date,
        start_time: start_time !== undefined ? start_time : task.start_time,
        end_time: end_time !== undefined ? end_time : task.end_time,
        duration: duration !== undefined ? duration : task.duration,
      });

      if (Array.isArray(tags)) {
        const tagInstances = await Promise.all(
          tags.map(async (t) => {
            if (Number.isInteger(t)) return Tag.findByPk(t);
            const [tag] = await Tag.findOrCreate({ where: { name: t } });
            return tag;
          })
        );
        await task.setTags(tagInstances.filter(Boolean));
      }

      if (Array.isArray(assignees)) {
        const users = await User.findAll({
          where: {
            [Op.or]: [
              { id: assignees.filter((a) => Number.isInteger(a)) },
              { username: assignees.filter((a) => typeof a === 'string') },
            ],
          },
        });
        await task.setAssignees(users);
      }

      const updated = await Task.findByPk(id, {
        include: taskIncludes,
      });

      res.json(updated);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) return next(ApiError.notFound('Task not found'));
      if (task.creator_id !== req.user.id)
        return next(ApiError.forbidden('Only creator can delete'));

      await task.destroy();
      res.json({ message: 'Task deleted successfully' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async changeColumn(req, res, next) {
    try {
      const { id } = req.params;
      const { column_id } = req.body;

      const task = await Task.findByPk(id);
      if (!task) return next(ApiError.notFound('Task not found'));

      await task.update({ column_id });
      res.json(task);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async changeStatus(req, res, next) {
    return this.changeColumn(req, res, next);
  }
}

export default new TaskController();
