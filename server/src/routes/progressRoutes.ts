import express from 'express';
import { getProgress, getTopicProgress, getProgressStats } from '../controllers/progressController';
import { protect } from '../middleware/auth';
const router = express.Router();
router.use(protect);
router.get('/', getProgress);
router.get('/topics', getTopicProgress);
router.get('/stats', getProgressStats);
export default router;
