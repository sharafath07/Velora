import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;