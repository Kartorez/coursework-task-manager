import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import tokenService from '../service/tokenService.js';
import ApiError from '../error/ApiError.js';

class AuthController {
  async registration(req, res, next) {
    try {
      const { username, email, password } = req.body;
      if (!email || !password || !username) {
        return next(
          ApiError.badRequest('Username, email, and password required')
        );
      }

      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return next(ApiError.badRequest('User already exists'));
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, passwordHash });

      const tokens = tokenService.generateTokens({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken: tokens.accessToken,
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
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken: tokens.accessToken,
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await tokenService.removeToken(refreshToken);
      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) return next(ApiError.unauthorized());

      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) return next(ApiError.unauthorized());

      const user = await User.findByPk(userData.id);
      const tokens = tokenService.generateTokens({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      await tokenService.saveToken(user.id, tokens.refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        accessToken: tokens.accessToken,
      });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new AuthController();
