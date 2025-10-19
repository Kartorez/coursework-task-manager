import User from '../models/User.js';
import ApiError from '../error/ApiError.js';

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'role', 'created_at'],
      });
      res.json(users);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async me(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'role', 'created_at'],
      });
      res.json(user);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'username', 'email', 'role', 'created_at'],
      });
      if (!user) {
        return next(ApiError.notFound('User not found'));
      }
      res.json(user);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      if (parseInt(id) !== req.user.id && req.user.role !== 'creator') {
        return next(ApiError.forbidden('Forbidden'));
      }
      const { username, email, role } = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        return next(ApiError.notFound('User not found'));
      }

      await user.update({
        username: username ?? user.username,
        email: email ?? user.email,
        role: role ?? user.role,
      });
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new UserController();
