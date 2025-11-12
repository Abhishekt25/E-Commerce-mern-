"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const text_1 = require("../controllers/text");
const ProductController_1 = require("../controllers/ProductController");
const router = express_1.default.Router();
router.get('/test', text_1.text);
router.post('/products', ProductController_1.upload.single('image'), ProductController_1.addProduct);
exports.default = router;
