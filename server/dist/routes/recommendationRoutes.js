"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationController_1 = require("../controllers/recommendationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/', recommendationController_1.getRecommendations);
router.post('/generate', recommendationController_1.generateRecommendations);
router.put('/:id', recommendationController_1.updateRecommendation);
exports.default = router;
//# sourceMappingURL=recommendationRoutes.js.map