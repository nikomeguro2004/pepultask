const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'feedsys.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Promisify database operations
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID, affectedRows: this.changes });
      });
    }
  });
};

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create feedbacks table
      db.run(`
        CREATE TABLE IF NOT EXISTS feedbacks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          platform TEXT NOT NULL,
          module TEXT NOT NULL,
          description TEXT NOT NULL,
          attachments TEXT,
          tags TEXT,
          status TEXT DEFAULT 'New',
          votes INTEGER DEFAULT 0,
          created_by TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating feedbacks table:', err.message);
        else console.log('Feedbacks table created or already exists');
      });

      // Create logs table (sorted by date_time for activity tracking)
      db.run(`
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          activity TEXT NOT NULL,
          details TEXT,
          date_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating logs table:', err.message);
        else console.log('Logs table created or already exists');
      });

      // Create api_tracking table (holds all requests/responses with API details)
      db.run(`
        CREATE TABLE IF NOT EXISTS api_tracking (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          api_endpoint TEXT NOT NULL,
          request_method TEXT NOT NULL,
          request_body TEXT,
          response_status INTEGER,
          response_body TEXT,
          date_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating api_tracking table:', err.message);
        else console.log('API tracking table created or already exists');
      });

      resolve();
    });
  });
};

module.exports = {
  query,
  db,
  initializeDatabase
};
