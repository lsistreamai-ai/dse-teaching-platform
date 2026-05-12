const fs = require('fs');
const path = require('path');

// Use /tmp on Vercel (serverless), local directory otherwise
const isVercel = process.env.VERCEL === '1';
const dbDir = isVercel ? '/tmp' : __dirname;
const dbPath = path.join(dbDir, 'dse_platform.json');

// Initialize database
let db = { users: [], resources: [], lessons: [], quizzes: [], merged_projects: [] };

// Load existing data
try {
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf8');
    db = JSON.parse(data);
    // Ensure all collections exist
    db.users = db.users || [];
    db.resources = db.resources || [];
    db.lessons = db.lessons || [];
    db.quizzes = db.quizzes || [];
    db.merged_projects = db.merged_projects || [];
  }
} catch (err) {
  console.error('Error loading database:', err);
}

// Save to file
function save() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// Simple query interface similar to sqlite3
const database = {
  // Get a single row
  get: (sql, params, callback) => {
    try {
      if (sql.includes('FROM users WHERE email')) {
        const user = db.users.find(u => u.email === params[0]);
        callback(null, user || null);
      } else if (sql.includes('FROM users WHERE id')) {
        const user = db.users.find(u => u.id === params[0]);
        callback(null, user || null);
      } else {
        callback(null, null);
      }
    } catch (err) {
      callback(err, null);
    }
  },
  
  // Run an insert/update/delete
  run: function(sql, params, callback) {
    try {
      if (sql.includes('INSERT INTO users')) {
        const user = {
          id: params[0],
          email: params[1],
          password: params[2],
          name: params[3],
          role: params[4],
          subjects: params[5],
          school: params[6],
          created_at: new Date().toISOString()
        };
        db.users.push(user);
        save();
        callback.call({ lastID: user.id, changes: 1 }, null);
      } else {
        callback(null);
      }
    } catch (err) {
      callback(err);
    }
  },
  
  // Get all rows
  all: (sql, params, callback) => {
    try {
      if (sql.includes('FROM users')) {
        callback(null, db.users);
      } else {
        callback(null, []);
      }
    } catch (err) {
      callback(err, null);
    }
  },
  
  // Prepare statement (returns object with run method)
  prepare: function(sql) {
    return {
      run: (params, callback) => this.run(sql, params, callback)
    };
  }
};

module.exports = database;
