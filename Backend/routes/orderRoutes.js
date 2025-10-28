const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById
  // getAllOrders,
  // updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
// router.get('/', protect, admin, getAllOrders);
// router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
