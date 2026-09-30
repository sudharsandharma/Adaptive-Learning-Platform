import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTopicProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProgressStats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=progressController.d.ts.map