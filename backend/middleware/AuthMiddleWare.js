import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.unauthorized());
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized());
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    next(ApiError.unauthorized('Invalid token'));
  }
}
