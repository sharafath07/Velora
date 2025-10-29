const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (Customer)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
