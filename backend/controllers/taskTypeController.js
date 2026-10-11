import TaskType from '../models/TaskType.js';
import ApiError from '../error/ApiError.js';
import { Op } from 'sequelize';

const DEFAULT_TYPES = [
  { name: 'Фокус', color: '#2563eb' },
  { name: 'Зустрічі', color: '#ea580c' },
  { name: 'Особисте', color: '#16a34a' },
];

class TaskTypeController {
  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      let types = await TaskType.findAll({
        where: {
          [Op.or]: [{ user_id: userId }, { user_id: null }],
        },
        order: [['id', 'ASC']],
      });

      if (types.length === 0) {
        types = await Promise.all(
          DEFAULT_TYPES.map((dt) =>
            TaskType.create({
              name: dt.name,
              color: dt.color,
              user_id: userId,
            })
          )
        );
      }

      res.json(types);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async create(req, res, next) {
    try {
      const { name, color } = req.body;
      if (!name) return next(ApiError.badRequest('Назва обов’язкова'));

      const type = await TaskType.create({
        name: name.trim(),
        color: color || '#3b82f6',
        user_id: req.user.id,
      });

      res.status(201).json(type);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;

      const type = await TaskType.findByPk(id);
      if (!type) return next(ApiError.notFound('Тип не знайдено'));

      if (name) type.name = name.trim();
      if (color) type.color = color;
      await type.save();

      res.json(type);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const type = await TaskType.findByPk(id);
      if (!type) return next(ApiError.notFound('Тип не знайдено'));

      await type.destroy();
      res.json({ message: 'Тип видалено' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new TaskTypeController();
