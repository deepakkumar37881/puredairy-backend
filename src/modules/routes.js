import express from 'express';
// Temporarily commented out imports to fix server startup
// import authRoutes from './auth/routes/authRoutes.js';
import productRoutes from './products/routes/productRoutes.js';
// import categoryRoutes from './products/routes/categoryRoutes.js';
// import cartRoutes from './orders/routes/cartRoutes.js';
// import orderRoutes from './orders/routes/orderRoutes.js';
// import paymentRoutes from './payments/routes/paymentRoutes.js';
// import reviewRoutes from './products/routes/reviewRoutes.js';
// import adminRoutes from './admin/routes/adminRoutes.js';
// import seasonalRoutes from './seasonal/routes/seasonalRoutes.js';
// import uploadRoutes from './admin/routes/uploadRoutes.js';
// import userRoutes from './users/routes/userRoutes.js';
// import discountRoutes from './admin/routes/discountRoutes.js';

import seedDatabase from '../seeds/seedDatabase.js';

const router = express.Router();
router.get('/abc123', (req, res) => {
  res.send('ABC WORKING');
});

// API version prefix
const API_VERSION = '/api/v1';

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Organic Hub API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
router.use(`${API_VERSION}/products`, productRoutes);

// ===============================
// TEMPORARY DATABASE SEED ROUTE
// ===============================
router.get('/seed-db', async (req, res) => {
  try {
    await seedDatabase();

    res.json({
      success: true,
      message: 'Database seeded successfully'
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ===============================
// 404 Handler (ALWAYS LAST)
// ===============================
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

export default router;