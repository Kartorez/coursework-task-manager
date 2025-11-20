import ApiError from '../error/ApiError.js';
import tokenService from '../service/tokenService.js';

export default function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unauthorized('Authorization header missing'));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Token missing'));
    }
    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    req.user = userData;
    next();
  } catch (e) {
    console.error('Auth middleware error:', e);
    return next(ApiError.unauthorized('Authorization failed'));
  }
}
