import express from 'express';
import authMiddleware from '../middleware/AuthMiddleWare.js';
import User from '../models/User.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/me', authMiddleware, userController.me);
router.get('/search-global', authMiddleware, userController.searchGlobal);
router.get('/', authMiddleware, userController.getAll);

export default router;
