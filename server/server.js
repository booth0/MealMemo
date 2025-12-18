// server/server.js
import dotenv from 'dotenv';
dotenv.config(); // Must be before other imports!

import express from 'express';
import cors from 'cors';
import { setupDatabase, testConnection } from './models/setup.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import recipesRoutes from './routes/recipesRoutes.js';
import submissionsRoutes from './routes/submissionsRoutes.js';
import featuredRoutes from './routes/featuredRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Config is loaded in config/database.js
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/featured', featuredRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/admin', adminRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Setup database tables
    await setupDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();