import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Verify all products exist and have sufficient stock
  for (let item of orderItems) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for: ${item.name}. Available: ${product.stock}`);
    }
  }

  // Create order
  const order = new Order({
    user: req.user._id,
    orderItems: orderItems.map(item => ({
      ...item,
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity
    })),
    shippingAddress,
    paymentMethod
  });

  const createdOrder = await order.save();

  // Update product stock
  for (let item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } }
    );
  }

  await createdOrder.populate('user', 'name email');
  await createdOrder.populate('orderItems.product', 'name images');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: createdOrder
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('orderItems.product', 'name images');

  const total = await Order.countDocuments({ user: req.user._id });

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find()
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');

  const total = await Order.countDocuments();

  res.json({
    success: true,
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address
  };

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order paid successfully',
    data: updatedOrder
  });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order delivered successfully',
    data: updatedOrder
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder
  });
});

export {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus
};