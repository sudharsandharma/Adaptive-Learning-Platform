"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/profile', studentController_1.getProfile);
router.put('/profile', studentController_1.updateProfile);
router.post('/onboarding', studentController_1.completeOnboarding);
exports.default = router;
//# sourceMappingURL=studentRoutes.js.map