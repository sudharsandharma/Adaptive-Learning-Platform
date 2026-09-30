import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

const signToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, educationLevel, age, interests } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'Please provide name, email and password', message: 'Please provide name, email and password' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User already exists with this email', message: 'User already exists with this email' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      educationLevel: educationLevel || '',
      age,
      interests: interests || ['Computer Science', 'Mathematics'],
      goals: [],
      preferences: {
        resourceTypes: ['video', 'interactive'],
        studyTimePerDay: 60,
        difficultyProgression: 'moderate',
        learningStyle: 'visual',
      },
    });

    const token = signToken(user._id as unknown as string);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    res.status(201).json({
      success: true,
      token,
      user: userObj,
      data: { token, user: userObj },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Please provide email and password', message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials', message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid credentials', message: 'Invalid credentials' });
      return;
    }

    const token = signToken(user._id as unknown as string);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    res.status(200).json({
      success: true,
      token,
      user: userObj,
      data: { token, user: userObj },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
