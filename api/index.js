const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const aiRoutes = require('./routes/ai');
const mergeRoutes = require('./routes/merge');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/merge', mergeRoutes);

// Export for Vercel serverless functions
module.exports = app;
