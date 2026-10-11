import { Op } from 'sequelize';
import User from '../models/User.js';
import TeamMember from '../models/TeamMember.js';
import ApiError from '../error/ApiError.js';

class UserController {
  async getAll(req, res, next) {
    try {
      const { search } = req.query;

      const myTeamMemberships = await TeamMember.findAll({
        where: { user_id: req.user.id },
        attributes: ['team_id'],
      });

      const myTeamIds = myTeamMemberships.map((m) => m.team_id);

      let allowedUserIds = [req.user.id];

      if (myTeamIds.length > 0) {
        const teamMembers = await TeamMember.findAll({
          where: { team_id: { [Op.in]: myTeamIds } },
          attributes: ['user_id'],
        });
        const memberIds = teamMembers.map((m) => m.user_id);
        allowedUserIds = Array.from(new Set([...allowedUserIds, ...memberIds]));
      }

      const where = {
        id: { [Op.in]: allowedUserIds },
      };

      if (search) {
        where.username = { [Op.iLike]: `%${search}%` };
      }

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

  async searchGlobal(req, res, next) {
    try {
      const { search } = req.query;
      if (!search || search.trim().length < 2) {
        return res.json([]);
      }

      const users = await User.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.iLike]: `%${search.trim()}%` } },
            { email: { [Op.iLike]: `%${search.trim()}%` } },
          ],
        },
        attributes: ['id', 'username', 'email'],
        limit: 10,
      });

      res.json(users);
    } catch (e) {
      console.error('Помилка глобального пошуку користувачів:', e);
      next(ApiError.internal('Не вдалося знайти користувачів'));
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
