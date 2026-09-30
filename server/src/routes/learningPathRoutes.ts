import express from 'express';
import { getLearningPath, generateLearningPath, updateLearningPath } from '../controllers/learningPathController';
import { protect } from '../middleware/auth';
const router = express.Router();
router.use(protect);
router.get('/', getLearningPath);
router.post('/generate', generateLearningPath);
router.put('/:id', updateLearningPath);
export default router;
