import Router from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import taskRouter from './taskRouter.js';
import columnRouter from './columnRouter.js';
import taskTypeRouter from './taskTypeRouter.js';
import teamRouter from './teamRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/tasks', taskRouter);
router.use('/columns', columnRouter);
router.use('/task-types', taskTypeRouter);
router.use('/teams', teamRouter);

export default router;
