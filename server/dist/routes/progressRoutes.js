"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const progressController_1 = require("../controllers/progressController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/', progressController_1.getProgress);
router.get('/topics', progressController_1.getTopicProgress);
router.get('/stats', progressController_1.getProgressStats);
exports.default = router;
//# sourceMappingURL=progressRoutes.js.map