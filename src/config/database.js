const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'school_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Database configuration:', {
  ...config,
  password: config.password ? '****' : 'not set'
});

const pool = mysql.createPool(config);

pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Failed to connect to MySQL database:', err);
    process.exit(1);
  });

module.exports = pool; 