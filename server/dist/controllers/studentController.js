"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOnboarding = exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const getProfile = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.user._id).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            'name', 'educationLevel', 'grade', 'age', 'interests',
            'preferences', 'goals',
        ];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }
        const user = await User_1.User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const completeOnboarding = async (req, res, next) => {
    try {
        const { educationLevel, interests, goals, preferences, } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user._id, {
            educationLevel: educationLevel || req.user.educationLevel,
            interests: interests || req.user.interests,
            goals: goals || req.user.goals,
            preferences: preferences || req.user.preferences,
            onboardingCompleted: true,
        }, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.completeOnboarding = completeOnboarding;
//# sourceMappingURL=studentController.js.map