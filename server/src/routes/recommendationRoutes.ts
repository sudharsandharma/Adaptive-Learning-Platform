import express from 'express';
import { getRecommendations, generateRecommendations, updateRecommendation } from '../controllers/recommendationController';
import { protect } from '../middleware/auth';
const router = express.Router();
router.use(protect);
router.get('/', getRecommendations);
router.post('/generate', generateRecommendations);
router.put('/:id', updateRecommendation);
export default router;
