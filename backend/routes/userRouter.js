import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/AuthMiddleWare.js';

const router = Router();

router.get('/', authMiddleware, userController.getAll);
router.get('/me', authMiddleware, userController.me);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id', authMiddleware, userController.update);

export default router;
