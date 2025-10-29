const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  updateStock
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.patch('/:id/stock', protect, admin, updateStock);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
