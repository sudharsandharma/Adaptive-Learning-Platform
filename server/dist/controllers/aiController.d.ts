import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const assistant: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const learningInsight: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=aiController.d.ts.map