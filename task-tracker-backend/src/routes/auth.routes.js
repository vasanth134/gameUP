"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Login routes
router.post("/login/parent", authController_1.parentLogin);
router.post("/login/child", authController_1.childLogin);
// Signup routes
router.post("/signup/parent", authController_1.parentSignup);
router.post("/signup/child", authController_1.childSignup);
exports.default = router;
