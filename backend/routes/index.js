import Router from 'express';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js';
import taskRouter from './taskRouter.js';
import tagRouter from './tagRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/tags', tagRouter);
router.use('/tasks', taskRouter);

export default router;
