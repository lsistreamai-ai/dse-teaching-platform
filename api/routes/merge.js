const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const auth = require('../middleware/auth');

// Merge worksheets/content from multiple subjects
router.post('/worksheets', auth, (req, res) => {
  const { title, subjects, teacherIds, mergedContent } = req.body;
  const id = uuidv4();

  // Create merged project
  const mergedProject = {
    id,
    title,
    subjects: subjects.join(', '),
    content: {
      introduction: `This interdisciplinary project combines ${subjects.join(' and ')}.`,
      sections: subjects.map((subject, index) => ({
        subject,
        content: mergedContent?.[index] || `${subject} section content`,
        teacher: teacherIds?.[index]
      })),
      collaborativeActivities: [
        'Group discussion across subjects',
        'Cross-curricular project work',
        'Integrated assessment tasks'
      ]
    },
    teachers: teacherIds,
    createdAt: new Date().toISOString()
  };

  // Save to database
  const stmt = db.prepare(
    'INSERT INTO merged_projects (id, title, subjects, content, teachers) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run([id, title, JSON.stringify(mergedProject.subjects), JSON.stringify(mergedProject.content), JSON.stringify(teacherIds)]);

  res.json(mergedProject);
});

// Get merge suggestions for cross-subject collaboration
router.get('/suggestions', auth, (req, res) => {
  const suggestions = [
    {
      subjects: ['Mathematics', 'Physics'],
      theme: 'Applied Mathematics in Physics',
      description: 'Explore mathematical concepts through physics applications',
      topics: ['Vectors in mechanics', 'Calculus in motion', 'Statistics in experiments']
    },
    {
      subjects: ['Chinese Language', 'Chinese History'],
      theme: 'Literature Through Historical Lens',
      description: 'Study classical Chinese texts in their historical context',
      topics: ['Tang dynasty poetry', 'Historical essays', 'Classical philosophy']
    },
    {
      subjects: ['English Language', 'History'],
      theme: 'Historical Documents Analysis',
      description: 'Critical reading of historical English documents',
      topics: ['Primary source analysis', 'Historical narratives', 'Research writing']
    },
    {
      subjects: ['Biology', 'Chemistry'],
      theme: 'Biochemistry Bridge',
      description: 'Understanding biological processes at molecular level',
      topics: ['Cellular respiration', 'Enzymes', 'DNA and proteins']
    },
    {
      subjects: ['Geography', 'Economics'],
      theme: 'Economic Geography',
      description: 'Study economic activities through geographical perspective',
      topics: ['Urban development', 'Resource management', 'Trade patterns']
    },
    {
      subjects: ['ICT', 'Mathematics'],
      theme: 'Computational Mathematics',
      description: 'Programming solutions for mathematical problems',
      topics: ['Algorithms', 'Data analysis', 'Simulation']
    }
  ];

  res.json({ suggestions });
});

// Get all merged projects
router.get('/projects', (req, res) => {
  db.all('SELECT * FROM merged_projects ORDER BY created_at DESC', [], (err, rows) => {
    const projects = rows.map(row => ({
      ...row,
      subjects: JSON.parse(row.subjects),
      content: JSON.parse(row.content),
      teachers: JSON.parse(row.teachers)
    }));
    res.json({ projects });
  });
});

module.exports = router;
