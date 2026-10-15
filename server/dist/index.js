"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const assessmentRoutes_1 = __importDefault(require("./routes/assessmentRoutes"));
const topicRoutes_1 = __importDefault(require("./routes/topicRoutes"));
const resourceRoutes_1 = __importDefault(require("./routes/resourceRoutes"));
const learningPathRoutes_1 = __importDefault(require("./routes/learningPathRoutes"));
const progressRoutes_1 = __importDefault(require("./routes/progressRoutes"));
const recommendationRoutes_1 = __importDefault(require("./routes/recommendationRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (origin.includes('localhost') ||
            origin.includes('127.0.0.1') ||
            origin.endsWith('.vercel.app') ||
            (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
// Ensure DB connection for serverless requests
app.use(async (_req, _res, next) => {
    try {
        await (0, database_1.connectDB)();
        next();
    }
    catch (error) {
        next(error);
    }
});
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/student', studentRoutes_1.default);
app.use('/api/assessments', assessmentRoutes_1.default);
app.use('/api/topics', topicRoutes_1.default);
app.use('/api/resources', resourceRoutes_1.default);
app.use('/api/learning-path', learningPathRoutes_1.default);
app.use('/api/progress', progressRoutes_1.default);
app.use('/api/recommendations', recommendationRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
// Error handler
app.use(errorHandler_1.errorHandler);
// Start server
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(config_1.config.port, () => {
            console.log(`\n🚀 NOMAD server running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
            console.log(`📡 API: http://localhost:${config_1.config.port}/api`);
            console.log(`💚 Health: http://localhost:${config_1.config.port}/api/health\n`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Only listen directly when not running in Vercel serverless environment
if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
    startServer();
}
exports.default = app;
// @ts-ignore CommonJS export compatibility
module.exports = app;
// @ts-ignore
module.exports.default = app;
//# sourceMappingURL=index.js.map