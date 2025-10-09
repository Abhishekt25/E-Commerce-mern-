import express from "express";
import {text, } from '../controllers/text'
import {upload,addProduct} from '../controllers/ProductController';

const router = express.Router();

router.get('/test', text);
router.post('/products', upload.single('image'), addProduct );

export default router;
