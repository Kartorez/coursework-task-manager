import Task from '../models/Task.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import ApiError from '../error/ApiError.js';
import { Op } from 'sequelize';

class TaskController {
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;

      const tasks = await Task.findAll({
        include: [
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
        ],
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
      const { title, description, tags = [], assignees = [] } = req.body;

      if (!title) return next(ApiError.badRequest('Title is required'));

      const task = await Task.create({
        title,
        description,
        creator_id: req.user.id,
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
        include: [
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
        ],
      });

      res.status(201).json(created);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, tags = [], assignees = [] } = req.body;

      const task = await Task.findByPk(id, {
        include: ['tags', 'assignees'],
      });
      if (!task) return next(ApiError.notFound('Task not found'));
      if (task.creator_id !== req.user.id)
        return next(ApiError.forbidden('Only creator can edit'));

      await task.update({
        title: title ?? task.title,
        description: description ?? task.description,
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
        include: [
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
        ],
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

  async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['todo', 'in-progress', 'done'].includes(status))
        return next(ApiError.badRequest('Invalid status'));

      const task = await Task.findByPk(id, {
        include: [{ model: User, as: 'assignees', attributes: ['id'] }],
      });
      if (!task) return next(ApiError.notFound('Task not found'));

      const userId = req.user.id;
      const isCreator = task.creator_id === userId;
      const isAssignee = task.assignees.some((a) => a.id === userId);
      if (!isCreator && !isAssignee)
        return next(ApiError.forbidden('You cannot change status'));

      await task.update({ status });
      res.json(task);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new TaskController();
