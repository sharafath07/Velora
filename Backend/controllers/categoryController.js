const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;

    let query = {};
    
    // Only show active categories unless specifically requested
    if (includeInactive !== 'true') {
      query.isActive = true;
    }

    const categories = await Category.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get product count for this category
    const productCount = await Product.countDocuments({ 
      category: category._id, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        productCount
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private/Admin
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category name'
      });
    }

    const category = await Category.create({
      name,
      description,
      image
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productCount} products are associated with this category.`
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
