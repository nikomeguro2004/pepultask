const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'feedsys.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

async function migrate() {
  console.log('Running database migration...');
  
  // Check if columns exist and add them if they don't
  db.all(`PRAGMA table_info(feedbacks)`, [], (err, columns) => {
    if (err) {
      console.error('Error checking table structure:', err);
      process.exit(1);
    }
    
    const hasVotes = columns.some(col => col.name === 'votes');
    const hasCreatedBy = columns.some(col => col.name === 'created_by');
    const hasStatus = columns.some(col => col.name === 'status');
    
    let completed = 0;
    const total = (hasVotes ? 0 : 1) + (hasCreatedBy ? 0 : 1) + (hasStatus ? 0 : 1);
    
    if (total === 0) {
      console.log('✅ Database already has all required columns');
      db.close();
      process.exit(0);
      return;
    }
    
    function checkComplete() {
      completed++;
      if (completed === total) {
        console.log('✅ Migration completed successfully!');
        db.close();
        process.exit(0);
      }
    }
    
    if (!hasVotes) {
      console.log('Adding votes column...');
      db.run(`ALTER TABLE feedbacks ADD COLUMN votes INTEGER DEFAULT 0`, (err) => {
        if (err) {
          console.error('Error adding votes column:', err);
          process.exit(1);
        }
        console.log('✓ Added votes column');
        checkComplete();
      });
    }
    
    if (!hasCreatedBy) {
      console.log('Adding created_by column...');
      db.run(`ALTER TABLE feedbacks ADD COLUMN created_by TEXT DEFAULT ''`, (err) => {
        if (err) {
          console.error('Error adding created_by column:', err);
          process.exit(1);
        }
        console.log('✓ Added created_by column');
        checkComplete();
      });
    }

    if (!hasStatus) {
      console.log('Adding status column...');
      db.run(`ALTER TABLE feedbacks ADD COLUMN status TEXT DEFAULT 'New'`, (err) => {
        if (err) {
          console.error('Error adding status column:', err);
          process.exit(1);
        }
        console.log('✓ Added status column');
        checkComplete();
      });
    }
  });
}

migrate();
