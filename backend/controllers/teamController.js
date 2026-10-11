import { Op } from 'sequelize';
import Team from '../models/Team.js';
import TeamMember from '../models/TeamMember.js';
import User from '../models/User.js';
import ApiError from '../error/ApiError.js';

class TeamController {
  async getMyTeams(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          {
            model: Team,
            as: 'teams',
            include: [
              {
                model: User,
                as: 'members',
                attributes: ['id', 'username', 'email'],
                through: { attributes: ['role'] },
              },
              {
                model: User,
                as: 'owner',
                attributes: ['id', 'username', 'email'],
              },
            ],
          },
        ],
      });

      res.json(user?.teams || []);
    } catch (e) {
      console.error('Помилка при отриманні команд:', e);
      next(ApiError.internal('Не вдалося отримати команди'));
    }
  }

  async createTeam(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) {
        return next(ApiError.badRequest('Введіть назву команди'));
      }

      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const team = await Team.create({
        name: name.trim(),
        code,
        owner_id: req.user.id,
      });

      await TeamMember.create({
        team_id: team.id,
        user_id: req.user.id,
        role: 'owner',
      });

      const fullTeam = await Team.findByPk(team.id, {
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id', 'username', 'email'],
            through: { attributes: ['role'] },
          },
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      res.status(201).json(fullTeam);
    } catch (e) {
      console.error('Помилка при створенні команди:', e);
      next(ApiError.internal('Не вдалося створити команду'));
    }
  }

  async joinTeam(req, res, next) {
    try {
      const { code } = req.body;
      if (!code || !code.trim()) {
        return next(ApiError.badRequest('Введіть код команди'));
      }

      const team = await Team.findOne({
        where: { code: code.trim().toUpperCase() },
      });

      if (!team) {
        return next(ApiError.badRequest('Команду з таким кодом не знайдено'));
      }

      const existingMember = await TeamMember.findOne({
        where: { team_id: team.id, user_id: req.user.id },
      });

      if (existingMember) {
        return next(ApiError.badRequest('Ви вже є учасником цієї команди'));
      }

      await TeamMember.create({
        team_id: team.id,
        user_id: req.user.id,
        role: 'member',
      });

      const fullTeam = await Team.findByPk(team.id, {
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id', 'username', 'email'],
            through: { attributes: ['role'] },
          },
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      res.json(fullTeam);
    } catch (e) {
      console.error('Помилка при приєднанні до команди:', e);
      next(ApiError.internal('Не вдалося приєднатися до команди'));
    }
  }

  async addMember(req, res, next) {
    try {
      const { teamId } = req.params;
      const { identifier } = req.body;

      if (!identifier || !identifier.trim()) {
        return next(ApiError.badRequest('Введіть email або нікнейм користувача'));
      }

      const team = await Team.findByPk(teamId);
      if (!team) {
        return next(ApiError.badRequest('Команду не знайдено'));
      }

      const userToAdd = await User.findOne({
        where: {
          [Op.or]: [
            { username: identifier.trim() },
            { email: identifier.trim() },
          ],
        },
      });

      if (!userToAdd) {
        return next(ApiError.badRequest('Користувача не знайдено'));
      }

      const existing = await TeamMember.findOne({
        where: { team_id: teamId, user_id: userToAdd.id },
      });

      if (existing) {
        return next(ApiError.badRequest('Користувач вже є у цій команді'));
      }

      await TeamMember.create({
        team_id: teamId,
        user_id: userToAdd.id,
        role: 'member',
      });

      const fullTeam = await Team.findByPk(teamId, {
        include: [
          {
            model: User,
            as: 'members',
            attributes: ['id', 'username', 'email'],
            through: { attributes: ['role'] },
          },
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'username', 'email'],
          },
        ],
      });

      res.json(fullTeam);
    } catch (e) {
      console.error('Помилка при додаванні учасника:', e);
      next(ApiError.internal('Не вдалося додати учасника'));
    }
  }

  async removeMember(req, res, next) {
    try {
      const { teamId, userId } = req.params;
      const targetUserId = Number(userId) || req.user.id;

      const team = await Team.findByPk(teamId);
      if (!team) {
        return next(ApiError.badRequest('Команду не знайдено'));
      }

      const isOwner = Number(team.owner_id) === Number(req.user.id);
      const isSelf = Number(targetUserId) === Number(req.user.id);

      if (!isOwner && !isSelf) {
        return next(ApiError.badRequest('У вас немає прав для видалення цього учасника'));
      }

      await TeamMember.destroy({
        where: { team_id: teamId, user_id: targetUserId },
      });

      res.json({ message: 'Учасника видалено з команди' });
    } catch (e) {
      console.error('Помилка при видаленні учасника:', e);
      next(ApiError.internal('Не вдалося видалити учасника'));
    }
  }
}

export default new TeamController();
