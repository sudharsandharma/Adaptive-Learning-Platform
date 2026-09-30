import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAssessments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAssessment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const startAssessment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const submitAssessment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=assessmentController.d.ts.map