import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.array('images', 5), handleUploadError, createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, admin, upload.array('images', 5), handleUploadError, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;