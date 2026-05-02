import Router from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import taskRouter from './taskRouter.js';
import columnRouter from './columnRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/tasks', taskRouter);
router.use('/columns', columnRouter);

export default router;
