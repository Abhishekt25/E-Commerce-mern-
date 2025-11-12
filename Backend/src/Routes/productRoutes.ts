import express from "express";
import { deleteProduct, getProducts, upload, addProduct,updateProduct,getProductById,getProductsByCategory, } 
        from "../controllers/ProductController";

const router = express.Router();

router.post('/', upload.single('image'), addProduct);
router.get('/', getProducts);
router.delete('/:id', deleteProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.get('/:id', getProductById);
router.get('/category/:category', getProductsByCategory);

export default router;
