import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Token from '../models/Token.js';
import tokenService from '../service/tokenService.js';
import ApiError from '../error/ApiError.js';

class AuthController {
  async registration(req, res, next) {
    try {
      const { username, email, password } = req.body;
      if (!email || !password || !username) {
        return next(
          ApiError.badRequest('Username, email and password are required')
        );
      }

      const existing = await User.findOne({ where: { email } });
      if (existing) return next(ApiError.badRequest('User already exists'));

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, passwordHash });

      const tokens = tokenService.generateTokens({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);
      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        ...tokens,
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return next(ApiError.badRequest('Email and password required'));

      const user = await User.findOne({ where: { email } });
      if (!user) return next(ApiError.badRequest('User not found'));

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return next(ApiError.badRequest('Wrong password'));

      const tokens = tokenService.generateTokens({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);
      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        ...tokens,
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return next(ApiError.badRequest('Refresh token required'));
      await tokenService.removeToken(refreshToken);
      res.json({ message: 'Logged out' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  // optional: refresh tokens
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return next(ApiError.unauthorized());

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) return next(ApiError.unauthorized());

      const user = await User.findByPk(userData.id);
      const tokens = tokenService.generateTokens({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        ...tokens,
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new AuthController();
