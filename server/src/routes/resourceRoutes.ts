import express from 'express';
import { getResources, getRecommendedResources } from '../controllers/resourceController';
import { protect } from '../middleware/auth';
const router = express.Router();
router.use(protect);
router.get('/', getResources);
router.get('/recommended', getRecommendedResources);
export default router;
