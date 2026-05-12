const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: './server/uploads/',
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// DSE Subjects
const DSE_SUBJECTS = [
  'Chinese Language', 'English Language', 'Mathematics', 'Liberal Studies',
  'Physics', 'Chemistry', 'Biology', 'Economics', 'History', 'Geography',
  'Chinese History', 'ICT', 'BAFS', 'Tourism & Hospitality'
];

const FORM_LEVELS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

// Get all resources (with filters)
router.get('/', (req, res) => {
  const { subject, form_level, search } = req.query;
  let query = 'SELECT * FROM resources WHERE 1=1';
  let params = [];

  if (subject) {
    query += ' AND subject = ?';
    params.push(subject);
  }
  if (form_level) {
    query += ' AND form_level = ?';
    params.push(form_level);
  }
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    res.json({ resources: rows, subjects: DSE_SUBJECTS, formLevels: FORM_LEVELS });
  });
});

// Upload resource
router.post('/', auth, upload.single('file'), (req, res) => {
  const { title, description, subject, form_level, topic } = req.body;
  const id = uuidv4();
  const file_path = req.file ? `/uploads/${req.file.filename}` : null;
  const file_type = req.file ? path.extname(req.file.originalname) : null;

  const stmt = db.prepare(
    'INSERT INTO resources (id, title, description, subject, form_level, topic, file_path, file_type, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );

  stmt.run([id, title, description, subject, form_level, topic, file_path, file_type, req.user.id], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Failed to create resource' });
    }
    res.json({ id, title, description, subject, form_level, topic, file_path, file_type });
  });
});

// Get DSE subjects list
router.get('/subjects', (req, res) => {
  res.json({ subjects: DSE_SUBJECTS, formLevels: FORM_LEVELS });
});

module.exports = router;
