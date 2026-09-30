import express from 'express';
import { getProfile, updateProfile, completeOnboarding } from '../controllers/studentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/onboarding', completeOnboarding);

export default router;
