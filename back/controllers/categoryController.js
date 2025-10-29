import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ name: 1 })
    .select('-__v');

  res.json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category || !category.isActive) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({
    success: true,
    data: category
  });
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = new Category({
    name,
    description
  });

  const createdCategory = await category.save();

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: createdCategory
  });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  category.name = name || category.name;
  category.description = description || category.description;
  category.isActive = isActive !== undefined ? isActive : category.isActive;

  const updatedCategory = await category.save();

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory
  });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if category has products
  const Product = (await import('../models/productModel.js')).default;
  const productsCount = await Product.countDocuments({ category: category._id });

  if (productsCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete category with ${productsCount} products. Reassign products first.`);
  }

  await Category.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Category deleted successfully'
  });
});

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};