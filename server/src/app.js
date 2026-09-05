const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const setupSwagger = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Packers Mart MVP Backend API', timestamp: new Date() });
});

// Register Swagger Interactive API Documentation
setupSwagger(app);

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Packers Mart Backend Server running on http://localhost:${PORT}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
