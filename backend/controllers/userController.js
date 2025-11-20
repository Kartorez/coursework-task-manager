import { Op } from 'sequelize';
import User from '../models/User.js';
import ApiError from '../error/ApiError.js';

class UserController {
  async getAll(req, res, next) {
    try {
      const { search } = req.query;

      const where = search ? { username: { [Op.iLike]: `%${search}%` } } : {};

      const users = await User.findAll({
        where,
        attributes: ['id', 'username', 'email'],
        order: [['username', 'ASC']],
      });

      res.json(users);
    } catch (e) {
      console.error('Помилка при отриманні користувачів:', e);
      next(ApiError.internal('Не вдалося отримати список користувачів'));
    }
  }

  async me(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email'],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (e) {
      console.error('Помилка при отриманні поточного користувача:', e);
      res.status(500).json({ message: e.message });
    }
  }
}

export default new UserController();
