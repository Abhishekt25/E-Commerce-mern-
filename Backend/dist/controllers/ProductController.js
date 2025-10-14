"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = exports.upload = void 0;
const Product_1 = require("../models/Product");
const multer_1 = __importDefault(require("multer"));
// Multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
exports.upload = (0, multer_1.default)({ storage });
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { product, sku, stock, price, status, variants, marketplaces } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        // Convert marketplaces object to array of selected marketplaces
        const selectedMarketplaces = Object.keys(JSON.parse(marketplaces || '{}')).filter((key) => JSON.parse(marketplaces)[key]);
        // Convert variants string to array
        const variantsArray = variants ? variants.split(',').map((v) => v.trim()) : [];
        const newProduct = new Product_1.Product({
            product,
            sku,
            stock: Number(stock),
            price: Number(price),
            status,
            variants: variantsArray,
            marketplaces: selectedMarketplaces,
            image,
            createdAt: new Date(),
        });
        const savedProduct = yield newProduct.save();
        res.status(201).json({ message: 'Product saved to MongoDB', id: savedProduct._id });
    }
    catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Error saving product', error });
    }
});
exports.addProduct = addProduct;
