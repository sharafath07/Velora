require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

/**
 * Script to create an admin user
 * Run: npm run create-admin
 */
const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@velora.com' });

    if (adminExists) {
      console.log('❌ Admin user already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Velora Admin',
      email: 'admin@velora.com',
      password: 'admin123456', // Change this password immediately after first login!
      role: 'admin',
      phone: '1234567890',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@velora.com');
    console.log('🔑 Password: admin123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the script
createAdmin();
