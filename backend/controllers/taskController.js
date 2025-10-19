import Task from '../models/Task.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import ApiError from '../error/ApiError.js';
import sequelize from '../config/db.js';

class TaskController {
  async getAll(req, res, next) {
    try {
      const { assignedUser, tag, status } = req.query;
      const where = {};
      if (status) {
        where.status = status;
      }

      const include = [
        { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
        { model: Tag, through: { attributes: [] } },
        {
          model: User,
          as: 'assignees',
          attributes: ['id', 'username'],
          through: { attributes: [] },
        },
      ];

      const query = { where, include };

      if (tag) {
        query.include = include.map((i) => i);
        query.include[1].where = { name: tag };
      }

      if (assignedUser) {
        query.include = query.include || include;
        query.include = query.include.map((i) => i);
        query.include.find((i) => i.as === 'assignees').where = {
          id: assignedUser,
        };
      }

      const tasks = await Task.findAll(query);
      res.json(tasks);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username', 'email'],
          },
          { model: Tag, through: { attributes: [] } },
          {
            model: User,
            as: 'assignees',
            attributes: ['id', 'username'],
            through: { attributes: [] },
          },
        ],
      });
      if (!task) {
        return next(ApiError.notFound('Task not found'));
      }
      res.json(task);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async create(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, description, tagNames = [], assigneeIds = [] } = req.body;
      if (!title) {
        return next(ApiError.badRequest('Title required'));
      }

      const task = await Task.create(
        { title, description, creatorId: req.user.id },
        { transaction: t }
      );

      if (Array.isArray(tagNames) && tagNames.length) {
        const tags = [];
        for (const name of tagNames) {
          const [tag] = await Tag.findOrCreate({
            where: { name },
            transaction: t,
          });
          tags.push(tag);
        }
        await task.setTags(tags, { transaction: t });
      }

      if (Array.isArray(assigneeIds) && assigneeIds.length) {
        const users = await User.findAll({
          where: { id: assigneeIds },
          transaction: t,
        });
        await task.addAssignees(users, { transaction: t });
      }

      await t.commit();
      const created = await Task.findByPk(task.id, {
        include: [
          { model: Tag, through: { attributes: [] } },
          { model: User, as: 'assignees', through: { attributes: [] } },
        ],
      });
      res.status(201).json(created);
    } catch (e) {
      await t.rollback();
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { title, description, tagNames, assigneeIds } = req.body;

      const task = await Task.findByPk(id, { transaction: t });
      if (!task) {
        return next(ApiError.notFound('Task not found'));
      }
      if (task.creatorId !== req.user.id && req.user.role !== 'creator') {
        return next(ApiError.forbidden('Only creator  can edit'));
      }

      await task.update(
        {
          title: title ?? task.title,
          description: description ?? task.description,
        },
        { transaction: t }
      );

      if (Array.isArray(tagNames)) {
        const tags = [];
        for (const name of tagNames) {
          const [tag] = await Tag.findOrCreate({
            where: { name },
            transaction: t,
          });
          tags.push(tag);
        }
        await task.setTags(tags, { transaction: t });
      }

      if (Array.isArray(assigneeIds)) {
        const users = await User.findAll({
          where: { id: assigneeIds },
          transaction: t,
        });
        await task.setAssignees(users, { transaction: t });
      }

      await t.commit();
      const updated = await Task.findByPk(id, {
        include: [
          { model: Tag, through: { attributes: [] } },
          { model: User, as: 'assignees', through: { attributes: [] } },
        ],
      });
      res.json(updated);
    } catch (e) {
      await t.rollback();
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);
      if (!task) {
        return next(ApiError.notFound('Task not found'));
      }
      if (task.creatorId !== req.user.id && req.user.role !== 'admin') {
        return next(ApiError.forbidden('Only creator or admin can delete'));
      }
      await task.destroy();
      res.json({ message: 'Task deleted' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async changeStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['todo', 'in-progress', 'done'].includes(status)) {
        return next(ApiError.badRequest('Invalid status'));
      }

      const task = await Task.findByPk(id, {
        include: [
          { model: User, as: 'assignees', through: { attributes: [] } },
        ],
      });
      if (!task) {
        return next(ApiError.notFound('Task not found'));
      }

      const isAssignee =
        task.assignees.some((a) => a.id === req.user.id) ||
        req.user.role === 'creator';
      if (!isAssignee) {
        return next(ApiError.forbidden('Only assignee can change status'));
      }

      task.status = status;
      await task.save();
      res.json(task);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async setAssignees(req, res, next) {
    try {
      const { id } = req.params;
      const { assigneeIds = [] } = req.body;
      const task = await Task.findByPk(id);
      if (!task) {
        return next(ApiError.notFound('Task not found'));
      }
      if (task.creatorId !== req.user.id && req.user.role !== 'creator') {
        return next(
          ApiError.forbidden('Only creator or creator can change assignees')
        );
      }

      const users = await User.findAll({ where: { id: assigneeIds } });
      await task.setAssignees(users);
      const updated = await Task.findByPk(id, {
        include: [
          { model: User, as: 'assignees', through: { attributes: [] } },
        ],
      });
      res.json(updated);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new TaskController();
