const mysql = require('mysql2');
const util = require('util');

const connectionString = process.env.DB_URI || process.env.DATABASE_URL || '';
let parsedConfig = {};

if (connectionString) {
  try {
    const url = new URL(connectionString);
    const sslMode = (url.searchParams.get('ssl-mode') || '').toLowerCase();
    parsedConfig = {
      host: url.hostname,
      port: url.port ? Number(url.port) : undefined,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname ? url.pathname.replace(/^\//, '') : undefined,
      ssl: sslMode === 'required' ? { rejectUnauthorized: false } : undefined
    };
  } catch (error) {
    console.error('Invalid DB_URI/DATABASE_URL:', error.message);
  }
}

const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;
const useSsl =
  ['true', '1'].includes((process.env.DB_SSL || '').toLowerCase()) ||
  Boolean(parsedConfig.ssl);

// Database configuration
const dbConfig = {
  host: parsedConfig.host || process.env.DB_HOST || 'localhost',
  port: parsedConfig.port || dbPort,
  user: parsedConfig.user || process.env.DB_USER || 'root',
  password: parsedConfig.password || process.env.DB_PASSWORD || '',
  database: parsedConfig.database || process.env.DB_NAME || 'feedsys_db',
  multipleStatements: true,
  ssl: useSsl ? { rejectUnauthorized: false } : undefined
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Promisify for async/await
const query = util.promisify(pool.query).bind(pool);

// Initialize database tables
const initializeDatabase = async () => {
  let connection;
  
  try {
    const skipCreateDb = ['true', '1'].includes(
      (process.env.DB_SKIP_CREATE_DB || '').toLowerCase()
    );

    connection = mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: skipCreateDb ? dbConfig.database : undefined,
      ssl: dbConfig.ssl
    });

    const connQuery = util.promisify(connection.query).bind(connection);

    if (!skipCreateDb) {
      // Create database if not exists
      await connQuery(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      console.log('Database created or already exists');

      await connQuery(`USE ${dbConfig.database}`);
    }

    // Create feedbacks table
    await connQuery(`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        platform VARCHAR(100) NOT NULL,
        module VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        attachments VARCHAR(500),
        tags VARCHAR(255),
        status VARCHAR(50) DEFAULT 'New',
        votes INT DEFAULT 0,
        created_by VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Feedbacks table created or already exists');

    // Create logs table
    await connQuery(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        activity VARCHAR(255) NOT NULL,
        details TEXT,
        date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Logs table created or already exists');

    // Create api_tracking table
    await connQuery(`
      CREATE TABLE IF NOT EXISTS api_tracking (
        id INT AUTO_INCREMENT PRIMARY KEY,
        api_endpoint VARCHAR(255) NOT NULL,
        request_method VARCHAR(10) NOT NULL,
        request_body TEXT,
        response_status INT,
        response_body TEXT,
        date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('API tracking table created or already exists');

    connection.end();
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.error('\n⚠️  MySQL is not running or not accessible!');
    console.error('Please check your database connection and try again.\n');
    
    if (connection) {
      try {
        connection.destroy();
      } catch (e) {
        // Ignore error when destroying failed connection
      }
    }
  }
};

module.exports = {
  query,
  pool,
  initializeDatabase
};
