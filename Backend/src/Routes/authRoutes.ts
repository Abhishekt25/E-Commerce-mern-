import express from "express";
import {text, } from '../controllers/text'
import {upload,addProduct} from '../controllers/ProductController';
import {getProducts} from '../controllers/ProductController';

const router = express.Router();

router.get('/test', text);
router.post('/products', upload.single('image'), addProduct );
router.get('/products', getProducts);

export default router;
