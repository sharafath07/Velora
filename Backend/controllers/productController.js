const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering, sorting, and pagination
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sort, 
      page = 1, 
      limit = 12,
      inStock,
      featured 
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Filter featured products
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Search by name, description, or brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'price-low') sortOption.price = 1;
    else if (sort === 'price-high') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'popular') sortOption.sold = -1;
    else if (sort === 'rating') sortOption['ratings.average'] = -1;
    else sortOption.createdAt = -1; // Default sort

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products
 * @access  Public
 */
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 8;

    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private/Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      images,
      stock,
      brand,
      specifications,
      tags,
      isFeatured
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, and category'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPrice,
      category,
      images,
      stock: stock || 0,
      brand,
      specifications,
      tags,
      isFeatured: isFeatured || false
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const updateData = req.body;

    // If category is being updated, verify it exists
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/category/:categoryId
 * @desc    Get products by category
 * @access  Public
 */
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, sort } = req.query;

    // Verify category exists
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    let sortOption = {};
    if (sort === 'price-low') sortOption.price = 1;
    else if (sort === 'price-high') sortOption.price = -1;
    else sortOption.createdAt = -1;

    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      category: req.params.categoryId, 
      isActive: true 
    })
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments({ 
      category: req.params.categoryId, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug
      },
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock
 * @access  Private/Admin
 */
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid stock quantity'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};
