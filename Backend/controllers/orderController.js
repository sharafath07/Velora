const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address'
      });
    }

    // Verify stock availability and validate products
    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product is not available: ${product.name}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Update product stock and sold count
    for (let item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          stock: -item.quantity,
          sold: item.quantity
        }
      });
    }

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/myorders
 * @desc    Get logged in user orders
 * @access  Private
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = { user: req.user._id };

    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('orderItems.product', 'name images price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name images price brand');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin only)
 * @access  Private/Admin
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;

    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    // Calculate statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      stats: stats[0] || { totalRevenue: 0, totalOrders: 0 },
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (Admin only)
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order status
    if (orderStatus) {
      order.orderStatus = orderStatus;

      // Set delivered date if status is delivered
      if (orderStatus === 'delivered' && !order.deliveredAt) {
        order.deliveredAt = Date.now();
      }

      // Set cancelled date if status is cancelled
      if (orderStatus === 'cancelled' && !order.cancelledAt) {
        order.cancelledAt = Date.now();
        
        // Restore product stock if order is cancelled
        for (let item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { 
              stock: item.quantity,
              sold: -item.quantity
            }
          });
        }
      }
    }

    // Update payment status
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;

      // Set paid date if payment is successful
      if (paymentStatus === 'paid' && !order.paidAt) {
        order.paidAt = Date.now();
      }
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order (Customer can cancel pending orders)
 * @access  Private
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = Date.now();

    // Restore product stock
    for (let item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          stock: item.quantity,
          sold: -item.quantity
        }
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete order (Admin only)
 * @access  Private/Admin
 */
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/stats/dashboard (Admin only)
 * @desc    Get order statistics for admin dashboard
 * @access  Private/Admin
 */
exports.getOrderStats = async (req, res, next) => {
  try {
    // Total orders and revenue
    const totalStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averageOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Orders by status
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        total: totalStats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
        byStatus: statusStats,
        monthlyRevenue,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
