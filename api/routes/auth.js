const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Register
router.post('/register', (req, res) => {
  const { email, password, name, role, subjects, school } = req.body;
  const id = uuidv4();
  const hashedPassword = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(
    'INSERT INTO users (id, email, password, name, role, subjects, school) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  
  stmt.run([id, email, hashedPassword, name, role || 'teacher', JSON.stringify(subjects || []), school], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const token = jwt.sign({ id, email, name, role }, process.env.JWT_SECRET || 'default-secret-key');
    res.json({ token, user: { id, email, name, role, subjects, school } });
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'default-secret-key'
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subjects: JSON.parse(user.subjects || '[]'),
        school: user.school
      }
    });
  });
});

// Get current user
router.get('/me', require('../middleware/auth'), (req, res) => {
  db.get('SELECT id, email, name, role, subjects, school FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      ...user,
      subjects: JSON.parse(user.subjects || '[]')
    });
  });
});

module.exports = router;
