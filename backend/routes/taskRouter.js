import { Router } from 'express';
import taskController from '../controllers/taskController.js';
import authMiddleware from '../middleware/AuthMiddleWare.js';

const router = Router();

router.post('/', authMiddleware, taskController.create);
router.get('/', authMiddleware, taskController.getAll);
router.put('/:id', authMiddleware, taskController.update);
router.delete('/:id', authMiddleware, taskController.delete);

router.patch('/:id/status', authMiddleware, (req, res, next) => taskController.changeStatus(req, res, next));
router.patch('/:id/column', authMiddleware, (req, res, next) => taskController.changeColumn(req, res, next));

export default router;
