const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Use /tmp on Vercel (serverless), local directory otherwise
const isVercel = process.env.VERCEL === '1';
const dbDir = isVercel ? '/tmp' : __dirname;
const dbPath = path.join(dbDir, 'dse_platform.db');

// Ensure directory exists (mainly for local dev)
if (!isVercel && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'teacher',
    subjects TEXT,
    school TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Resources table
  db.run(`CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    subject TEXT,
    form_level TEXT,
    topic TEXT,
    file_path TEXT,
    file_type TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Lessons table
  db.run(`CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    title TEXT,
    subject TEXT,
    form_level TEXT,
    objectives TEXT,
    content TEXT,
    duration INTEGER,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Quizzes table
  db.run(`CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    title TEXT,
    subject TEXT,
    form_level TEXT,
    questions TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Merged projects table
  db.run(`CREATE TABLE IF NOT EXISTS merged_projects (
    id TEXT PRIMARY KEY,
    title TEXT,
    subjects TEXT,
    content TEXT,
    teachers TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
