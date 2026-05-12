const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../supabase');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, subjects, school } = req.body;
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data, error } = await supabase
      .from('dse_users')
      .insert([{
        id,
        email,
        password: hashedPassword,
        name,
        role: role || 'teacher',
        subjects: JSON.stringify(subjects || []),
        school
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Registration failed' });
    }

    const token = jwt.sign({ id, email, name, role }, process.env.JWT_SECRET || 'default-secret-key');
    res.json({ token, user: { id, email, name, role, subjects, school } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('dse_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
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
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('dse_users')
      .select('id, email, name, role, subjects, school')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      ...user,
      subjects: JSON.parse(user.subjects || '[]')
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
