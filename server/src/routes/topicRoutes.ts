import express from 'express';
import { getTopics, getTopic } from '../controllers/topicController';
import { protect } from '../middleware/auth';
const router = express.Router();
router.use(protect);
router.get('/', getTopics);
router.get('/:id', getTopic);
export default router;
