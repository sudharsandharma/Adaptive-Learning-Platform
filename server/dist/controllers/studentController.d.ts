import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const completeOnboarding: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=studentController.d.ts.map