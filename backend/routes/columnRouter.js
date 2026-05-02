import { Router } from 'express';
import { Op } from 'sequelize';
import authMiddleware from '../middleware/AuthMiddleWare.js';
import columnController from '../controllers/сolumnController.js';

const router = Router();

router.get('/', authMiddleware, columnController.getAll.bind(columnController));
router.post(
  '/',
  authMiddleware,
  columnController.create.bind(columnController)
);
router.put(
  '/:id',
  authMiddleware,
  columnController.update.bind(columnController)
);
router.delete(
  '/:id',
  authMiddleware,
  columnController.delete.bind(columnController)
);

export default router;
