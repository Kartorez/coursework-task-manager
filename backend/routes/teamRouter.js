import express from 'express';
import authMiddleware from '../middleware/AuthMiddleWare.js';
import teamController from '../controllers/teamController.js';

const router = express.Router();

router.get('/my', authMiddleware, teamController.getMyTeams);
router.post('/', authMiddleware, teamController.createTeam);
router.post('/join', authMiddleware, teamController.joinTeam);
router.post('/:teamId/members', authMiddleware, teamController.addMember);
router.delete('/:teamId/members/:userId', authMiddleware, teamController.removeMember);

export default router;
