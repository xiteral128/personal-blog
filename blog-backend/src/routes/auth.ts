import { Router } from 'express';
import { getProfile, login, logout, refreshSession } from '../controllers/authController';
import { authMiddleware } from '../shared/middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshSession);
router.get('/me', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logout);

export default router;
