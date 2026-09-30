import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getTopics: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTopic: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=topicController.d.ts.map