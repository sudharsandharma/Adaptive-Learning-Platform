import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getLearningPath: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const generateLearningPath: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateLearningPath: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=learningPathController.d.ts.map