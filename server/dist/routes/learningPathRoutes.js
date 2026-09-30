"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const learningPathController_1 = require("../controllers/learningPathController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/', learningPathController_1.getLearningPath);
router.post('/generate', learningPathController_1.generateLearningPath);
router.put('/:id', learningPathController_1.updateLearningPath);
exports.default = router;
//# sourceMappingURL=learningPathRoutes.js.map