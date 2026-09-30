import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getResources: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getRecommendedResources: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=resourceController.d.ts.map