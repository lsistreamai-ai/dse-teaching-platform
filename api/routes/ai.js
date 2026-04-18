const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const auth = require('../middleware/auth');

// DSE Subject templates
const SUBJECT_CONTENT = {
  'Chinese Language': {
    topics: ['文言文', '白話文', '寫作', '說話', '聆聽', '綜合能力'],
    questionTypes: ['閱讀理解', '寫作題', '說話評估']
  },
  'English Language': {
    topics: ['Reading', 'Writing', 'Listening', 'Speaking', 'Grammar', 'Vocabulary'],
    questionTypes: ['Comprehension', 'Essay', 'Cloze Passage', 'Proofreading']
  },
  'Mathematics': {
    topics: ['Algebra', 'Geometry', 'Statistics', 'Calculus', 'Trigonometry', 'Probability'],
    questionTypes: ['Calculation', 'Proof', 'Application', 'MCQ']
  },
  'Physics': {
    topics: ['Mechanics', 'Heat', 'Waves', 'Electricity', 'Magnetism', 'Atomic Physics'],
    questionTypes: ['Calculation', 'Conceptual', 'Experimental']
  },
  'Chemistry': {
    topics: ['Atomic Structure', 'Bonding', 'Organic Chemistry', 'Redox', 'Acids & Bases'],
    questionTypes: ['Calculation', 'Explanation', 'Experimental']
  },
  'Biology': {
    topics: ['Cells', 'Genetics', 'Human Body', 'Ecosystems', 'Biotechnology'],
    questionTypes: ['MCQ', 'Short Answer', 'Essay', 'Data Analysis']
  }
};

// Lesson Plan Generator
router.post('/lesson-plan', auth, (req, res) => {
  const { subject, formLevel, topic, duration, objectives } = req.body;
  const id = uuidv4();

  // Generate lesson plan structure
  const lessonPlan = {
    title: `${topic} - ${formLevel} ${subject}`,
    subject,
    formLevel,
    topic,
    duration: duration || 40,
    objectives: objectives || [
      `Students will understand key concepts of ${topic}`,
      `Students will be able to apply ${topic} knowledge`,
      `Students will practice problem-solving skills`
    ],
    structure: {
      warmUp: { duration: 5, activities: [`Review previous lesson on related topics`, `Quick quiz on prior knowledge`] },
      mainActivity: { duration: 25, activities: [
        `Introduce ${topic} concepts with examples`,
        `Guided practice exercises`,
        `Group discussion and problem-solving`
      ]},
      wrapUp: { duration: 10, activities: [`Summary of key points`, `Exit ticket or quick assessment`, `Preview next lesson`] }
    },
    materials: ['Textbook', 'Worksheet', 'Presentation slides', 'Whiteboard markers'],
    assessment: `End-of-lesson quiz on ${topic}`,
    differentiation: ['Provide extra support for struggling students', 'Extension activities for advanced learners']
  };

  // Save to database
  const stmt = db.prepare(
    'INSERT INTO lessons (id, title, subject, form_level, objectives, content, duration, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  stmt.run([id, lessonPlan.title, subject, formLevel, JSON.stringify(lessonPlan.objectives), JSON.stringify(lessonPlan), lessonPlan.duration, req.user.id]);

  res.json(lessonPlan);
});

// Presentation Maker
router.post('/presentation', auth, (req, res) => {
  const { subject, topic, slideCount } = req.body;

  const presentation = {
    title: `${topic} - ${subject}`,
    slides: []
  };

  for (let i = 1; i <= (slideCount || 10); i++) {
    presentation.slides.push({
      number: i,
      title: i === 1 ? `${topic} - Introduction` : `Slide ${i}`,
      content: i === 1 
        ? ['Learning objectives', 'Overview of the topic']
        : i === slideCount 
          ? ['Summary', 'Key takeaways', 'Questions?']
          : [`Content point ${i-1}`, `Examples and illustrations`, `Key concepts to remember`],
      speakerNotes: `Speaker notes for slide ${i}`
    });
  }

  res.json(presentation);
});

// Quiz Generator (DSE-style)
router.post('/quiz', auth, (req, res) => {
  const { subject, formLevel, topic, questionCount, questionTypes } = req.body;
  const id = uuidv4();

  const subjectData = SUBJECT_CONTENT[subject] || { topics: [], questionTypes: ['MCQ', 'Short Answer'] };
  
  const questions = [];
  for (let i = 1; i <= (questionCount || 10); i++) {
    const type = questionTypes?.[i % (questionTypes?.length || 1)] || 'MCQ';
    
    questions.push({
      number: i,
      type,
      question: `Sample ${type} question ${i} about ${topic}`,
      options: type === 'MCQ' ? ['A. Option 1', 'B. Option 2', 'C. Option 3', 'D. Option 4'] : null,
      marks: type === 'MCQ' ? 1 : type === 'Short Answer' ? 3 : 5,
      answer: type === 'MCQ' ? 'A' : 'Sample answer provided',
      dseStyle: true
    });
  }

  const quiz = {
    id,
    title: `${topic} Quiz - ${formLevel} ${subject}`,
    subject,
    formLevel,
    topic,
    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
    duration: Math.ceil(questionCount * 2), // minutes
    questions
  };

  // Save to database
  const stmt = db.prepare(
    'INSERT INTO quizzes (id, title, subject, form_level, questions, created_by) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run([id, quiz.title, subject, formLevel, JSON.stringify(questions), req.user.id]);

  res.json(quiz);
});

// Smart Marking Tool
router.post('/mark', auth, (req, res) => {
  const { studentAnswers, markingScheme } = req.body;

  const results = studentAnswers.map((answer, index) => {
    const correct = markingScheme[index]?.answer;
    const marks = markingScheme[index]?.marks || 1;
    
    return {
      questionNumber: index + 1,
      studentAnswer: answer,
      correctAnswer: correct,
      isCorrect: answer === correct,
      marksAwarded: answer === correct ? marks : 0,
      maxMarks: marks,
      feedback: answer === correct 
        ? 'Correct!' 
        : `Incorrect. The correct answer is: ${correct}`
    };
  });

  const totalMarks = results.reduce((sum, r) => sum + r.marksAwarded, 0);
  const maxMarks = results.reduce((sum, r) => sum + r.maxMarks, 0);
  const percentage = Math.round((totalMarks / maxMarks) * 100);

  res.json({
    results,
    summary: {
      totalMarks,
      maxMarks,
      percentage,
      grade: percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'
    }
  });
});

// Get subject info
router.get('/subjects', (req, res) => {
  res.json({ subjects: SUBJECT_CONTENT });
});

module.exports = router;
