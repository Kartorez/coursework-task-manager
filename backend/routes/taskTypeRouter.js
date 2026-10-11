import { Router } from 'express';
import taskTypeController from '../controllers/taskTypeController.js';
import authMiddleware from '../middleware/AuthMiddleWare.js';

const router = Router();

router.use(authMiddleware);

router.get('/', taskTypeController.getAll);
router.post('/', taskTypeController.create);
router.put('/:id', taskTypeController.update);
router.delete('/:id', taskTypeController.delete);

export default router;
