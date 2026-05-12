const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// AI routes (without multer)
try {
  const aiRoutes = require('./routes/ai');
  app.use('/api/ai', aiRoutes);
} catch (err) {
  console.error('Failed to load AI routes:', err);
}

// Merge routes (without multer)
try {
  const mergeRoutes = require('./routes/merge');
  app.use('/api/merge', mergeRoutes);
} catch (err) {
  console.error('Failed to load merge routes:', err);
}

// Resources routes - disabled on Vercel due to multer/file system limitations
// const resourceRoutes = require('./routes/resources');
// app.use('/api/resources', resourceRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Export for Vercel serverless functions
module.exports = app;
