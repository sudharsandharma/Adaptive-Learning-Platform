import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getRecommendations: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const generateRecommendations: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateRecommendation: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=recommendationController.d.ts.map