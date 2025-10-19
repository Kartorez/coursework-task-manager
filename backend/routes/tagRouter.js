import { Router } from 'express';
import tagController from '../controllers/tagController.js';
import authMiddleware from '../middleware/AuthMiddleWare.js';

const router = Router();

router.post('/', authMiddleware, tagController.create);
router.get('/', authMiddleware, tagController.getAll);
router.delete('/:id', authMiddleware, tagController.delete);

export default router;
