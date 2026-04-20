require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const aiRoutes = require('./routes/ai');
const mergeRoutes = require('./routes/merge');

const app = express();

// CORS for production - include Vercel frontend URL
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://client-eta-mocha.vercel.app', 'http://localhost:3000']
    : 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/merge', mergeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
