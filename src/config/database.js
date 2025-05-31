const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD ,
  // database: process.env.DB_NAME,
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0
  db_url : process.env.DB_URL 
};

console.log('Database configuration:', {
  ...config,
  password: config.password ? '****' : 'not set'
});

const pool = mysql.createPool(process.env.DB_URL);

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