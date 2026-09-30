"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
};
const register = async (req, res, next) => {
    try {
        const { name, email, password, educationLevel, age, interests } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, error: 'Please provide name, email and password', message: 'Please provide name, email and password' });
            return;
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, error: 'User already exists with this email', message: 'User already exists with this email' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.User.create({
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
        const token = signToken(user._id);
        const userObj = user.toObject();
        delete userObj.passwordHash;
        res.status(201).json({
            success: true,
            token,
            user: userObj,
            data: { token, user: userObj },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, error: 'Please provide email and password', message: 'Please provide email and password' });
            return;
        }
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid credentials', message: 'Invalid credentials' });
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, error: 'Invalid credentials', message: 'Invalid credentials' });
            return;
        }
        const token = signToken(user._id);
        const userObj = user.toObject();
        delete userObj.passwordHash;
        res.status(200).json({
            success: true,
            token,
            user: userObj,
            data: { token, user: userObj },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        const user = await User_1.User.findById(req.user?._id).select('-passwordHash');
        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
//# sourceMappingURL=authController.js.map