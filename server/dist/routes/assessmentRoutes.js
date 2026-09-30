"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const assessmentController_1 = require("../controllers/assessmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/', assessmentController_1.getAssessments);
router.get('/:id', assessmentController_1.getAssessment);
router.post('/start', assessmentController_1.startAssessment);
router.post('/:id/submit', assessmentController_1.submitAssessment);
exports.default = router;
//# sourceMappingURL=assessmentRoutes.js.map