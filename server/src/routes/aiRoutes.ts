import express from 'express';
import { assistant, learningInsight } from '../controllers/aiController';
import { protect } from '../middleware/auth';
const router = express.Router();
router.use(protect);
router.post('/assistant', assistant);
router.post('/learning-insight', learningInsight);
export default router;
