import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

// @desc    Get all products with filtering, pagination, and search
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    featured,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sort = '-createdAt'
  } = req.query;

  // Build query object
  let query = {};

  // Search by keyword
  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $in: [new RegExp(keyword, 'i')] } }
    ];
  }

  // Filter by category
  if (category) {
    const categoryDoc = await Category.findOne({ 
      name: { $regex: category, $options: 'i' } 
    });
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  // Filter by featured
  if (featured !== undefined) {
    query.featured = featured === 'true';
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find(query)
    .populate('category', 'name description')
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .lean();

  // Get total count for pagination
  const total = await Product.countDocuments(query);
  const totalPages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    data: products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    },
    filters: {
      keyword,
      category,
      featured,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    }
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name description');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    featured,
    specifications,
    tags
  } = req.body;

  // Check if category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error('Category not found');
  }

  const product = new Product({
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
    featured: featured || false,
    specifications: specifications || {},
    tags: tags || [],
    images: req.files ? req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      alt: name
    })) : []
  });

  const createdProduct = await product.save();
  await createdProduct.populate('category', 'name description');

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: createdProduct
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    featured,
    specifications,
    tags
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Update fields
  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price ? Number(price) : product.price;
  product.category = category || product.category;
  product.stock = stock ? Number(stock) : product.stock;
  product.featured = featured !== undefined ? featured : product.featured;
  product.specifications = specifications || product.specifications;
  product.tags = tags || product.tags;

  // Add new images if uploaded
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      alt: name || product.name
    }));
    product.images.push(...newImages);
  }

  const updatedProduct = await product.save();
  await updatedProduct.populate('category', 'name description');

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // TODO: Delete images from Cloudinary
  // This would require iterating through product.images and deleting each from Cloudinary

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true })
    .populate('category', 'name')
    .limit(8)
    .sort('-createdAt');

  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};