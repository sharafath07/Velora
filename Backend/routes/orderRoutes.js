const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.get('/stats/dashboard', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
