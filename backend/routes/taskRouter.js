import { Router } from 'express';
import taskController from '../controllers/taskController.js';
import authMiddleware from '../middleware/AuthMiddleWare.js';

const router = Router();

router.post('/', authMiddleware, taskController.create);
router.get('/', authMiddleware, taskController.getAll);
router.get('/:id', authMiddleware, taskController.getById);
router.put('/:id', authMiddleware, taskController.update);
router.delete('/:id', authMiddleware, taskController.delete);

router.patch('/:id/status', authMiddleware, taskController.changeStatus);
router.patch('/:id/assignees', authMiddleware, taskController.setAssignees);

export default router;
